import { appendFile } from "node:fs/promises";
import { GitHubClient, type GitHubPullRequest } from "./github";
import { parseMarker } from "./marker";
import { authorizePublish } from "./publish";
import { isLaneName, parseReleaseControl } from "./config";

const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const number = Number(Bun.argv[2]);
if (!token || !repository || !Number.isInteger(number)) {
  throw new Error("GitHub workflow 환경과 PR 번호가 필요합니다.");
}

const client = new GitHubClient(repository, token);
const pull = await client.request<GitHubPullRequest>(`/repos/${repository}/pulls/${number}`);
if (!pull.merged_at || !pull.merge_commit_sha || !pull.merged_by) {
  throw new Error(`PR #${number}은 merge된 PR이 아닙니다.`);
}
if (!isLaneName(pull.base.ref)) throw new Error(`${pull.base.ref}은 릴리즈 레인이 아닙니다.`);

const gitShow = Bun.spawn(["git", "show", "origin/dev:.github/release/control.json"], {
  stdout: "pipe",
  stderr: "inherit",
});
const controlText = await new Response(gitShow.stdout).text();
if ((await gitShow.exited) !== 0) throw new Error("dev release control을 읽지 못했습니다.");
const control = parseReleaseControl(JSON.parse(controlText));
const mode = authorizePublish(
  parseMarker(pull.body ?? ""),
  pull.merged_by.login,
  pull.base.ref,
  pull.head.ref,
  control,
);

const outputPath = process.env.GITHUB_OUTPUT;
if (outputPath) {
  await appendFile(
    outputPath,
    `${[
      `mode=${mode}`,
      `lane=${pull.base.ref}`,
      `mergeSha=${pull.merge_commit_sha}`,
      `baseSha=${pull.base.sha}`,
      `number=${pull.number}`,
    ].join("\n")}\n`,
  );
}
