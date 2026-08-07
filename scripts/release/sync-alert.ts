import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "./github";
import { loadLaneConfig } from "./config";
import { parseMarker } from "./marker";

interface IssueComment {
  body: string | null;
}

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error("GitHub workflow 환경이 필요합니다.");

const client = new GitHubClient(repository, token);
const config = await loadLaneConfig();
const threshold = Date.now() - config.sync.conflictAlertHours * 60 * 60 * 1000;
const pulls = await client.paginate<GitHubPullRequest>(
  `/repos/${repository}/pulls?state=open&sort=created&direction=asc`,
);
const stale = pulls.filter((pull) => {
  const marker = parseMarker(pull.body ?? "");
  return marker?.type === "sync" && pull.draft && Date.parse(pull.created_at) <= threshold;
});

const alerted: string[] = [];
for (const pull of stale) {
  const comments = await client.paginate<IssueComment>(
    `/repos/${repository}/issues/${pull.number}/comments`,
  );
  if (comments.some((comment) => comment.body?.includes("<!-- seed-release-sync-alert -->"))) {
    continue;
  }
  await client.comment(
    pull.number,
    `<!-- seed-release-sync-alert -->\n동기화 충돌이 ${config.sync.conflictAlertHours}시간 이상 해결되지 않았습니다. @${pull.user.login} @daangn/${config.maintainerTeam}`,
  );
  alerted.push(`https://github.com/${repository}/pull/${pull.number}`);
}

const outputPath = process.env.GITHUB_OUTPUT;
if (outputPath) {
  await appendFile(outputPath, `count=${alerted.length}\nurls=${alerted.join(", ")}\n`);
}
console.log(alerted.length > 0 ? alerted.join("\n") : "새 장기 충돌 알림이 없습니다.");
