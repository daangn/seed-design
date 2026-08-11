import { appendFile, lstat, readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { verifyPublishPullForAuthorization } from "./authorize-publish-pr";
import { parseReleaseControl } from "../core/config";
import { GitHubClient } from "../core/github";
import { authorizePublish } from "./publish";
import {
  assertCompletePullFileList,
  isPublishStatusBoundToRun,
  parseAuthorizedPackageManifestPaths,
  type PublishCommitStatus,
  type PublishWorkflowJob,
  type PublishWorkflowRun,
} from "./publish-state";

const gitShaPattern = /^[0-9a-f]{40}$/;
const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const outputDelimiter = "SEED_RELEASE_CHANGELOG_FILES";

interface ProductionNotificationBinding {
  mode: "dry-run" | "production";
  expectedControlSha: string;
  actualControlSha: string;
  expectedMergeSha: string;
  actualMergeSha: string;
  sourceHeadSha: string;
  expectedPullNumber: number;
  actualPullNumber: number;
}

interface ReleaseNotificationInput {
  token: string;
  repository: string;
  pullNumber: number;
  mergeSha: string;
  controlSha: string;
  controlPath: string;
  sourcePath: string;
  outputPath: string;
  serverUrl: string;
  publishRunId: number;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경변수가 필요합니다.`);
  return value;
}

function parseInput(): ReleaseNotificationInput {
  const repository = requiredEnvironment("GITHUB_REPOSITORY");
  const pullNumberValue = requiredEnvironment("RELEASE_NOTIFICATION_PR_NUMBER");
  const mergeSha = requiredEnvironment("RELEASE_NOTIFICATION_MERGE_SHA");
  const controlSha = requiredEnvironment("RELEASE_NOTIFICATION_CONTROL_SHA");
  const serverUrl = process.env.GITHUB_SERVER_URL ?? "https://github.com";
  const publishRunIdValue = requiredEnvironment("RELEASE_NOTIFICATION_PUBLISH_RUN_ID");
  const pullNumber = Number(pullNumberValue);
  const publishRunId = Number(publishRunIdValue);

  if (!repositoryPattern.test(repository) || repository.includes("..")) {
    throw new Error("GITHUB_REPOSITORY 형식이 올바르지 않습니다.");
  }
  if (!/^[1-9]\d*$/.test(pullNumberValue) || !Number.isSafeInteger(pullNumber)) {
    throw new Error("알림 PR 번호가 올바르지 않습니다.");
  }
  if (!/^[1-9]\d*$/.test(publishRunIdValue) || !Number.isSafeInteger(publishRunId)) {
    throw new Error("알림 publish run ID가 올바르지 않습니다.");
  }
  if (!gitShaPattern.test(mergeSha) || !gitShaPattern.test(controlSha)) {
    throw new Error("알림 merge/control SHA가 올바르지 않습니다.");
  }

  const parsedServerUrl = new URL(serverUrl);
  if (
    parsedServerUrl.protocol !== "https:" ||
    parsedServerUrl.username ||
    parsedServerUrl.password ||
    parsedServerUrl.search ||
    parsedServerUrl.hash
  ) {
    throw new Error("GITHUB_SERVER_URL이 안전한 HTTPS origin이 아닙니다.");
  }

  return {
    token: requiredEnvironment("GH_TOKEN"),
    repository,
    pullNumber,
    mergeSha,
    controlSha,
    controlPath: resolve(requiredEnvironment("RELEASE_NOTIFICATION_CONTROL_PATH")),
    sourcePath: resolve(requiredEnvironment("RELEASE_NOTIFICATION_SOURCE_PATH")),
    outputPath: requiredEnvironment("GITHUB_OUTPUT"),
    serverUrl: parsedServerUrl.origin,
    publishRunId,
  };
}

async function gitHead(repositoryPath: string): Promise<string> {
  const child = Bun.spawn(["git", "rev-parse", "HEAD"], {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  const sha = stdout.trim();
  if (code !== 0 || !gitShaPattern.test(sha)) {
    throw new Error(`checkout HEAD를 확인하지 못했습니다: ${stderr.trim()}`);
  }
  return sha;
}

export function assertProductionNotificationBinding(binding: ProductionNotificationBinding): void {
  if (binding.mode !== "production") {
    throw new Error("dry-run publish에는 성공 알림을 보낼 수 없습니다.");
  }
  if (
    binding.expectedControlSha !== binding.actualControlSha ||
    binding.expectedMergeSha !== binding.actualMergeSha ||
    binding.expectedMergeSha !== binding.sourceHeadSha ||
    binding.expectedPullNumber !== binding.actualPullNumber
  ) {
    throw new Error("알림 입력이 exact authorized PR/merge/control과 다릅니다.");
  }
}

function changelogPathForManifest(packageManifestPath: string): string {
  const directory = dirname(packageManifestPath);
  return directory === "." ? "CHANGELOG.md" : `${directory}/CHANGELOG.md`;
}

export function selectReleaseChangelogPaths(
  packageManifestPaths: string[],
  pullFiles: Array<{ filename: string }>,
): string[] {
  const changedFiles = new Set(pullFiles.map((file) => file.filename));
  const changelogs = [
    ...new Set(
      packageManifestPaths.map(changelogPathForManifest).filter((path) => changedFiles.has(path)),
    ),
  ].sort();
  if (changelogs.length === 0) {
    throw new Error("승인된 package 변경과 결속된 CHANGELOG.md가 없습니다.");
  }
  return changelogs;
}

async function assertRegularRepositoryFile(repositoryPath: string, path: string): Promise<void> {
  const root = resolve(repositoryPath);
  const absolutePath = resolve(root, path);
  const fromRoot = relative(root, absolutePath);
  if (!fromRoot || fromRoot === ".." || fromRoot.startsWith("../") || isAbsolute(fromRoot)) {
    throw new Error(`${path}은 source checkout 내부의 안전한 파일 경로가 아닙니다.`);
  }
  const file = await lstat(absolutePath);
  if (!file.isFile() || file.isSymbolicLink()) {
    throw new Error(`${path}은 regular source file이 아닙니다.`);
  }
}

export function isExactCompletedProductionPublishReceipt(
  status: PublishCommitStatus,
  run: PublishWorkflowRun,
  jobs: PublishWorkflowJob[],
  repository: string,
  mergeSha: string,
  publishRunId: number,
): boolean {
  return (
    run.id === publishRunId &&
    status.description === `seed-release-publish:${mergeSha}:production` &&
    isPublishStatusBoundToRun(status, run, jobs, repository, mergeSha)
  );
}

async function waitForCompletedProductionPublishReceipt(
  client: GitHubClient,
  repository: string,
  mergeSha: string,
  publishRunId: number,
): Promise<void> {
  const attempts = 30;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const [statuses, run, jobs] = await Promise.all([
      client.paginate<PublishCommitStatus>(`/repos/${repository}/commits/${mergeSha}/statuses`),
      client.request<PublishWorkflowRun>(`/repos/${repository}/actions/runs/${publishRunId}`),
      client.paginate<PublishWorkflowJob>(
        `/repos/${repository}/actions/runs/${publishRunId}/jobs?filter=all`,
      ),
    ]);
    if (
      statuses.some((status) =>
        isExactCompletedProductionPublishReceipt(
          status,
          run,
          jobs,
          repository,
          mergeSha,
          publishRunId,
        ),
      )
    ) {
      return;
    }
    if (run.status === "completed") {
      throw new Error(
        "Release publish run이 production durable record와 결속되지 않고 종료됐습니다.",
      );
    }
    if (attempt < attempts - 1) await Bun.sleep(4_000);
  }
  throw new Error("Release publish run의 완료를 제한 시간 안에 확인하지 못했습니다.");
}

async function main(): Promise<void> {
  const input = parseInput();
  const client = new GitHubClient(input.repository, input.token);
  const verified = await verifyPublishPullForAuthorization({
    repository: input.repository,
    number: input.pullNumber,
    client,
  });
  const control = parseReleaseControl(
    JSON.parse(await readFile(join(input.controlPath, ".github/release/control.json"), "utf8")),
  );
  const mode = authorizePublish(
    verified.marker,
    verified.pull.merged_by?.login ?? "",
    verified.lane,
    verified.pull.head.ref,
    control,
  );
  const [actualControlSha, sourceHeadSha] = await Promise.all([
    gitHead(input.controlPath),
    gitHead(input.sourcePath),
  ]);
  assertProductionNotificationBinding({
    mode,
    expectedControlSha: input.controlSha,
    actualControlSha,
    expectedMergeSha: input.mergeSha,
    actualMergeSha: verified.pull.merge_commit_sha ?? "",
    sourceHeadSha,
    expectedPullNumber: input.pullNumber,
    actualPullNumber: verified.pull.number,
  });
  await waitForCompletedProductionPublishReceipt(
    client,
    input.repository,
    input.mergeSha,
    input.publishRunId,
  );

  const pullFiles = await client.paginate<{ filename: string }>(
    `/repos/${input.repository}/pulls/${input.pullNumber}/files`,
  );
  assertCompletePullFileList(verified.pull.changed_files, pullFiles.length);
  const packageManifestPaths = parseAuthorizedPackageManifestPaths(
    JSON.stringify(verified.packagePaths),
  );
  const changelogPaths = selectReleaseChangelogPaths(packageManifestPaths, pullFiles);
  await Promise.all([
    ...packageManifestPaths.map((path) => assertRegularRepositoryFile(input.sourcePath, path)),
    ...changelogPaths.map((path) => assertRegularRepositoryFile(input.sourcePath, path)),
  ]);

  const pullUrl = `${input.serverUrl}/${input.repository}/pull/${input.pullNumber}`;
  await appendFile(
    input.outputPath,
    `files<<${outputDelimiter}\n${changelogPaths.join("\n")}\n${outputDelimiter}\nprUrl=${pullUrl}\n`,
  );
  console.log(
    `production publish ${input.mergeSha}의 changelog ${changelogPaths.length}개를 알림 data로 승인했습니다.`,
  );
}

if (import.meta.main) await main();
