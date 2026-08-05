import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "./github";
import { parseMarker } from "./marker";

interface IssueComment {
  body: string | null;
}

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error("GitHub workflow 환경이 필요합니다.");
const client = new GitHubClient(repository, token);

const pulls = (
  await Promise.all(
    ["dev", "minor", "major"].map((lane) =>
      client.paginate<GitHubPullRequest>(
        `/repos/${repository}/pulls?state=closed&base=${lane}&sort=updated&direction=asc`,
      ),
    ),
  )
)
  .flat()
  .filter((pull) => {
    const marker = parseMarker(pull.body ?? "");
    return Boolean(pull.merged_at && pull.merge_commit_sha && marker?.type === "version");
  })
  .sort((left, right) => {
    const byDate = (left.merged_at ?? "").localeCompare(right.merged_at ?? "");
    return byDate === 0 ? left.number - right.number : byDate;
  });

let selected: GitHubPullRequest | null = null;
for (const pull of pulls) {
  const comments = await client.paginate<IssueComment>(
    `/repos/${repository}/issues/${pull.number}/comments`,
  );
  const key = pull.merge_commit_sha ?? "";
  const processed = comments.some((comment) =>
    comment.body?.includes(`<!-- seed-release-publish:${key}:`),
  );
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
