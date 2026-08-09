import { appendFile, readFile, writeFile } from "node:fs/promises";
import { validateChangesets } from "../src/core/changesets";
import {
  isLaneName,
  loadLaneConfig,
  parseLaneConfig,
  parseReleaseControl,
} from "../src/core/config";
import { verifyGeneratedPrProvenance } from "../src/core/generated-pr-provenance";
import { GitHubClient, type GitHubPullRequest } from "../src/core/github";
import { encodeMarker, validateGeneratedPr } from "../src/core/marker";
import { generatedPrTypes, isActivationOperation } from "../src/core/types";
import type { GeneratedPrType, PullRequestIdentity, ReleaseMarker } from "../src/core/types";
import { verifyGeneratedLaneWritePlan } from "../src/lane/lane-write-plan";
import { assertLanePullAllowed } from "../src/lane/pull-policy";
import { activationOperationSpecs, applyActivation } from "../src/setup/activation";
import { verifyBootstrapPull, verifyBootstrapReadiness } from "../src/setup/bootstrap-policy";
import { trustedSyncMarkerForPull } from "../src/sync/sync-policy";
import {
  createGitHubSyncPullDiffFetcher,
  createTrustedSyncValidationClient,
  verifyTrustedGeneratedSync,
} from "../src/sync/trusted-sync-validation";

interface PullRequestEvent {
  repository: { full_name: string };
  pull_request: GitHubPullRequest;
}

function parseArguments(argv: string[]): { command: string; values: Map<string, string> } {
  const [command = "help", ...rest] = argv;
  const values = new Map<string, string>();
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index];
    const value = rest[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error(`인자를 해석할 수 없습니다: ${rest.slice(index).join(" ")}`);
    }
    values.set(key.slice(2), value);
  }
  return { command, values };
}

function required(values: Map<string, string>, key: string): string {
  const value = values.get(key);
  if (!value) throw new Error(`--${key} 인자가 필요합니다.`);
  return value;
}

async function run(command: string[]): Promise<string> {
  const child = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });
  const stdout = await new Response(child.stdout).text();
  const stderr = await new Response(child.stderr).text();
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`${command.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function readEvent(path: string): Promise<PullRequestEvent> {
  return JSON.parse(await readFile(path, "utf8")) as PullRequestEvent;
}

function identityFromPull(pull: GitHubPullRequest): PullRequestIdentity {
  return {
    author: pull.user.login,
    body: pull.body ?? "",
    baseRef: pull.base.ref,
    headRef: pull.head.ref,
    baseRepository: pull.base.repo.full_name,
    headRepository: pull.head.repo?.full_name ?? "",
  };
}

async function changedFiles(
  baseRef: string,
  headSha: string,
  diffFilter?: string,
): Promise<string[]> {
  const filter = diffFilter ? [`--diff-filter=${diffFilter}`] : [];
  const output = await run([
    "git",
    "diff",
    "--name-only",
    ...filter,
    `origin/${baseRef}...${headSha}`,
  ]);
  return output ? output.split("\n") : [];
}

async function writeSummary(lines: string[]): Promise<void> {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) await appendFile(summaryPath, `${lines.join("\n")}\n`);
}

async function writeOutput(values: Record<string, string>): Promise<void> {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  await appendFile(
    outputPath,
    `${Object.entries(values)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")}\n`,
  );
}

async function releaseControlFromDev(): Promise<ReturnType<typeof parseReleaseControl>> {
  const raw = await run(["git", "show", "origin/dev:.github/release/control.json"]);
  return parseReleaseControl(JSON.parse(raw));
}

