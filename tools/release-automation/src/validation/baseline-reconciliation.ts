import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isBaselineMarker, isStablePromotionMarker, type BaselineMarker } from "../core/marker";
import { type GitHubPullRequest } from "../core/github";
import { trustedVersionMarker } from "../publish/publish-state";
import { hasPublishReceiptReadyForBaseline } from "../publish/publish-state";
import { versionsDigest } from "../publish/create-baseline-reconciliation";

interface Client {
  request<T>(path: string): Promise<T>;
  paginate<T>(path: string): Promise<T[]>;
}

const allowedGenerated = new Set([
  "bun.lock",
  "packages/rootage/__generated__/index.json",
  "packages/rootage/__generated__/index.d.ts",
]);

function isAllowed(path: string): boolean {
  return (
    allowedGenerated.has(path) ||
    path === "package.json" ||
    path.endsWith("/package.json") ||
    path.endsWith("/CHANGELOG.md")
  );
}

async function git(cwd: string, args: string[], stdin?: string): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    ...(stdin === undefined ? {} : { stdin: new Blob([stdin]) }),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`baseline 검증 git ${args[0]} 실패: ${stderr.trim()}`);
  return stdout.trim();
}

export async function verifyBaselineReconciliation(options: {
  repositoryPath: string;
  repository: string;
  marker: BaselineMarker;
  baseSha: string;
  headSha: string;
  client: Client;
}): Promise<void> {
  const { baseSha, client, headSha, marker, repository, repositoryPath } = options;
  if (
    !isBaselineMarker(marker) ||
    marker.expectedBaseSha !== baseSha ||
    marker.expectedHeadSha !== headSha
  ) {
    throw new Error("baseline marker의 exact target base/head 결속이 올바르지 않습니다.");
  }
  const stablePull = await client.request<GitHubPullRequest>(
    `/repos/${repository}/pulls/${marker.stablePr}`,
  );
  const stableMarker = trustedVersionMarker(
    {
      author: stablePull.user.login,
      body: stablePull.body ?? "",
      baseRef: stablePull.base.ref,
      headRef: stablePull.head.ref,
      baseRepository: stablePull.base.repo.full_name,
      headRepository: stablePull.head.repo?.full_name ?? "",
    },
    stablePull.head.sha,
  );
  if (
    !stableMarker ||
    !isStablePromotionMarker(stableMarker) ||
    stablePull.merge_commit_sha !== marker.stableMergeSha ||
    !stablePull.merged_by?.login ||
    stablePull.merged_by.login.endsWith("[bot]")
  ) {
    throw new Error("baseline source가 exact human-merged Stable Version PR이 아닙니다.");
  }
  const sibling = stableMarker.lane === "minor" ? "major" : "minor";
  if (marker.lane !== "dev" && marker.lane !== sibling) {
    throw new Error("baseline target은 dev 또는 stable source의 dormant sibling이어야 합니다.");
  }
  if (
    marker.lane !== "dev" &&
    (await git(repositoryPath, ["show", `${baseSha}:.changeset/pre.json`]).catch(() => null))
  ) {
    throw new Error("baseline sibling target은 exact dormant 상태여야 합니다.");
  }
  if (
    !(await hasPublishReceiptReadyForBaseline(
      client,
      repository,
      marker.stableMergeSha,
      marker.publishRunId,
      stableMarker.lane,
      stablePull.head.sha,
    ))
  ) {
    throw new Error("baseline marker가 exact production publish receipt/run과 다릅니다.");
  }
  await git(repositoryPath, [
    "fetch",
    "--no-tags",
    "origin",
    "+refs/heads/minor:refs/remotes/origin/minor",
    "+refs/heads/major:refs/remotes/origin/major",
  ]);
  const changed = (
    await git(repositoryPath, [
      "diff",
      "--name-only",
      stableMarker.expectedBaseSha,
      marker.stableMergeSha,
      "--",
    ])
  )
    .split("\n")
    .filter(Boolean);
  const files = changed.filter(isAllowed).sort();
  const published = [];
  for (const path of files.filter(
    (file) => file === "package.json" || file.endsWith("/package.json"),
  )) {
    const value = JSON.parse(
      await git(repositoryPath, ["show", `${marker.stableMergeSha}:${path}`]),
    ) as Record<string, unknown>;
    if (value.private === true) continue;
    if (typeof value.name !== "string" || typeof value.version !== "string") {
      throw new Error(`${path}의 published package identity가 올바르지 않습니다.`);
    }
    published.push({ name: value.name, version: value.version });
  }
  if (versionsDigest(published) !== marker.versionsSha256) {
    throw new Error("baseline versions digest가 exact Stable Version 산출물과 다릅니다.");
  }
  const actualFiles = (await git(repositoryPath, ["diff", "--name-only", baseSha, headSha, "--"]))
    .split("\n")
    .filter(Boolean)
    .sort();
  if (JSON.stringify(files) !== JSON.stringify(actualFiles)) {
    throw new Error("baseline PR file 집합이 Stable Version 허용 산출물과 다릅니다.");
  }
  if ((await git(repositoryPath, ["rev-parse", `${headSha}^`])) !== baseSha) {
    throw new Error("baseline head는 exact target base의 단일 자식이어야 합니다.");
  }
  const patch = await git(repositoryPath, [
    "diff",
    "--binary",
    stableMarker.expectedBaseSha,
    marker.stableMergeSha,
    "--",
    ...files,
  ]);
  const temporary = await mkdtemp(join(tmpdir(), "seed-baseline-verify-"));
  const worktree = join(temporary, "worktree");
  try {
    await git(repositoryPath, ["worktree", "add", "--detach", worktree, baseSha]);
    await git(worktree, ["apply", "--3way", "--index", "-"], `${patch}\n`);
    const expectedTree = await git(worktree, ["write-tree"]);
    const actualTree = await git(repositoryPath, ["rev-parse", `${headSha}^{tree}`]);
    if (expectedTree !== actualTree) {
      throw new Error("baseline head tree가 trusted Stable Version patch replay와 다릅니다.");
    }
  } finally {
    await git(repositoryPath, ["worktree", "remove", "--force", worktree]).catch(() => undefined);
    await rm(temporary, { recursive: true, force: true });
  }
}
