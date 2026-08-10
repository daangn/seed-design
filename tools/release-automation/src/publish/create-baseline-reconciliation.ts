import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import {
  encodeMarker,
  isBaselineMarker,
  isStablePromotionMarker,
  parseMarker,
} from "../core/marker";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { hasPublishReceiptReadyForBaseline, trustedVersionMarker } from "./publish-state";
import type { PublishPackage } from "./publish-state";
import type { LaneName } from "../core/types";

const shaPattern = /^[0-9a-f]{40}$/;
const allowedGenerated = new Set([
  "bun.lock",
  "packages/rootage/__generated__/index.json",
  "packages/rootage/__generated__/index.d.ts",
]);

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경변수가 필요합니다.`);
  return value;
}

function isAllowed(path: string): boolean {
  return (
    allowedGenerated.has(path) ||
    path === "package.json" ||
    path.endsWith("/package.json") ||
    path.endsWith("/CHANGELOG.md")
  );
}

async function git(cwd: string, args: string[], env: Record<string, string> = {}): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${args[0]} 실패: ${stderr.trim()}`);
  return stdout.trim();
}

function parsePackages(value: string): PublishPackage[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0)
    throw new Error("게시 package 목록이 비었습니다.");
  return parsed.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("게시 package 항목이 객체가 아닙니다.");
    }
    const { name, version } = item as Record<string, unknown>;
    if (typeof name !== "string" || typeof version !== "string" || version.includes("-")) {
      throw new Error("baseline 정렬은 stable package만 허용합니다.");
    }
    return { name, version };
  });
}

