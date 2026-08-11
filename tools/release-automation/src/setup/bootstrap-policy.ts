import { parseLaneConfig, parseReleaseControl } from "../core/config";
import type { LaneConfig, ReleaseControl, ReleaseMarker } from "../core/types";

const gitShaPattern = /^[0-9a-f]{40}$/;
const bootstrapFiles = [".changeset/config.json", ".changeset/pre.json"] as const;

export type BootstrapLane = "minor" | "major";

interface GitResult {
  code: number;
  output: string;
}

export interface BootstrapPullVerificationInput {
  repositoryPath?: string;
  marker: ReleaseMarker;
  lane: BootstrapLane;
  baseSha: string;
  headSha: string;
}

export interface BootstrapReadiness {
  devSha: string;
  lanes: Record<BootstrapLane, string>;
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
  return value as Record<string, unknown>;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function assertSameJson(actual: unknown, expected: unknown, label: string): void {
  if (canonicalJson(actual) !== canonicalJson(expected)) {
    throw new Error(`${label}이 trusted dev baseline과 다릅니다.`);
  }
}

function assertExactFiles(actual: string[], label: string): void {
  const normalized = [...new Set(actual)].sort();
  const expected = [...bootstrapFiles].sort();
  if (canonicalJson(normalized) !== canonicalJson(expected)) {
    throw new Error(`${label}은 ${expected.join(", ")}만 변경할 수 있습니다.`);
  }
}

async function git(
  repositoryPath: string,
  arguments_: string[],
  allowFailure = false,
): Promise<GitResult> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  const output = `${stdout}${stderr}`.trim();
  if (code !== 0 && !allowFailure) {
    throw new Error(`git ${arguments_.join(" ")} 실패:\n${output}`);
  }
  return { code, output };
}

async function readJson(repositoryPath: string, ref: string, path: string): Promise<unknown> {
  const result = await git(repositoryPath, ["show", `${ref}:${path}`]);
  const value: unknown = JSON.parse(result.output);
  return value;
}

async function pathExists(repositoryPath: string, ref: string, path: string): Promise<boolean> {
  return (await git(repositoryPath, ["cat-file", "-e", `${ref}:${path}`], true)).code === 0;
}

function workspacePatterns(rootPackage: Record<string, unknown>): string[] {
  if (Array.isArray(rootPackage.workspaces)) {
    if (!rootPackage.workspaces.every((item) => typeof item === "string")) {
      throw new Error("workspace package 경로가 문자열 배열이 아닙니다.");
    }
    return rootPackage.workspaces as string[];
  }
  const workspaces = asRecord(rootPackage.workspaces, "workspace 설정");
  if (!Array.isArray(workspaces.packages)) {
    throw new Error("workspace package 경로가 없습니다.");
  }
  if (!workspaces.packages.every((item) => typeof item === "string")) {
    throw new Error("workspace package 경로가 문자열 배열이 아닙니다.");
  }
  return workspaces.packages as string[];
}

export async function workspaceVersionsAt(
  repositoryPath: string,
  ref: string,
): Promise<Record<string, string>> {
  const rootPackage = asRecord(
    await readJson(repositoryPath, ref, "package.json"),
    "루트 package.json",
  );
  const patterns = workspacePatterns(rootPackage).map(
    (pattern) => new Bun.Glob(`${pattern.replace(/\/$/, "")}/package.json`),
  );
  const tree = await git(repositoryPath, ["ls-tree", "-r", "--name-only", ref]);
  const packagePaths = tree.output
    .split("\n")
    .filter(
      (path) => path.endsWith("/package.json") && patterns.some((pattern) => pattern.match(path)),
    );
  if (packagePaths.length === 0) throw new Error("baseline workspace package를 찾지 못했습니다.");

  const versions: Record<string, string> = {};
  for (const path of packagePaths) {
    const packageJson = asRecord(await readJson(repositoryPath, ref, path), path);
    if (typeof packageJson.name !== "string" || typeof packageJson.version !== "string") {
      throw new Error(`${path}에 package name/version이 없습니다.`);
    }
    if (versions[packageJson.name] !== undefined) {
      throw new Error(`workspace package name이 중복됩니다: ${packageJson.name}`);
    }
    versions[packageJson.name] = packageJson.version;
  }
  return versions;
}

async function assertBootstrapState(
  repositoryPath: string,
  baselineRef: string,
  laneRef: string,
  lane: BootstrapLane,
): Promise<void> {
  if (await pathExists(repositoryPath, baselineRef, ".changeset/pre.json")) {
    throw new Error("trusted dev baseline은 pre-release 상태가 아니어야 합니다.");
  }

  const baselineConfig = asRecord(
    await readJson(repositoryPath, baselineRef, ".changeset/config.json"),
    "baseline Changesets config",
  );
  if (baselineConfig.baseBranch !== "dev") {
    throw new Error("trusted dev baseline의 Changesets baseBranch는 dev여야 합니다.");
  }
  const laneConfig = asRecord(
    await readJson(repositoryPath, laneRef, ".changeset/config.json"),
    `${lane} Changesets config`,
  );
  assertSameJson(laneConfig, { ...baselineConfig, baseBranch: lane }, `${lane} Changesets config`);

  const preState = asRecord(
    await readJson(repositoryPath, laneRef, ".changeset/pre.json"),
    `${lane} Changesets pre state`,
  );
  const keys = Object.keys(preState).sort();
  if (canonicalJson(keys) !== canonicalJson(["changesets", "initialVersions", "mode", "tag"])) {
    throw new Error(`${lane} Changesets pre state 키가 정확하지 않습니다.`);
  }
  if (
    preState.mode !== "pre" ||
    preState.tag !== "beta" ||
    !Array.isArray(preState.changesets) ||
    preState.changesets.length !== 0
  ) {
    throw new Error(`${lane}은 빈 changeset의 beta pre-release 상태여야 합니다.`);
  }
  const initialVersions = asRecord(preState.initialVersions, `${lane} initialVersions`);
  const expectedVersions = await workspaceVersionsAt(repositoryPath, baselineRef);
  assertSameJson(initialVersions, expectedVersions, `${lane} initialVersions`);
}

