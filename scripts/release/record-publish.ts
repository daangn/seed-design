import { GitHubClient } from "./github";

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const number = Number(process.env.PUBLISH_PR_NUMBER);
const mergeSha = process.env.PUBLISH_MERGE_SHA;
const status = process.env.PUBLISH_STATUS;
if (!token || !repository || !Number.isInteger(number) || !mergeSha || !status) {
  throw new Error("게시 결과 기록에 필요한 환경이 없습니다.");
}

const client = new GitHubClient(repository, token);
await client.comment(
  number,
  `<!-- seed-release-publish:${mergeSha}:${status} -->\n게시 queue가 이 Version Packages PR을 \`${status}\`로 처리했습니다.\n\nRun: ${process.env.GITHUB_SERVER_URL}/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`,
);