async function validatePr(values: Map<string, string>): Promise<void> {
  const event = await readEvent(required(values, "event"));
  const eventLane = event.pull_request.base.ref;
  if (!isLaneName(eventLane)) {
    console.log(`::notice::${eventLane}은 릴리즈 레인이 아니므로 검증을 건너뜁니다.`);
    await writeSummary([
      "## 릴리즈 PR 검증",
      "",
      `- \`${eventLane}\`은 릴리즈 레인이 아니므로 검증을 건너뛰었습니다.`,
    ]);
    await writeOutput({ skipped: "true", lane: eventLane });
    return;
  }
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error("PR current head 검증에 GitHub read token이 필요합니다.");
  const client = new GitHubClient(event.repository.full_name, token);
  const pull = await client.request<GitHubPullRequest>(
    `/repos/${event.repository.full_name}/pulls/${event.pull_request.number}`,
  );
  if (
    pull.number !== event.pull_request.number ||
    pull.head.sha !== event.pull_request.head.sha ||
    pull.head.ref !== event.pull_request.head.ref ||
    pull.head.repo?.full_name !== event.pull_request.head.repo?.full_name ||
    pull.base.ref !== event.pull_request.base.ref ||
    pull.base.repo.full_name !== event.repository.full_name
  ) {
    throw new Error("pull_request_target event가 GitHub API의 current PR head/ref와 다릅니다.");
  }
  const lane = pull.base.ref;
  if (!isLaneName(lane)) throw new Error("GitHub API가 알 수 없는 release lane을 반환했습니다.");

  await run([
    "git",
    "fetch",
    "--no-tags",
    "origin",
    "+refs/heads/dev:refs/remotes/origin/dev",
    `+refs/heads/${lane}:refs/remotes/origin/${lane}`,
    `+refs/pull/${pull.number}/head:refs/remotes/pull/${pull.number}/head`,
  ]);
  const fetchedHeadSha = await run(["git", "rev-parse", `refs/remotes/pull/${pull.number}/head`]);
  if (fetchedHeadSha !== pull.head.sha) {
    throw new Error("GitHub API current PR head와 fetched PR ref가 다릅니다.");
  }

  const config = parseLaneConfig(
    JSON.parse(await run(["git", "show", "origin/dev:.github/release/lanes.json"])),
  );
  const generated = validateGeneratedPr(identityFromPull(pull));
  const files = await changedFiles(lane, pull.head.sha);
  if (generated) {
    if (
      pull.base.repo.full_name !== event.repository.full_name ||
      pull.head.repo?.full_name !== event.repository.full_name
    ) {
      throw new Error("generated PR은 현재 repository의 same-repo branch여야 합니다.");
    }
    await verifyGeneratedPrProvenance({
      marker: generated,
      headSha: pull.head.sha,
      changedFiles: files,
    });
    if (generated.type === "version") {
      await verifyGeneratedLaneWritePlan(process.cwd(), generated, pull.base.sha, pull.head.sha);
    }
  }
  if (generated?.type === "sync") {
    const syncMarker = trustedSyncMarkerForPull(pull, event.repository.full_name);
    if (!syncMarker) throw new Error("sync marker의 source/tree 결속 정보가 불완전합니다.");
    await verifyTrustedGeneratedSync({
      repository: event.repository.full_name,
      pull,
      marker: syncMarker,
      config,
      client: createTrustedSyncValidationClient(client),
      fetchPullDiff: createGitHubSyncPullDiffFetcher(token),
    });
  }
  if (generated?.type === "bootstrap") {
    if (lane !== "minor" && lane !== "major") {
      throw new Error("bootstrap PR target은 minor 또는 major여야 합니다.");
    }
    await verifyBootstrapPull({
      marker: generated,
      lane,
      baseSha: pull.base.sha,
      headSha: pull.head.sha,
    });
  }
  const activationOperation =
    generated?.type === "activation" && isActivationOperation(generated.tag) ? generated.tag : null;
  if (
    activationOperation &&
    activationOperationSpecs[activationOperation].requiresBootstrapReadiness
  ) {
    await run([
      "git",
      "fetch",
      "--no-tags",
      "origin",
      "+refs/heads/minor:refs/remotes/origin/minor",
      "+refs/heads/major:refs/remotes/origin/major",
    ]);
    await verifyBootstrapReadiness();
  }
  const control = await releaseControlFromDev();
  const proposedControl = activationOperation
    ? parseReleaseControl(
        JSON.parse(await run(["git", "show", `${pull.head.sha}:.github/release/control.json`])),
      )
    : undefined;
  const proposedConfig = activationOperation
    ? parseLaneConfig(
        JSON.parse(await run(["git", "show", `${pull.head.sha}:.github/release/lanes.json`])),
      )
    : undefined;
  assertLanePullAllowed({
    lane,
    marker: generated,
    files,
    control,
    config,
    proposedControl,
    proposedConfig,
    headSha: pull.head.sha,
  });
  if (generated) {
    await writeSummary([
      "## 릴리즈 PR 검증",
      "",
      `- 유형: \`${generated.type}\``,
      `- 레인: \`${lane}\``,
      "- 자동화 생성 주체와 head/base 관계를 확인했습니다.",
    ]);
    await writeOutput({ generated: "true", type: generated.type, lane });
    return;
  }

  const deletedChangesets = (await changedFiles(lane, pull.head.sha, "D")).filter(
    (file) => file.startsWith(".changeset/") && file.endsWith(".md"),
  );
  if (deletedChangesets.length > 0) {
    throw new Error(`일반 PR은 changeset을 삭제할 수 없습니다: ${deletedChangesets.join(", ")}`);
  }
  const result = await validateChangesets(files, lane, config.lanes[lane].bump, (file) =>
    run(["git", "show", `${pull.head.sha}:${file}`]),
  );
  for (const warning of result.warnings) console.log(`::warning::${warning}`);
  await writeSummary([
    "## 릴리즈 PR 검증",
    "",
    `- 레인: \`${lane}\``,
    `- 요구 bump: \`${config.lanes[lane].bump}\``,
    `- changeset: ${result.entries.length}개`,
    ...result.warnings.map((warning) => `- 경고: ${warning}`),
    ...result.errors.map((error) => `- 오류: ${error}`),
  ]);
  if (result.errors.length > 0) throw new Error(result.errors.join("\n"));
  await writeOutput({ generated: "false", lane });
}