export function assertBootstrapControlState(control: ReleaseControl, config: LaneConfig): void {
  if (
    control.mode !== "dry-run" ||
    !control.rootageContractReady ||
    config.sync.activation !== null
  ) {
    throw new Error(
      "bootstrap과 enable-sync 준비는 Rootage 계약이 준비된 dry-run·sync 비활성 상태에서만 가능합니다.",
    );
  }
}

async function controlStateAt(
  repositoryPath: string,
  ref: string,
): Promise<{
  control: ReleaseControl;
  config: LaneConfig;
}> {
  const [rawControl, rawConfig] = await Promise.all([
    readJson(repositoryPath, ref, ".github/release/control.json"),
    readJson(repositoryPath, ref, ".github/release/lanes.json"),
  ]);
  return {
    control: parseReleaseControl(rawControl),
    config: parseLaneConfig(rawConfig),
  };
}

export async function verifyBootstrapPull(input: BootstrapPullVerificationInput): Promise<void> {
  const repositoryPath = input.repositoryPath ?? process.cwd();
  const { marker, lane, baseSha, headSha } = input;
  if (
    marker.type !== "bootstrap" ||
    marker.lane !== lane ||
    marker.targetLane !== lane ||
    marker.tag !== "beta" ||
    marker.expectedHeadSha !== headSha ||
    marker.controlSha !== baseSha ||
    !gitShaPattern.test(baseSha) ||
    !gitShaPattern.test(headSha)
  ) {
    throw new Error("bootstrap marker가 exact lane/base/head/beta 상태에 결속되지 않았습니다.");
  }

  const [currentDevSha, currentLaneSha] = await Promise.all([
    git(repositoryPath, ["rev-parse", "origin/dev"]),
    git(repositoryPath, ["rev-parse", `origin/${lane}`]),
  ]);
  if (currentLaneSha.output !== baseSha) {
    throw new Error(`${lane} PR base가 marker의 trusted dev baseline과 다릅니다.`);
  }
  if (currentDevSha.output !== baseSha) {
    throw new Error("bootstrap baseline이 current origin/dev exact SHA와 다릅니다.");
  }

  const state = await controlStateAt(repositoryPath, "origin/dev");
  assertBootstrapControlState(state.control, state.config);
  const parents = (await git(repositoryPath, ["rev-list", "--parents", "-n", "1", headSha])).output
    .split(/\s+/)
    .filter(Boolean);
  if (parents.length !== 2 || parents[0] !== headSha || parents[1] !== baseSha) {
    throw new Error("bootstrap head는 exact lane base에서 만든 단일 commit이어야 합니다.");
  }
  const files = (
    await git(repositoryPath, ["diff", "--name-only", `${baseSha}..${headSha}`, "--"])
  ).output
    .split("\n")
    .filter(Boolean);
  assertExactFiles(files, "bootstrap PR");
  await assertBootstrapState(repositoryPath, baseSha, headSha, lane);
}

export async function verifyBootstrapReadiness(
  repositoryPath = process.cwd(),
): Promise<BootstrapReadiness> {
  const devSha = (await git(repositoryPath, ["rev-parse", "origin/dev"])).output;
  if (!gitShaPattern.test(devSha)) throw new Error("current dev SHA가 올바르지 않습니다.");
  const state = await controlStateAt(repositoryPath, "origin/dev");
  assertBootstrapControlState(state.control, state.config);

  const lanes = {} as Record<BootstrapLane, string>;
  for (const lane of ["minor", "major"] as const) {
    const laneResult = await git(repositoryPath, ["rev-parse", `origin/${lane}`], true);
    if (laneResult.code !== 0 || !gitShaPattern.test(laneResult.output)) {
      throw new Error(`${lane} remote lane이 없습니다. 먼저 bootstrap을 완료하세요.`);
    }
    if (
      (await git(repositoryPath, ["merge-base", "--is-ancestor", devSha, laneResult.output], true))
        .code !== 0
    ) {
      throw new Error(
        `${lane}에 current dev가 모두 반영되지 않았습니다. enable-sync 전에 lane을 catch-up하세요.`,
      );
    }
    const files = (
      await git(repositoryPath, ["diff", "--name-only", `${devSha}..${laneResult.output}`, "--"])
    ).output
      .split("\n")
      .filter(Boolean);
    assertExactFiles(files, `${lane} bootstrap tree`);
    await assertBootstrapState(repositoryPath, devSha, laneResult.output, lane);
    lanes[lane] = laneResult.output;
  }
  return { devSha, lanes };
}
