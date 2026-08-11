import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { isStablePromotionMarker, validateGeneratedPr } from "../core/marker";
import type { PullRequestIdentity } from "../core/types";
import { verifyStablePromotionPreflight } from "../validation/stable-promotion";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function identity(pull: GitHubPullRequest): PullRequestIdentity {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

async function git(cwd: string, args: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...args], {
    cwd,
    env: {
      ...process.env,
      GH_TOKEN: undefined,
      GITHUB_TOKEN: undefined,
      NODE_AUTH_TOKEN: undefined,
      NPM_TOKEN: undefined,
    },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`Stable prewrite git ${args[0]} 실패: ${stderr.trim()}`);
  return stdout.trim();
}

async function main(): Promise<void> {
  if (required("PUBLISH_STABLE_PROMOTION") !== "true") return;
  const repository = required("GITHUB_REPOSITORY");
  const token = required("GH_TOKEN");
  const stablePr = Number(required("PUBLISH_PR_NUMBER"));
  const mergeSha = required("PUBLISH_MERGE_SHA");
  const repositoryPath = required("PUBLISH_REPOSITORY_PATH");
  const client = new GitHubClient(repository, token);
  const pull = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${stablePr}`);
  const marker = validateGeneratedPr(identity(pull));
  if (
    !marker ||
    !isStablePromotionMarker(marker) ||
    pull.merge_commit_sha !== mergeSha ||
    !pull.merged_at ||
    !pull.merged_by?.login ||
    pull.merged_by.login.endsWith("[bot]")
  ) {
    throw new Error("npm write 직전 Stable promotion identity가 다릅니다.");
  }
  await verifyStablePromotionPreflight({
    repositoryPath,
    repository,
    marker,
    versionPull: pull,
    client,
  });
  const source = await client.request<{ commit: { sha: string } }>(
    `/repos/${repository}/branches/${marker.lane}`,
  );
  if (source.commit.sha !== mergeSha) {
    throw new Error("npm write 직전 source lane head가 exact Stable merge에서 이동했습니다.");
  }
  const [mergeLine, mergeTree, versionTree] = await Promise.all([
    git(repositoryPath, ["rev-list", "--parents", "-n", "1", mergeSha]),
    git(repositoryPath, ["rev-parse", `${mergeSha}^{tree}`]),
    git(repositoryPath, ["rev-parse", `${marker.expectedHeadSha}^{tree}`]),
  ]);
  const [, ...mergeParents] = mergeLine.split(/\s+/);
  if (
    mergeParents.length !== 1 ||
    mergeParents[0] !== marker.expectedBaseSha ||
    mergeTree !== versionTree
  ) {
    throw new Error(
      "npm write 직전 Stable squash merge의 base/tree가 승인된 Version head와 다릅니다.",
    );
  }
}

if (import.meta.main) await main();
