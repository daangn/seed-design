import { appendFile, readFile } from "node:fs/promises";
import { validateChangesets } from "../core/changesets";
import { isLaneName, loadLaneConfig } from "../core/config";
import { validateGeneratedPr } from "../core/marker";
import type { LaneName, PullRequestIdentity } from "../core/types";
import { releaseStateFiles } from "../lane/pull-policy";

interface LegacyPullRequestEvent {
  repository: { full_name: string };
  pull_request: {
    body: string | null;
    user: { login: string };
    base: { ref: string; repo: { full_name: string } };
    head: { ref: string; repo: { full_name: string } | null };
  };
}

function identityFromEvent(event: LegacyPullRequestEvent): PullRequestIdentity {
  return {
    author: event.pull_request.user.login,
    body: event.pull_request.body ?? "",
    baseRef: event.pull_request.base.ref,
    headRef: event.pull_request.head.ref,
    baseRepository: event.pull_request.base.repo.full_name,
    headRepository: event.pull_request.head.repo?.full_name ?? "",
  };
}

export function assertLegacyMigrationIdentity(event: LegacyPullRequestEvent): LaneName {
  const lane = event.pull_request.base.ref;
  if (!isLaneName(lane) || lane !== "dev") {
    throw new Error("legacy migration validator는 이번 dev 구조 변경 PR만 검증할 수 있습니다.");
  }
  if (
    event.repository.full_name !== event.pull_request.base.repo.full_name ||
    validateGeneratedPr(identityFromEvent(event))
  ) {
    throw new Error("generated PR은 배포된 trusted dev validator로만 검증할 수 있습니다.");
  }
  return lane;
}

export function assertLegacyMigrationFiles(files: string[], deletedFiles: string[]): void {
  const stateChanges = files.filter((file) =>
    releaseStateFiles.includes(file as (typeof releaseStateFiles)[number]),
  );
  if (stateChanges.length > 0) {
    throw new Error(
      `migration PR은 릴리즈 상태 파일을 변경할 수 없습니다: ${stateChanges.join(", ")}`,
    );
  }
  const deletedChangesets = deletedFiles.filter(
    (file) => file.startsWith(".changeset/") && file.endsWith(".md"),
  );
  if (deletedChangesets.length > 0) {
    throw new Error(
      `migration PR은 changeset을 삭제할 수 없습니다: ${deletedChangesets.join(", ")}`,
    );
  }
}

async function git(arguments_: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (exitCode !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function changedFiles(lane: LaneName, diffFilter?: string): Promise<string[]> {
  const output = await git([
    "diff",
    "--name-only",
    ...(diffFilter ? [`--diff-filter=${diffFilter}`] : []),
    `origin/${lane}...HEAD`,
    "--",
  ]);
  return output ? output.split("\n") : [];
}

async function writeLines(path: string | undefined, lines: string[]): Promise<void> {
  if (path) await appendFile(path, `${lines.join("\n")}\n`);
}

export async function runLegacyPrValidation(argv: string[]): Promise<void> {
  const [command, flag, eventPath, ...rest] = argv;
  if (command !== "validate-pr" || flag !== "--event" || !eventPath || rest.length > 0) {
    throw new Error("legacy migration entrypoint는 validate-pr --event <path>만 지원합니다.");
  }
  const event = JSON.parse(await readFile(eventPath, "utf8")) as LegacyPullRequestEvent;
  const lane = assertLegacyMigrationIdentity(event);
  const files = await changedFiles(lane);
  assertLegacyMigrationFiles(files, await changedFiles(lane, "D"));

  const config = await loadLaneConfig();
  const result = await validateChangesets(files, lane, config.lanes[lane].bump);
  await writeLines(process.env.GITHUB_STEP_SUMMARY, [
    "## 임시 릴리즈 구조 migration 검증",
    "",
    "- 기존 dev workflow가 새 release tooling을 검증했습니다.",
    `- changeset: ${result.entries.length}개`,
    ...result.warnings.map((warning) => `- 경고: ${warning}`),
    ...result.errors.map((error) => `- 오류: ${error}`),
  ]);
  if (result.errors.length > 0) throw new Error(result.errors.join("\n"));
  await writeLines(process.env.GITHUB_OUTPUT, ["generated=false", `lane=${lane}`]);
}