export function versionsDigest(packages: PublishPackage[]): string {
  const canonical = JSON.stringify(
    packages
      .map(({ name, version }) => ({ name, version }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
  return createHash("sha256").update(canonical).digest("hex");
}

async function assertRegistryLatest(packages: PublishPackage[]): Promise<void> {
  await Promise.all(
    packages.map(async ({ name, version }) => {
      const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
        headers: { accept: "application/json", "cache-control": "no-cache" },
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error(`${name} npm registry 조회에 실패했습니다: ${response.status}`);
      const document = (await response.json()) as { "dist-tags"?: Record<string, unknown> };
      if (document["dist-tags"]?.latest !== version) {
        throw new Error(`${name} npm latest가 게시 결과 ${version}과 다릅니다.`);
      }
    }),
  );
}

async function versionsDigestAt(
  repositoryPath: string,
  ref: string,
  files: string[],
): Promise<string> {
  const packages: PublishPackage[] = [];
  for (const path of files.filter(
    (file) => file === "package.json" || file.endsWith("/package.json"),
  )) {
    const value = JSON.parse(await git(repositoryPath, ["show", `${ref}:${path}`])) as Record<
      string,
      unknown
    >;
    if (value.private === true) continue;
    if (typeof value.name !== "string" || typeof value.version !== "string") {
      throw new Error(`${path}의 published package identity가 올바르지 않습니다.`);
    }
    packages.push({ name: value.name, version: value.version });
  }
  return versionsDigest(packages);
}

function siblingLane(lane: "minor" | "major"): "minor" | "major" {
  return lane === "minor" ? "major" : "minor";
}

async function main(): Promise<void> {
  const token = required("GH_TOKEN");
  const repository = required("GITHUB_REPOSITORY");
  const stablePr = Number(required("BASELINE_STABLE_PR"));
  const stableMergeSha = required("BASELINE_STABLE_MERGE_SHA");
  const publishRunId = Number(required("BASELINE_PUBLISH_RUN_ID"));
  const controlSha = required("BASELINE_CONTROL_SHA");
  const sourcePath = required("BASELINE_SOURCE_PATH");
  const packages = parsePackages(required("BASELINE_PACKAGES"));
  if (
    !Number.isSafeInteger(stablePr) ||
    stablePr <= 0 ||
    !Number.isSafeInteger(publishRunId) ||
    publishRunId <= 0 ||
    !shaPattern.test(stableMergeSha) ||
    !shaPattern.test(controlSha)
  ) {
    throw new Error("baseline provenance 입력이 올바르지 않습니다.");
  }
  const [checkedOutControlSha, checkedOutSourceSha] = await Promise.all([
    git(process.cwd(), ["rev-parse", "HEAD"]),
    git(sourcePath, ["rev-parse", "HEAD"]),
  ]);
  if (checkedOutControlSha !== controlSha || checkedOutSourceSha !== stableMergeSha) {
    throw new Error("baseline checkout이 exact publish control/merge 입력과 다릅니다.");
  }
  const client = new GitHubClient(repository, token);
  const stablePull = await client.request<GitHubPullRequest>(
    `/repos/${repository}/pulls/${stablePr}`,
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
    stablePull.merge_commit_sha !== stableMergeSha ||
    stablePull.merged_by?.login?.endsWith("[bot]") !== false
  ) {
    throw new Error("exact human-merged Stable Version PR provenance가 아닙니다.");
  }
  if (
    !(await hasPublishReceiptReadyForBaseline(
      client,
      repository,
      stableMergeSha,
      publishRunId,
      stableMarker.lane,
      stablePull.head.sha,
    ))
  ) {
    throw new Error(
      "baseline 생성 입력이 exact production publish receipt/run/record job과 다릅니다.",
    );
  }
  await assertRegistryLatest(packages);

  const changed = (
    await git(sourcePath, [
      "diff",
      "--name-only",
      stableMarker.expectedBaseSha,
      stableMergeSha,
      "--",
    ])
  )
    .split("\n")
    .filter(Boolean);
  const files = changed.filter(isAllowed).sort();
  if (files.length === 0 || !files.some((path) => path.endsWith("package.json"))) {
    throw new Error("baseline에 반영할 허용된 Version 산출물이 없습니다.");
  }
  const patch = await git(sourcePath, [
    "diff",
    "--binary",
    stableMarker.expectedBaseSha,
    stableMergeSha,
    "--",
    ...files,
  ]);
  if (!patch) throw new Error("baseline patch가 비었습니다.");
  const digest = await versionsDigestAt(sourcePath, stableMergeSha, files);
  if (digest !== versionsDigest(packages)) {
    throw new Error("published package versions digest가 Stable Version 산출물과 다릅니다.");
  }
  const sibling = siblingLane(stableMarker.lane);
  const targets: LaneName[] = ["dev", sibling];
  await git(process.cwd(), [
    "fetch",
    "--no-tags",
    "origin",
    ...targets.map((target) => `+refs/heads/${target}:refs/remotes/origin/${target}`),
  ]);
  if (
    await git(process.cwd(), ["show", `refs/remotes/origin/${sibling}:.changeset/pre.json`]).catch(
      () => null,
    )
  ) {
    throw new Error(`sibling ${sibling} lane이 dormant가 아니므로 baseline을 만들 수 없습니다.`);
  }

  for (const target of targets) {
    const targetBase = await git(process.cwd(), ["rev-parse", `refs/remotes/origin/${target}`]);
    const temporary = await mkdtemp(join(tmpdir(), `seed-baseline-${target}-`));
    const worktree = join(temporary, "worktree");
    try {
      await git(process.cwd(), ["worktree", "add", "--detach", worktree, targetBase]);
      const apply = Bun.spawn(["git", "apply", "--3way", "--index", "-"], {
        cwd: worktree,
        stdin: new Blob([`${patch}\n`]),
        stdout: "pipe",
        stderr: "pipe",
      });
      const applyError = await new Response(apply.stderr).text();
      if ((await apply.exited) !== 0) {
        throw new Error(
          `Stable Version 산출물을 current ${target}에 안전하게 적용하지 못했습니다: ${applyError.trim()}`,
        );
      }
      const stagedFiles = (await git(worktree, ["diff", "--cached", "--name-only", "--"]))
        .split("\n")
        .filter(Boolean)
        .sort();
      if (JSON.stringify(stagedFiles) !== JSON.stringify(files)) {
        throw new Error(`${target} baseline staged file 집합이 trusted 산출물과 다릅니다.`);
      }
      await git(worktree, ["commit", "-m", `chore(release): reconcile ${target} stable baseline`], {
        GIT_AUTHOR_NAME: "github-actions[bot]",
        GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
        GIT_COMMITTER_NAME: "github-actions[bot]",
        GIT_COMMITTER_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
      });
      const headSha = await git(worktree, ["rev-parse", "HEAD"]);
      const branch = `release-baseline/${target}/${stableMergeSha.slice(0, 12)}-${publishRunId}`;
      const authorization = Buffer.from(`x-access-token:${token}`).toString("base64");
      const authEnv = {
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
        GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${authorization}`,
      };
      const remoteLine = await git(
        worktree,
        ["ls-remote", "--heads", "origin", `refs/heads/${branch}`],
        authEnv,
      );
      const remoteSha = remoteLine.split(/\s+/)[0] ?? "";
      if (remoteSha && !shaPattern.test(remoteSha))
        throw new Error("reserved baseline branch SHA가 올바르지 않습니다.");
      const pulls = await client.paginate<GitHubPullRequest>(
        `/repos/${repository}/pulls?state=open&base=${target}&head=${encodeURIComponent(repository.split("/")[0] ?? "")}%3A${encodeURIComponent(branch)}`,
      );
      if (pulls.length > 1) throw new Error(`${target} reserved baseline PR이 여러 개입니다.`);
      if (remoteSha) {
        const existing = pulls[0];
        const existingMarker = existing ? parseMarker(existing.body ?? "") : null;
        if (
          !existing ||
          existing.user.login !== "github-actions[bot]" ||
          existing.head.repo?.full_name !== repository ||
          existing.head.sha !== remoteSha ||
          !existingMarker ||
          !isBaselineMarker(existingMarker) ||
          existingMarker.lane !== target ||
          existingMarker.stablePr !== stablePr ||
          existingMarker.stableMergeSha !== stableMergeSha ||
          existingMarker.publishRunId !== publishRunId
        ) {
          throw new Error(`기존 ${target} baseline branch/PR identity가 다릅니다.`);
        }
      }
      const lease = remoteSha
        ? `--force-with-lease=refs/heads/${branch}:${remoteSha}`
        : `--force-with-lease=refs/heads/${branch}:`;
      await git(worktree, ["push", lease, "origin", `${headSha}:refs/heads/${branch}`], authEnv);
      const marker = {
        schemaVersion: 1 as const,
        type: "baseline" as const,
        lane: target,
        stablePr,
        stableMergeSha,
        publishRunId,
        expectedBaseSha: targetBase,
        expectedHeadSha: headSha,
        controlSha,
        versionsSha256: digest,
      };
      const title = `chore(release): reconcile ${target} stable baseline`;
      const body = [
        encodeMarker(marker),
        "",
        `## ${target} stable baseline reconciliation`,
        "",
        `Stable PR \`#${stablePr}\`, merge \`${stableMergeSha}\`, publish run \`${publishRunId}\`의 검토된 산출물을 ${target}에 반영합니다.`,
        "",
        "lane 전체를 역병합하지 않으며 동일한 Stable Version 산출물 patch만 반영합니다.",
      ].join("\n");
      const [remoteBranch, currentTarget] = await Promise.all([
        client.request<{ commit: { sha: string } }>(
          `/repos/${repository}/branches/${encodeURIComponent(branch)}`,
        ),
        client.request<{ commit: { sha: string } }>(`/repos/${repository}/branches/${target}`),
      ]);
      if (remoteBranch.commit.sha !== headSha || currentTarget.commit.sha !== targetBase) {
        throw new Error(`${target} baseline PR 생성 직전 remote head/base가 다릅니다.`);
      }
      const pull = pulls[0]
        ? await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${pulls[0].number}`, {
            method: "PATCH",
            body: JSON.stringify({ title, body }),
          })
        : await client.request<GitHubPullRequest>(`/repos/${repository}/pulls`, {
            method: "POST",
            body: JSON.stringify({ title, body, head: branch, base: target }),
          });
      await client.request(
        `/repos/${repository}/actions/workflows/release-pr-validation.yml/dispatches`,
        {
          method: "POST",
          body: JSON.stringify({
            ref: "dev",
            inputs: { head_ref: branch, head_sha: headSha },
          }),
        },
      );
      console.log(`${target} baseline reconciliation PR #${pull.number}을 준비했습니다.`);
    } finally {
      await git(process.cwd(), ["worktree", "remove", "--force", worktree]).catch(() => undefined);
      await rm(temporary, { recursive: true, force: true });
    }
  }
}

if (import.meta.main) await main();
