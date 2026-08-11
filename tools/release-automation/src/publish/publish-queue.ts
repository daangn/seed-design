import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { hasBoundPublishReceipt, trustedPublishVersionMarker } from "./publish-state";

export function trustedPublishQueuePulls(
  pulls: GitHubPullRequest[],
  repository: string,
): GitHubPullRequest[] {
  return pulls
    .flatMap((pull) => {
      if (!pull.merged_at || !pull.merge_commit_sha) return [];
      if (pull.base.repo.full_name !== repository) return [];
      const marker = trustedPublishVersionMarker(
        {
          author: pull.user.login,
          body: pull.body ?? "",
          baseRef: pull.base.ref,
          headRef: pull.head.ref,
          baseRepository: pull.base.repo.full_name,
          headRepository: pull.head.repo?.full_name ?? "",
        },
        pull.head.sha,
        pull.number,
        pull.merge_commit_sha,
      );
      return marker ? [pull] : [];
    })
    .sort((left, right) => {
      const byDate = (left.merged_at ?? "").localeCompare(right.merged_at ?? "");
      return byDate === 0 ? left.number - right.number : byDate;
    });
}

async function main(): Promise<void> {
  const token = process.env.GH_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository) throw new Error("GitHub workflow 환경이 필요합니다.");
  const client = new GitHubClient(repository, token);
  const pulls = trustedPublishQueuePulls(
    (
      await Promise.all(
        ["dev", "minor", "major"].map((lane) =>
          client.paginate<GitHubPullRequest>(
            `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=asc`,
          ),
        ),
      )
    ).flat(),
    repository,
  );

  let selected: GitHubPullRequest | null = null;
  for (const pull of pulls) {
    const key = pull.merge_commit_sha ?? "";
    const processed = await hasBoundPublishReceipt(client, repository, key);
    if (!processed) {
      selected = pull;
      break;
    }
  }

  const outputPath = process.env.GITHUB_OUTPUT;
  if (outputPath) {
    await appendFile(
      outputPath,
      selected ? `found=true\nnumber=${selected.number}\n` : "found=false\nnumber=\n",
    );
  }
  console.log(
    selected ? `게시 queue에서 PR #${selected.number}을 선택했습니다.` : "게시 queue가 비었습니다.",
  );
}

if (import.meta.main) await main();
