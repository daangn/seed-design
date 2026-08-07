import { appendFile, readFile, writeFile } from "node:fs/promises";
import { authorizePublish } from "./publish";
import { isLaneName, loadLaneConfig, parseReleaseControl } from "./config";
import { validateChangesets } from "./changesets";
import { encodeMarker, parseMarker, validateGeneratedPr } from "./marker";
import { applyTransition, planTransition, readPreState } from "./transition";
import type {
  GeneratedPrType,
  LaneName,
  PullRequestIdentity,
  ReleaseMarker,
  TransitionCommand,
} from "./types";
import { generatedPrTypes } from "./types";

interface PullRequestEvent {
  repository: { full_name: string };
  pull_request: {
    body: string | null;
    merged_by?: { login: string } | null;
    user: { login: string };
    base: { ref: string; repo: { full_name: string } };
    head: { ref: string; sha: string; repo: { full_name: string } | null };
  };
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

function identityFromEvent(event: PullRequestEvent): PullRequestIdentity {
  return {
    author: event.pull_request.user.login,
    body: event.pull_request.body ?? "",
    baseRef: event.pull_request.base.ref,
    headRef: event.pull_request.head.ref,
    baseRepository: event.pull_request.base.repo.full_name,
    headRepository: event.pull_request.head.repo?.full_name ?? "",
  };
}

async function changedFiles(baseRef: string, diffFilter?: string): Promise<string[]> {
  const filter = diffFilter ? [`--diff-filter=${diffFilter}`] : [];
  const output = await run(["git", "diff", "--name-only", ...filter, `origin/${baseRef}...HEAD`]);
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
  const lane = event.pull_request.base.ref;
  if (!isLaneName(lane)) {
    console.log(`::notice::${lane}은 릴리즈 레인이 아니므로 검증을 건너뜁니다.`);
    await writeSummary([
      "## 릴리즈 PR 검증",
      "",
      `- \`${lane}\`은 릴리즈 레인이 아니므로 검증을 건너뛰었습니다.`,
    ]);
    await writeOutput({ skipped: "true", lane });
    return;
  }

  const config = await loadLaneConfig();
  const generated = validateGeneratedPr(identityFromEvent(event));
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

  const control = await releaseControlFromDev();
  if (control.freeze?.frozenLanes.includes(lane as Exclude<LaneName, "dev">)) {
    throw new Error(`${lane} 레인은 stable 승격 재구성이 끝날 때까지 merge가 동결됐습니다.`);
  }

  const files = await changedFiles(lane);
  const protectedChanges = files.filter((file) =>
    [".changeset/config.json", ".changeset/pre.json", ".github/release/control.json"].includes(
      file,
    ),
  );
  if (protectedChanges.length > 0) {
    throw new Error(
      `일반 PR은 레인 상태 파일을 변경할 수 없습니다: ${protectedChanges.join(", ")}`,
    );
  }
  const deletedChangesets = (await changedFiles(lane, "D")).filter(
    (file) => file.startsWith(".changeset/") && file.endsWith(".md"),
  );
  if (deletedChangesets.length > 0) {
    throw new Error(`일반 PR은 changeset을 삭제할 수 없습니다: ${deletedChangesets.join(", ")}`);
  }
  const result = await validateChangesets(files, lane, config.lanes[lane].bump);
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
    "command",
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

async function transition(values: Map<string, string>): Promise<void> {
  const lane = required(values, "lane");
  if (!isLaneName(lane)) throw new Error(`지원하지 않는 레인입니다: ${lane}`);
  const command = required(values, "command") as TransitionCommand;
  if (!["enter", "retag", "exit"].includes(command)) {
    throw new Error(`지원하지 않는 상태 전환입니다: ${command}`);
  }
  const config = await loadLaneConfig();
  const plan = planTransition(
    lane,
    command,
    values.get("tag"),
    await readPreState(),
    config.protectedDistTags,
  );
  await applyTransition(plan);
  await writeOutput({ lane, command, tag: plan.tag ?? "" });
}

async function authorize(values: Map<string, string>): Promise<void> {
  const event = await readEvent(required(values, "event"));
  const baseRef = event.pull_request.base.ref;
  if (!isLaneName(baseRef)) throw new Error(`${baseRef}은 릴리즈 레인이 아닙니다.`);
  const control = await releaseControlFromDev();
  const mode = authorizePublish(
    parseMarker(event.pull_request.body ?? ""),
    event.pull_request.merged_by?.login ?? "",
    baseRef,
    event.pull_request.head.ref,
    control,
  );
  await writeOutput({ mode, lane: baseRef, headSha: event.pull_request.head.sha });
  await writeSummary([
    "## 게시 승인 검증",
    "",
    `- 레인: \`${baseRef}\``,
    `- 실행 모드: \`${mode}\``,
    `- 승인자: \`${event.pull_request.merged_by?.login ?? "없음"}\``,
  ]);
}

async function promotion(values: Map<string, string>): Promise<void> {
  const lane = required(values, "lane");
  if (lane !== "minor" && lane !== "major") throw new Error("승격 레인은 minor 또는 major입니다.");
  const phase = required(values, "phase");
  const control = await releaseControlFromDev();
  if (phase === "start") {
    if (control.freeze)
      throw new Error(`${control.freeze.promotionLane} 승격이 이미 진행 중입니다.`);
    const candidateSha = required(values, "candidate-sha");
    control.freeze = {
      promotionLane: lane,
      candidateSha,
      phase: "frozen",
      frozenLanes: lane === "major" ? ["minor", "major"] : ["minor"],
      startedAt: new Date().toISOString(),
    };
  } else if (phase === "integrating" || phase === "rebuilding") {
    if (!control.freeze || control.freeze.promotionLane !== lane) {
      throw new Error(`${lane} 승격 상태가 없습니다.`);
    }
    control.freeze.phase = phase;
  } else if (phase === "finish") {
    if (!control.freeze || control.freeze.promotionLane !== lane) {
      throw new Error(`${lane} 승격 상태가 없습니다.`);
    }
    control.freeze = null;
  } else {
    throw new Error(`지원하지 않는 승격 단계입니다: ${phase}`);
  }
  await writeFile(".github/release/control.json", `${JSON.stringify(control, null, 2)}\n`);
}

async function activation(values: Map<string, string>): Promise<void> {
  const operation = required(values, "operation");
  const control = await releaseControlFromDev();
  const config = await loadLaneConfig();
  if (operation === "enable-sync") {
    if (config.sync.activation) throw new Error("동기화가 이미 활성화되어 있습니다.");
    config.sync.activation = new Date().toISOString();
    await writeFile(".github/release/lanes.json", `${JSON.stringify(config, null, 2)}\n`);
    return;
  }
  if (operation === "enable-production") {
    if (!config.sync.activation) throw new Error("동기화를 먼저 활성화해야 합니다.");
    if (!control.rootageContractReady) throw new Error("DES-2201 계약이 준비되지 않았습니다.");
    if (control.freeze) throw new Error("승격 중에는 production을 활성화할 수 없습니다.");
    if (control.mode === "production") throw new Error("production이 이미 활성화되어 있습니다.");
    control.mode = "production";
    await writeFile(".github/release/control.json", `${JSON.stringify(control, null, 2)}\n`);
    return;
  }
  throw new Error(`지원하지 않는 activation 작업입니다: ${operation}`);
}

async function main(): Promise<void> {
  const { command, values } = parseArguments(Bun.argv.slice(2));
  if (command === "validate-pr") return validatePr(values);
  if (command === "marker") return marker(values);
  if (command === "transition") return transition(values);
  if (command === "authorize-publish") return authorize(values);
  if (command === "promotion") return promotion(values);
  if (command === "activation") return activation(values);
  throw new Error(`지원하지 않는 명령입니다: ${command}`);
}

await main();
