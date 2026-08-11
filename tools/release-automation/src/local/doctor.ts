import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { parseLaneConfig, parseReleaseControl } from "../core/config";
import type { LaneConfig, LaneName, ReleaseControl } from "../core/types";
import { laneNames } from "../core/types";

export type DoctorCheckStatus = "pass" | "warning" | "error";

type DoctorDetail = string | number | boolean | string[];

export interface DoctorCheck {
  id: string;
  label: string;
  status: DoctorCheckStatus;
  message: string;
  details?: Record<string, DoctorDetail>;
  remediation?: string;
}

export interface DoctorReport {
  schemaVersion: 1;
  generatedAt: string;
  repositoryRoot: string;
  conclusion: "ready" | "warning" | "error";
  ok: boolean;
  summary: Record<DoctorCheckStatus, number>;
  checks: DoctorCheck[];
}

export interface DoctorOptions {
  root?: string;
  bunVersion?: string;
  now?: Date;
}

interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

interface RepositoryDiscovery {
  root: string;
  check: DoctorCheck;
  isRepository: boolean;
}

const laneSet = new Set<string>(laneNames);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function pathKind(path: string): Promise<"file" | "directory" | null> {
  try {
    const value = await stat(path);
    if (value.isFile()) return "file";
    if (value.isDirectory()) return "directory";
    return null;
  } catch {
    return null;
  }
}