function asGeneratedPrType(value: string): GeneratedPrType {
  if (!generatedPrTypes.includes(value as GeneratedPrType)) {
    throw new Error(`지원하지 않는 PR 유형입니다: ${value}`);
  }
  return value as GeneratedPrType;
}

async function marker(values: Map<string, string>): Promise<void> {
  const lane = required(values, "lane");
  if (!isLaneName(lane)) throw new Error(`지원하지 않는 레인입니다: ${lane}`);
  const type = asGeneratedPrType(required(values, "type"));
  const result: ReleaseMarker = { schemaVersion: 1, type, lane };
  const optionalString = [
    "sourceRepository",
    "targetLane",
    "patchSha256",
    "expectedHeadSha",
    "controlSha",
    "controlTreeSha256",
    "targetBump",
    "tag",
  ] as const;
  for (const key of optionalString) {
    const value = values.get(key);
    if (value) Object.assign(result, { [key]: value });
  }
  const sourcePr = values.get("sourcePr");
  if (sourcePr) result.sourcePr = Number(sourcePr);
  console.log(encodeMarker(result));
}

async function activation(values: Map<string, string>): Promise<void> {
  const operation = required(values, "operation");
  if (!isActivationOperation(operation)) {
    throw new Error(`지원하지 않는 activation 작업입니다: ${operation}`);
  }
  const control = await releaseControlFromDev();
  const config = await loadLaneConfig();
  if (activationOperationSpecs[operation].requiresBootstrapReadiness) {
    await verifyBootstrapReadiness();
  }
  const result = applyActivation(operation, control, config, new Date().toISOString());
  const [path, state] =
    result.changed === "config"
      ? [".github/release/lanes.json", result.config]
      : [".github/release/control.json", result.control];
  await writeFile(path, `${JSON.stringify(state, null, 2)}\n`);
}

async function bootstrapReadiness(): Promise<void> {
  const readiness = await verifyBootstrapReadiness();
  console.log(
    `bootstrap readiness 확인: dev@${readiness.devSha}, minor@${readiness.lanes.minor}, major@${readiness.lanes.major}`,
  );
}

async function main(): Promise<void> {
  const { command, values } = parseArguments(Bun.argv.slice(2));
  if (command === "validate-pr") return validatePr(values);
  if (command === "marker") return marker(values);
  if (command === "activation") return activation(values);
  if (command === "bootstrap-readiness") return bootstrapReadiness();
  throw new Error(`지원하지 않는 명령입니다: ${command}`);
}

await main();