async function runGit(root: string, args: string[]): Promise<CommandResult> {
  try {
    const child = Bun.spawn(["git", ...args], {
      cwd: root,
      env: {
        ...process.env,
        GIT_OPTIONAL_LOCKS: "0",
        GIT_TERMINAL_PROMPT: "0",
      },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    return { exitCode, stdout: stdout.trimEnd(), stderr: stderr.trim() };
  } catch (error) {
    return { exitCode: 1, stdout: "", stderr: errorMessage(error) };
  }
}

async function discoverRepository(start: string): Promise<RepositoryDiscovery> {
  const result = await runGit(start, ["rev-parse", "--show-toplevel"]);
  if (result.exitCode !== 0 || !result.stdout) {
    return {
      root: start,
      isRepository: false,
      check: {
        id: "git.repository",
        label: "Git 저장소",
        status: "error",
        message: "Git 저장소를 찾지 못했습니다.",
        details: { start, error: result.stderr || "git rev-parse 실패" },
        remediation: "seed-design 저장소 안에서 다시 실행하세요.",
      },
    };
  }

  const root = resolve(result.stdout);
  return {
    root,
    isRepository: true,
    check: {
      id: "git.repository",
      label: "Git 저장소",
      status: "pass",
      message: "저장소 루트를 확인했습니다.",
      details: { root },
    },
  };
}

async function readReleaseConfiguration(root: string): Promise<{
  config?: LaneConfig;
  control?: ReleaseControl;
  checks: DoctorCheck[];
}> {
  const checks: DoctorCheck[] = [];
  let config: LaneConfig | undefined;
  let control: ReleaseControl | undefined;

  try {
    const path = resolve(root, ".github/release/lanes.json");
    const value: unknown = JSON.parse(await readFile(path, "utf8"));
    config = parseLaneConfig(value);
    checks.push({
      id: "release.lanes",
      label: "릴리즈 레인 설정",
      status: "pass",
      message: "dev/minor/major 고정 정책과 동기화 설정이 유효합니다.",
      details: {
        repository: config.repository,
        activation: config.sync.activation ?? "inactive",
        lanes: laneNames.map(
          (lane) =>
            `${lane}:${config?.lanes[lane].bump}${config?.lanes[lane].prerelease ? "-prerelease" : "-stable"}`,
        ),
      },
    });
  } catch (error) {
    checks.push({
      id: "release.lanes",
      label: "릴리즈 레인 설정",
      status: "error",
      message: `lanes.json을 읽거나 검증할 수 없습니다: ${errorMessage(error)}`,
      remediation: ".github/release/lanes.json을 로컬 스키마와 고정 레인 정책에 맞추세요.",
    });
  }

  try {
    const path = resolve(root, ".github/release/control.json");
    const value: unknown = JSON.parse(await readFile(path, "utf8"));
    control = parseReleaseControl(value);
    checks.push({
      id: "release.control",
      label: "릴리즈 제어 설정",
      status: "pass",
      message: `릴리즈 모드는 ${control.mode}이며 Rootage 계약 상태가 유효합니다.`,
      details: {
        mode: control.mode,
        rootageContractReady: control.rootageContractReady,
      },
    });
  } catch (error) {
    checks.push({
      id: "release.control",
      label: "릴리즈 제어 설정",
      status: "error",
      message: `control.json을 읽거나 검증할 수 없습니다: ${errorMessage(error)}`,
      remediation: ".github/release/control.json을 로컬 스키마와 운영 안전 조건에 맞추세요.",
    });
  }

  if (config && control) {
    if (control.mode === "production" && config.sync.activation === null) {
      checks.push({
        id: "release.activation",
        label: "릴리즈 활성화 조건",
        status: "error",
        message: "production 모드이지만 레인 동기화가 활성화되지 않았습니다.",
        remediation: "승인된 activation 절차로 동기화를 활성화하거나 dry-run 모드로 되돌리세요.",
      });
    } else if (config.sync.activation === null) {
      checks.push({
        id: "release.activation",
        label: "릴리즈 활성화 조건",
        status: "warning",
        message: "레인 동기화가 아직 활성화되지 않았습니다.",
        remediation: "bootstrap 검증을 마친 뒤 승인된 activation 절차를 사용하세요.",
      });
    } else {
      checks.push({
        id: "release.activation",
        label: "릴리즈 활성화 조건",
        status: "pass",
        message: "레인 동기화 활성화 시각이 설정되어 있습니다.",
        details: { activation: config.sync.activation },
      });
    }
  }

  return { config, control, checks };
}

function expectedBunVersion(setupAction: string): string | null {
  const match = setupAction.match(/^\s*bun-version:\s*["']?([^\s"'#]+)["']?\s*(?:#.*)?$/m);
  return match?.[1] ?? null;
}

async function inspectToolchain(root: string, currentBunVersion: string): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = [];
  const setupPath = resolve(root, ".github/actions/setup/action.yml");
  let expectedVersion: string | null = null;

  try {
    expectedVersion = expectedBunVersion(await readFile(setupPath, "utf8"));
  } catch {
    // The dedicated check below explains a missing or unreadable setup action.
  }

  if (!expectedVersion) {
    checks.push({
      id: "toolchain.bun",
      label: "Bun 버전",
      status: "warning",
      message: "CI setup action에서 기준 Bun 버전을 찾지 못했습니다.",
      details: { current: currentBunVersion },
      remediation: ".github/actions/setup/action.yml의 bun-version과 로컬 Bun 버전을 확인하세요.",
    });
  } else if (currentBunVersion !== expectedVersion) {
    checks.push({
      id: "toolchain.bun",
      label: "Bun 버전",
      status: "warning",
      message: `로컬 Bun 버전(${currentBunVersion})이 CI 기준(${expectedVersion})과 다릅니다.`,
      details: { current: currentBunVersion, expected: expectedVersion },
      remediation: `CI와 같은 Bun ${expectedVersion}을 사용하세요.`,
    });
  } else {
    checks.push({
      id: "toolchain.bun",
      label: "Bun 버전",
      status: "pass",
      message: `로컬과 CI가 Bun ${expectedVersion}을 사용합니다.`,
      details: { current: currentBunVersion, expected: expectedVersion },
    });
  }

  const lockPath = resolve(root, "bun.lock");
  if ((await pathKind(lockPath)) === "file") {
    checks.push({
      id: "toolchain.lockfile",
      label: "Bun lockfile",
      status: "pass",
      message: "bun.lock이 있습니다.",
    });
  } else {
    checks.push({
      id: "toolchain.lockfile",
      label: "Bun lockfile",
      status: "error",
      message: "bun.lock을 찾지 못했습니다.",
      remediation: "저장소의 추적된 bun.lock을 복원한 뒤 다시 실행하세요.",
    });
  }

  if ((await pathKind(resolve(root, "node_modules"))) === "directory") {
    checks.push({
      id: "toolchain.dependencies",
      label: "의존성 설치",
      status: "pass",
      message: "로컬 node_modules가 준비되어 있습니다.",
    });
  } else {
    checks.push({
      id: "toolchain.dependencies",
      label: "의존성 설치",
      status: "warning",
      message: "node_modules가 없어 전체 로컬 검증을 실행할 수 없습니다.",
      remediation: "bun install --frozen-lockfile을 실행하세요.",
    });
  }

  const buildArtifacts = ["ecosystem/rootage/core/lib/index.js", "packages/react/lib"] as const;
  const missingArtifacts: string[] = [];
  for (const path of buildArtifacts) {
    if ((await pathKind(resolve(root, path))) === null) missingArtifacts.push(path);
  }
  if (missingArtifacts.length === 0) {
    checks.push({
      id: "toolchain.build-artifacts",
      label: "검증용 빌드 산출물",
      status: "pass",
      message: "ecosystem과 package 검증에 필요한 대표 산출물이 있습니다.",
    });
  } else {
    checks.push({
      id: "toolchain.build-artifacts",
      label: "검증용 빌드 산출물",
      status: "warning",
      message: "CI와 같은 전체 검증에 필요한 빌드 산출물이 없습니다.",
      details: { missing: missingArtifacts },
      remediation:
        "bun ecosystem:build, bun install --frozen-lockfile, bun packages:build 순서로 준비하세요.",
    });
  }

  return checks;
}

function repositoryFromRemote(remote: string): string | null {
  const patterns = [
    /^git@github\.com:(.+?)(?:\.git)?$/,
    /^ssh:\/\/git@github\.com\/(.+?)(?:\.git)?$/,
    /^https?:\/\/github\.com\/(.+?)(?:\.git)?\/?$/,
  ];
  for (const pattern of patterns) {
    const match = remote.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function isLane(value: string): value is LaneName {
  return laneSet.has(value);
}

async function hasCommitRef(root: string, ref: string): Promise<boolean> {
  const result = await runGit(root, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
  return result.exitCode === 0;
}

function worktreePaths(status: string): { tracked: string[]; untracked: string[] } {
  const tracked: string[] = [];
  const untracked: string[] = [];
  for (const line of status.split("\n")) {
    if (!line) continue;
    if (line.startsWith("?? ")) untracked.push(line.slice(3));
    else tracked.push(line.slice(3));
  }
  return { tracked, untracked };
}

async function inspectGit(root: string, config: LaneConfig | undefined): Promise<DoctorCheck[]> {
  const checks: DoctorCheck[] = [];
  const origin = await runGit(root, ["remote", "get-url", "origin"]);
  if (origin.exitCode !== 0 || !origin.stdout) {
    checks.push({
      id: "git.origin",
      label: "Git origin",
      status: "warning",
      message: "origin remote를 찾지 못했습니다.",
      remediation: "릴리즈 레인 ref를 확인할 수 있도록 seed-design origin을 설정하세요.",
    });
  } else {
    const repository = repositoryFromRemote(origin.stdout);
    if (config && repository !== config.repository) {
      checks.push({
        id: "git.origin",
        label: "Git origin",
        status: "warning",
        message: "origin이 릴리즈 설정의 저장소와 일치하지 않습니다.",
        details: {
          origin: origin.stdout,
          detectedRepository: repository ?? "unknown",
          expectedRepository: config.repository,
        },
        remediation: "fork에서 작업 중이라면 upstream 상태도 별도로 확인하세요.",
      });
    } else {
      checks.push({
        id: "git.origin",
        label: "Git origin",
        status: "pass",
        message: "origin이 릴리즈 설정의 저장소를 가리킵니다.",
        details: { origin: origin.stdout },
      });
    }
  }

  const branchResult = await runGit(root, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
  const headResult = await runGit(root, ["rev-parse", "HEAD"]);
  const branch = branchResult.exitCode === 0 ? branchResult.stdout : "";
  if (!branch) {
    checks.push({
      id: "git.branch",
      label: "현재 Git 브랜치",
      status: "warning",
      message: "detached HEAD 상태입니다.",
      details: { head: headResult.stdout || "unknown" },
      remediation: "로컬 릴리즈 검증은 dev, minor 또는 major 브랜치에서 실행하세요.",
    });
  } else if (!isLane(branch)) {
    checks.push({
      id: "git.branch",
      label: "현재 Git 브랜치",
      status: "warning",
      message: `${branch}은 릴리즈 레인이 아닙니다.`,
      details: { branch, head: headResult.stdout || "unknown" },
      remediation: "대상 상태를 검증하려면 dev, minor 또는 major checkout에서 다시 실행하세요.",
    });
  } else {
    const policy = config?.lanes[branch];
    checks.push({
      id: "git.branch",
      label: "현재 Git 브랜치",
      status: "pass",
      message: `${branch} 릴리즈 레인을 확인했습니다.`,
      details: {
        branch,
        head: headResult.stdout || "unknown",
        policy: policy
          ? `${policy.bump}${policy.prerelease ? "-prerelease" : "-stable"}`
          : "config-unavailable",
      },
    });
  }

  const missingRefs: string[] = [];
  for (const lane of laneNames) {
    const hasRemote = await hasCommitRef(root, `refs/remotes/origin/${lane}`);
    const hasLocal = hasRemote || (await hasCommitRef(root, `refs/heads/${lane}`));
    if (!hasLocal) missingRefs.push(lane);
  }
  if (missingRefs.length === 0) {
    checks.push({
      id: "git.lane-refs",
      label: "로컬 릴리즈 레인 ref",
      status: "pass",
      message: "dev/minor/major commit ref를 오프라인에서 확인할 수 있습니다.",
    });
  } else {
    checks.push({
      id: "git.lane-refs",
      label: "로컬 릴리즈 레인 ref",
      status: "warning",
      message: "일부 릴리즈 레인 ref가 로컬에 없습니다.",
      details: { missing: missingRefs },
      remediation: "네트워크 사용이 가능한 때 origin의 dev, minor, major ref를 fetch하세요.",
    });
  }

  if (!branch) {
    checks.push({
      id: "git.upstream",
      label: "upstream 차이",
      status: "warning",
      message: "detached HEAD에서는 upstream 차이를 계산하지 않습니다.",
    });
  } else {
    const upstream = await runGit(root, [
      "rev-parse",
      "--abbrev-ref",
      "--symbolic-full-name",
      "@{upstream}",
    ]);
    if (upstream.exitCode !== 0 || !upstream.stdout) {
      checks.push({
        id: "git.upstream",
        label: "upstream 차이",
        status: "warning",
        message: `${branch} 브랜치에 upstream이 없습니다.`,
        remediation: "대상 remote tracking branch를 설정한 뒤 최신 상태를 확인하세요.",
      });
    } else {
      const difference = await runGit(root, [
        "rev-list",
        "--left-right",
        "--count",
        `HEAD...${upstream.stdout}`,
      ]);
      const [aheadText = "0", behindText = "0"] = difference.stdout.split(/\s+/);
      const ahead = Number(aheadText);
      const behind = Number(behindText);
      if (difference.exitCode !== 0 || !Number.isInteger(ahead) || !Number.isInteger(behind)) {
        checks.push({
          id: "git.upstream",
          label: "upstream 차이",
          status: "warning",
          message: "로컬에 기록된 upstream과의 차이를 계산하지 못했습니다.",
          details: { upstream: upstream.stdout, error: difference.stderr || "unknown" },
        });
      } else if (ahead > 0 || behind > 0) {
        checks.push({
          id: "git.upstream",
          label: "upstream 차이",
          status: "warning",
          message: `로컬 기록 기준 ${upstream.stdout}와 차이가 있습니다.`,
          details: { upstream: upstream.stdout, ahead, behind },
          remediation: "원격 상태를 fetch한 뒤 대상 레인과의 차이를 다시 확인하세요.",
        });
      } else {
        checks.push({
          id: "git.upstream",
          label: "upstream 차이",
          status: "pass",
          message: `로컬 기록 기준 ${upstream.stdout}와 HEAD가 일치합니다.`,
          details: { upstream: upstream.stdout, ahead, behind },
        });
      }
    }
  }

  const status = await runGit(root, ["status", "--porcelain=v1", "--untracked-files=all"]);
  if (status.exitCode !== 0) {
    checks.push({
      id: "git.worktree",
      label: "Git worktree",
      status: "error",
      message: "worktree 상태를 확인하지 못했습니다.",
      details: { error: status.stderr || "git status 실패" },
    });
  } else if (!status.stdout) {
    checks.push({
      id: "git.worktree",
      label: "Git worktree",
      status: "pass",
      message: "worktree가 깨끗합니다.",
    });
  } else {
    const paths = worktreePaths(status.stdout);
    checks.push({
      id: "git.worktree",
      label: "Git worktree",
      status: "warning",
      message: "커밋되지 않은 파일이 있습니다. 진단기는 파일을 변경하지 않았습니다.",
      details: {
        trackedChanges: paths.tracked.length,
        untrackedFiles: paths.untracked.length,
        paths: [...paths.tracked, ...paths.untracked].slice(0, 20),
      },
      remediation: "릴리즈 검증 전에 변경이 의도된 것인지 확인하세요.",
    });
  }

  return checks;
}

function summarize(checks: DoctorCheck[]): DoctorReport["summary"] {
  const summary: DoctorReport["summary"] = { pass: 0, warning: 0, error: 0 };
  for (const check of checks) summary[check.status] += 1;
  return summary;
}

export async function collectDoctorReport(options: DoctorOptions = {}): Promise<DoctorReport> {
  const requestedRoot = resolve(options.root ?? process.cwd());
  const repository = await discoverRepository(requestedRoot);
  const release = await readReleaseConfiguration(repository.root);
  const checks = [
    ...release.checks,
    ...(await inspectToolchain(repository.root, options.bunVersion ?? Bun.version)),
    repository.check,
  ];
  if (repository.isRepository) {
    checks.push(...(await inspectGit(repository.root, release.config)));
  }

  const summary = summarize(checks);
  const conclusion = summary.error > 0 ? "error" : summary.warning > 0 ? "warning" : "ready";
  return {
    schemaVersion: 1,
    generatedAt: (options.now ?? new Date()).toISOString(),
    repositoryRoot: repository.root,
    conclusion,
    ok: summary.error === 0,
    summary,
    checks,
  };
}

function detailText(details: Record<string, DoctorDetail>): string {
  return Object.entries(details)
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(", ") : value}`)
    .join("; ");
}

export function formatDoctorReport(report: DoctorReport): string {
  const title =
    report.conclusion === "ready"
      ? "READY"
      : report.conclusion === "warning"
        ? "ATTENTION"
        : "BLOCKED";
  const symbols: Record<DoctorCheckStatus, string> = {
    pass: "✓",
    warning: "!",
    error: "✗",
  };
  const lines = [
    "SEED Design release doctor",
    `root: ${report.repositoryRoot}`,
    `result: ${title} (${report.summary.pass} pass, ${report.summary.warning} warning, ${report.summary.error} error)`,
    "",
  ];

  for (const check of report.checks) {
    lines.push(`${symbols[check.status]} ${check.label}: ${check.message}`);
    if (check.details) lines.push(`  ${detailText(check.details)}`);
  }

  const remediations = [
    ...new Set(
      report.checks
        .filter((check) => check.status !== "pass")
        .flatMap((check) => (check.remediation ? [check.remediation] : [])),
    ),
  ];
  if (remediations.length > 0) {
    lines.push("", "다음 조치:");
    remediations.forEach((remediation, index) => {
      lines.push(`${index + 1}. ${remediation}`);
    });
  }
  lines.push("", "자동화용 출력: bun release:doctor --json");
  return lines.join("\n");
}

function usage(): string {
  return [
    "Usage: bun release:doctor [--json] [--root <path>]",
    "",
    "  --json         구조화된 DoctorReport JSON을 출력합니다.",
    "  --root <path>  진단을 시작할 저장소 경로를 지정합니다.",
    "  --help         도움말을 출력합니다.",
  ].join("\n");
}

function parseArguments(argv: string[]): { json: boolean; root?: string; help: boolean } {
  let json = false;
  let root: string | undefined;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--json") json = true;
    else if (argument === "--help" || argument === "-h") help = true;
    else if (argument === "--root") {
      const value = argv[index + 1];
      if (!value) throw new Error("--root 다음에 경로가 필요합니다.");
      root = value;
      index += 1;
    } else if (argument?.startsWith("--root=")) {
      const value = argument.slice("--root=".length);
      if (!value) throw new Error("--root 경로가 비어 있습니다.");
      root = value;
    } else {
      throw new Error(`지원하지 않는 인자입니다: ${argument}`);
    }
  }
  return { json, root, help };
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  let arguments_: ReturnType<typeof parseArguments>;
  try {
    arguments_ = parseArguments(argv);
  } catch (error) {
    console.error(`${errorMessage(error)}\n\n${usage()}`);
    return 2;
  }

  if (arguments_.help) {
    console.log(usage());
    return 0;
  }

  const report = await collectDoctorReport({ root: arguments_.root });
  console.log(arguments_.json ? JSON.stringify(report, null, 2) : formatDoctorReport(report));
  return report.ok ? 0 : 1;
}

if (import.meta.main) process.exitCode = await main();
