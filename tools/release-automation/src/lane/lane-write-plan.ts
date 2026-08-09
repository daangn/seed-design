import { createHash } from "node:crypto";
import { appendFile, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { parseLaneConfig, parseReleaseControl } from "../core/config";
import { GitHubClient, type GitHubPullRequest } from "../core/github";
import { encodeMarker } from "../core/marker";
import type { LaneConfig, LaneName, ReleaseControl, ReleaseMarker } from "../core/types";
import { compareSemver } from "../publish/publish";
import { trustedVersionMarker } from "../publish/publish-state";
import { assertLanePullAllowed } from "./pull-policy";

const gitShaPattern = /^[0-9a-f]{40}$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;
const exactPlanKeys = [
  "schemaVersion",
  "kind",
  "lane",
  "baseSha",
  "controlSha",
  "treeSha",
  "patchSha256",
  "files",
] as const;
const maxPatchBytes = 50 * 1024 * 1024;
const maxPlanBytes = 128 * 1024;
const rootagePackageName = "@seed-design/rootage-artifacts";
const rootageGeneratedIndexJson = "packages/rootage/__generated__/index.json";
const rootageGeneratedIndexTypes = "packages/rootage/__generated__/index.d.ts";

export interface LaneWritePlan {
  schemaVersion: 1;
  kind: "version";
  lane: LaneName;
  baseSha: string;
  controlSha: string;
  treeSha: string;
  patchSha256: string;
  files: string[];
}

export interface VersionRelease {
  name: string;
  from: string;
  to: string;
}

interface GitOptions {
  allowFailure?: boolean;
  environment?: Record<string, string | undefined>;
  trimOutput?: boolean;
}

interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
}

interface PreState {
  mode: "pre" | "exit";
  tag: string;
  initialVersions: Record<string, string>;
  changesets: string[];
}

interface PackageManifest {
  path: string;
  value: Record<string, unknown>;
  name: string;
  version: string;
}

interface TrustedChangesetsStatus {
  changesets: Array<{
    id: string;
    releases: Array<{ name: string; type: "patch" | "minor" | "major" }>;
  }>;
  releases: Array<{
    name: string;
    oldVersion: string;
    newVersion: string;
  }>;
}

interface VersionTreeOptions {
  verifyTrustedChangesets?: boolean;
}

export interface LaneWritePlanIdentity {
  kind: "version";
  lane: LaneName;
  baseSha: string;
  controlSha: string;
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
    throw new Error(`${label}이 exact trusted plan과 다릅니다.`);
  }
}

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function parseJsonWithTrailingCommas(text: string, label: string): unknown {
  let normalized = "";
  let inString = false;
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index] ?? "";
    if (inString) {
      normalized += character;
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }
    if (character === '"') {
      inString = true;
      normalized += character;
      continue;
    }
    if (character === ",") {
      let next = index + 1;
      while (next < text.length && /\s/.test(text[next] ?? "")) next += 1;
      if (text[next] === "}" || text[next] === "]") continue;
    }
    normalized += character;
  }
  if (inString || escaped) throw new Error(`${label} JSON string이 끝나지 않았습니다.`);
  try {
    return JSON.parse(normalized) as unknown;
  } catch {
    throw new Error(`${label}이 trailing comma 외 문법을 포함한 잘못된 JSON입니다.`);
  }
}

function isSafePath(path: string): boolean {
  return (
    path.length > 0 &&
    !path.startsWith("/") &&
    !path.includes("\\") &&
    !/[\0\r\n]/.test(path) &&
    path.split("/").every((part) => part !== "" && part !== "." && part !== "..")
  );
}

function normalizeFiles(files: string[]): string[] {
  if (!files.every(isSafePath))
    throw new Error("plan 변경 경로가 안전한 repository 경로가 아닙니다.");
  const normalized = [...new Set(files)].sort();
  if (normalized.length !== files.length || canonicalJson(normalized) !== canonicalJson(files)) {
    throw new Error("plan 변경 경로는 중복 없이 정렬되어야 합니다.");
  }
  return normalized;
}

function parseLane(value: unknown): LaneName {
  if (value !== "dev" && value !== "minor" && value !== "major") {
    throw new Error(`지원하지 않는 release lane입니다: ${String(value)}`);
  }
  return value;
}

export function parseLaneWritePlan(value: unknown): LaneWritePlan {
  const plan = asRecord(value, "lane write plan");
  assertSameJson(Object.keys(plan).sort(), [...exactPlanKeys].sort(), "lane write plan key");
  if (plan.schemaVersion !== 1 || plan.kind !== "version") {
    throw new Error("lane write plan schema/kind가 올바르지 않습니다.");
  }
  const lane = parseLane(plan.lane);
  for (const [label, sha] of [
    ["base", plan.baseSha],
    ["control", plan.controlSha],
    ["tree", plan.treeSha],
  ] as const) {
    if (typeof sha !== "string" || !gitShaPattern.test(sha)) {
      throw new Error(`${label} SHA가 올바르지 않습니다.`);
    }
  }
  if (typeof plan.patchSha256 !== "string" || !sha256Pattern.test(plan.patchSha256)) {
    throw new Error("plan patch SHA-256이 올바르지 않습니다.");
  }
  if (!Array.isArray(plan.files) || !plan.files.every((file) => typeof file === "string")) {
    throw new Error("plan files가 문자열 배열이 아닙니다.");
  }
  const files = normalizeFiles(plan.files as string[]);
  return {
    schemaVersion: 1,
    kind: "version",
    lane,
    baseSha: plan.baseSha as string,
    controlSha: plan.controlSha as string,
    treeSha: plan.treeSha as string,
    patchSha256: plan.patchSha256,
    files,
  };
}

export function assertLaneWritePlanIdentity(
  plan: LaneWritePlan,
  expected: LaneWritePlanIdentity,
): void {
  if (
    plan.kind !== expected.kind ||
    plan.lane !== expected.lane ||
    plan.baseSha !== expected.baseSha ||
    plan.controlSha !== expected.controlSha
  ) {
    throw new Error("release plan artifact identity가 trusted workflow selection과 다릅니다.");
  }
}

async function git(
  repositoryPath: string,
  arguments_: string[],
  options: GitOptions = {},
): Promise<GitResult> {
  const environment = options.environment ?? {
    ...process.env,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
  };
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    env: environment,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0 && !options.allowFailure) {
    throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr.trim()}`);
  }
  return {
    code,
    stdout: options.trimOutput === false ? stdout : stdout.trim(),
    stderr: stderr.trim(),
  };
}

async function readTextAt(
  repositoryPath: string,
  ref: string,
  path: string,
  optional = false,
  trimOutput = true,
): Promise<string | null> {
  const result = await git(repositoryPath, ["show", `${ref}:${path}`], {
    allowFailure: optional,
    trimOutput,
  });
  if (result.code !== 0) return null;
  return result.stdout;
}

async function readJsonAt(
  repositoryPath: string,
  ref: string,
  path: string,
  optional = false,
): Promise<unknown | null> {
  const text = await readTextAt(repositoryPath, ref, path, optional);
  if (text === null) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`${ref}:${path}이 올바른 JSON이 아닙니다.`);
  }
}

async function pathExists(repositoryPath: string, ref: string, path: string): Promise<boolean> {
  return (
    (await git(repositoryPath, ["cat-file", "-e", `${ref}:${path}`], { allowFailure: true }))
      .code === 0
  );
}

function parsePreState(value: unknown, label: string): PreState {
  const state = asRecord(value, label);
  assertSameJson(
    Object.keys(state).sort(),
    ["changesets", "initialVersions", "mode", "tag"],
    `${label} key`,
  );
  if (state.mode !== "pre" && state.mode !== "exit") {
    throw new Error(`${label} mode가 올바르지 않습니다.`);
  }
  if (typeof state.tag !== "string" || !/^[a-z][a-z0-9-]{0,31}$/.test(state.tag)) {
    throw new Error(`${label} tag가 올바르지 않습니다.`);
  }
  const initialVersions = asRecord(state.initialVersions, `${label} initialVersions`);
  if (!Object.values(initialVersions).every((version) => typeof version === "string")) {
    throw new Error(`${label} initialVersions가 문자열 map이 아닙니다.`);
  }
  if (
    !Array.isArray(state.changesets) ||
    !state.changesets.every((changeset) => typeof changeset === "string") ||
    new Set(state.changesets).size !== state.changesets.length
  ) {
    throw new Error(`${label} changesets가 고유 문자열 배열이 아닙니다.`);
  }
  return {
    mode: state.mode,
    tag: state.tag,
    initialVersions: initialVersions as Record<string, string>,
    changesets: state.changesets as string[],
  };
}

async function releaseControlAt(
  repositoryPath: string,
  ref: string,
): Promise<{ control: ReleaseControl; config: LaneConfig }> {
  const [control, config] = await Promise.all([
    readJsonAt(repositoryPath, ref, ".github/release/control.json"),
    readJsonAt(repositoryPath, ref, ".github/release/lanes.json"),
  ]);
  return {
    control: parseReleaseControl(control),
    config: parseLaneConfig(config),
  };
}

async function assertLaneChangesetsConfig(
  repositoryPath: string,
  ref: string,
  lane: LaneName,
): Promise<void> {
  const value = asRecord(
    await readJsonAt(repositoryPath, ref, ".changeset/config.json"),
    `${lane} Changesets config`,
  );
  if (value.baseBranch !== lane) {
    throw new Error(`${lane} Changesets baseBranch가 exact lane과 다릅니다.`);
  }
}

function isPackageJsonPath(path: string): boolean {
  return path === "package.json" || path.endsWith("/package.json");
}

function isChangesetMarkdown(path: string): boolean {
  return /^\.changeset\/[a-z0-9][a-z0-9-]*\.md$/.test(path) && path !== ".changeset/README.md";
}

function isGeneratedVersionData(path: string): boolean {
  return path === rootageGeneratedIndexJson || path === rootageGeneratedIndexTypes;
}

export function isAllowedVersionPlanPath(path: string): boolean {
  return (
    path === "bun.lock" ||
    path === ".changeset/pre.json" ||
    isChangesetMarkdown(path) ||
    isPackageJsonPath(path) ||
    path.endsWith("/CHANGELOG.md") ||
    isGeneratedVersionData(path)
  );
}

async function packageManifestsAt(
  repositoryPath: string,
  ref: string,
): Promise<Map<string, PackageManifest>> {
  const tree = await git(repositoryPath, ["ls-tree", "-r", "--name-only", ref]);
  const manifests = new Map<string, PackageManifest>();
  for (const path of tree.stdout.split("\n").filter(isPackageJsonPath)) {
    const value = asRecord(await readJsonAt(repositoryPath, ref, path), `${ref}:${path}`);
    if (typeof value.name !== "string" || typeof value.version !== "string") continue;
    if (manifests.has(value.name)) throw new Error(`package name이 중복됩니다: ${value.name}`);
    manifests.set(value.name, { path, value, name: value.name, version: value.version });
  }
  return manifests;
}

function withoutVersionFields(value: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...value };
  delete copy.version;
  for (const field of dependencyFields) delete copy[field];
  return copy;
}

export function isExactRootageGeneratedIndexUpdate(
  baseValue: unknown,
  plannedValue: unknown,
  fromVersion: string,
  toVersion: string,
): boolean {
  try {
    const base = asRecord(baseValue, "base Rootage generated index");
    const planned = asRecord(plannedValue, "planned Rootage generated index");
    if (base.version !== fromVersion || planned.version !== toVersion) return false;
    const expected = structuredClone(base);
    expected.version = toVersion;
    return canonicalJson(planned) === canonicalJson(expected);
  } catch {
    return false;
  }
}

export function isExactRootageGeneratedTypesUpdate(
  baseText: string,
  plannedText: string,
  fromVersion: string,
  toVersion: string,
): boolean {
  const fromToken = `"version": ${JSON.stringify(fromVersion)};`;
  const toToken = `"version": ${JSON.stringify(toVersion)};`;
  if (baseText.split(fromToken).length !== 2 || plannedText.split(toToken).length !== 2) {
    return false;
  }
  return plannedText === baseText.replace(fromToken, toToken);
}

async function assertRootageGeneratedVersionData(
  repositoryPath: string,
  plan: LaneWritePlan,
  plannedRef: string,
  basePackages: Map<string, PackageManifest>,
  plannedPackages: Map<string, PackageManifest>,
  releaseNames: Set<string>,
): Promise<void> {
  const changedGenerated = plan.files.filter(isGeneratedVersionData).sort();
  const basePackage = basePackages.get(rootagePackageName);
  const plannedPackage = plannedPackages.get(rootagePackageName);
  const rootageReleased =
    basePackage &&
    plannedPackage &&
    releaseNames.has(rootagePackageName) &&
    basePackage.version !== plannedPackage.version;
  if (!rootageReleased) {
    if (changedGenerated.length === 0) return;
    throw new Error(
      "Rootage generated version data가 같은 plan의 package 증가에 결속되지 않았습니다.",
    );
  }
  assertSameJson(
    changedGenerated,
    [rootageGeneratedIndexTypes, rootageGeneratedIndexJson].sort(),
    "Rootage version generated files",
  );
  const [baseJson, plannedJson, baseTypes, plannedTypes] = await Promise.all([
    readJsonAt(repositoryPath, plan.baseSha, rootageGeneratedIndexJson),
    readJsonAt(repositoryPath, plannedRef, rootageGeneratedIndexJson),
    readTextAt(repositoryPath, plan.baseSha, rootageGeneratedIndexTypes, false, false),
    readTextAt(repositoryPath, plannedRef, rootageGeneratedIndexTypes, false, false),
  ]);
  if (
    !isExactRootageGeneratedIndexUpdate(
      baseJson,
      plannedJson,
      basePackage.version,
      plannedPackage.version,
    ) ||
    baseTypes === null ||
    plannedTypes === null ||
    !isExactRootageGeneratedTypesUpdate(
      baseTypes,
      plannedTypes,
      basePackage.version,
      plannedPackage.version,
    )
  ) {
    throw new Error("Rootage generated index가 exact package version 치환과 다릅니다.");
  }
}

function lockWorkspaceKey(packageJsonPath: string): string {
  return packageJsonPath === "package.json"
    ? ""
    : packageJsonPath.slice(0, -"/package.json".length);
}

async function assertBunLockMatchesManifests(
  repositoryPath: string,
  plan: LaneWritePlan,
  plannedRef: string,
  changedPackagePaths: string[],
  plannedPackages: Map<string, PackageManifest>,
): Promise<void> {
  const [baseText, plannedText] = await Promise.all([
    readTextAt(repositoryPath, plan.baseSha, "bun.lock"),
    readTextAt(repositoryPath, plannedRef, "bun.lock"),
  ]);
  if (baseText === null || plannedText === null)
    throw new Error("Version plan bun.lock이 없습니다.");
  const baseValue = parseJsonWithTrailingCommas(baseText, "base bun.lock");
  const plannedValue = parseJsonWithTrailingCommas(plannedText, "planned bun.lock");
  const expected = structuredClone(asRecord(baseValue, "base bun.lock"));
  const planned = asRecord(plannedValue, "planned bun.lock");
  const expectedWorkspaces = asRecord(expected.workspaces, "base bun.lock workspaces");

  for (const path of changedPackagePaths) {
    const proposed = [...plannedPackages.values()].find((item) => item.path === path);
    if (!proposed) throw new Error(`planned package manifest가 없습니다: ${path}`);
    const workspaceKey = lockWorkspaceKey(path);
    const entry = asRecord(
      expectedWorkspaces[workspaceKey],
      `bun.lock workspaces[${JSON.stringify(workspaceKey)}]`,
    );
    if (path !== "package.json") entry.version = proposed.version;
    for (const field of dependencyFields) {
      if (proposed.value[field] === undefined) {
        delete entry[field];
      } else {
        entry[field] = structuredClone(dependencyMap(proposed.value, field));
      }
    }
  }
  assertSameJson(planned, expected, "bun.lock workspace-only reconstruction");
}

function dependencyMap(value: Record<string, unknown>, field: string): Record<string, string> {
  const candidate = value[field];
  if (candidate === undefined) return {};
  const map = asRecord(candidate, field);
  if (!Object.values(map).every((item) => typeof item === "string")) {
    throw new Error(`${field}가 문자열 map이 아닙니다.`);
  }
  return map as Record<string, string>;
}

export function isExactWorkspaceDependencyUpdate(
  before: string | undefined,
  after: string | undefined,
  toVersion: string,
): boolean {
  if (!before || !after) return false;
  if (before === "workspace:*" || before === "workspace:^" || before === "workspace:~") {
    return after === before;
  }
  if (
    /^(?:file:|link:|npm:|git(?:\+|:)|https?:)/.test(before) ||
    before === "*" ||
    before === "latest"
  ) {
    return after === before;
  }
  const workspacePrefix = before.startsWith("workspace:") ? "workspace:" : "";
  const raw = workspacePrefix ? before.slice("workspace:".length) : before;
  if (!raw || /[\0\r\n]/.test(raw) || raw.length > 512) return false;
  const preservedPrefix =
    ["^", "~", ">=", "<=", ">"].find((prefix) => raw.startsWith(prefix)) ?? "";
  return after === `${workspacePrefix}${preservedPrefix}${toVersion}`;
}

async function assertVersionPreState(
  repositoryPath: string,
  plan: LaneWritePlan,
  plannedRef: string,
): Promise<void> {
  const deletedChangesets: string[] = [];
  for (const path of plan.files.filter(isChangesetMarkdown)) {
    if (!(await pathExists(repositoryPath, plan.baseSha, path))) {
      throw new Error(`Version plan이 base에 없는 changeset을 추가했습니다: ${path}`);
    }
    if (await pathExists(repositoryPath, plannedRef, path)) {
      throw new Error(`Version plan은 changeset을 수정하지 않고 삭제해야 합니다: ${path}`);
    }
    deletedChangesets.push(path.slice(".changeset/".length, -".md".length));
  }

  const baseValue = await readJsonAt(repositoryPath, plan.baseSha, ".changeset/pre.json", true);
  const plannedValue = await readJsonAt(repositoryPath, plannedRef, ".changeset/pre.json", true);
  if (baseValue === null) {
    if (plannedValue !== null)
      throw new Error("stable Version plan이 pre.json을 만들 수 없습니다.");
    if (deletedChangesets.length === 0 && plan.files.length > 0) {
      throw new Error("stable Version plan에는 소비된 changeset이 필요합니다.");
    }
    return;
  }

  const base = parsePreState(baseValue, "base Version pre state");
  if (base.mode === "exit") {
    if (plannedValue !== null) throw new Error("exit Version plan은 pre.json을 삭제해야 합니다.");
    return;
  }
  if (plannedValue === null) throw new Error("pre Version plan이 pre.json을 삭제할 수 없습니다.");
  if (deletedChangesets.length === 0 && plan.files.length > 0) {
    throw new Error("pre Version plan에는 새로 소비된 changeset이 필요합니다.");
  }
  const proposed = parsePreState(plannedValue, "proposed Version pre state");
  const expectedChangesets = [...new Set([...base.changesets, ...deletedChangesets])].sort();
  assertSameJson(
    proposed,
    { ...base, changesets: expectedChangesets },
    "Version proposed pre state",
  );
}

async function assertRegularFileModes(
  repositoryPath: string,
  ref: string,
  files: string[],
): Promise<void> {
  for (const path of files) {
    if (!(await pathExists(repositoryPath, ref, path))) continue;
    const entry = await git(repositoryPath, ["ls-tree", ref, "--", path]);
    const mode = entry.stdout.split(/\s+/)[0];
    if (mode !== "100644") {
      throw new Error(`Version plan data file은 regular non-executable file이어야 합니다: ${path}`);
    }
  }
}

function parseTrustedChangesetsStatus(value: unknown): TrustedChangesetsStatus {
  const status = asRecord(value, "trusted Changesets status");
  if (!Array.isArray(status.changesets) || !Array.isArray(status.releases)) {
    throw new Error("trusted Changesets status의 changesets/releases가 배열이 아닙니다.");
  }
  const changesets = status.changesets.map((candidate, index) => {
    const changeset = asRecord(candidate, `trusted Changesets status changesets[${index}]`);
    if (typeof changeset.id !== "string" || !isSafePath(changeset.id)) {
      throw new Error(
        `trusted Changesets changeset id가 올바르지 않습니다: ${String(changeset.id)}`,
      );
    }
    if (!Array.isArray(changeset.releases) || changeset.releases.length === 0) {
      throw new Error(`trusted Changesets changeset ${changeset.id}의 release가 없습니다.`);
    }
    const releases = changeset.releases.map((candidateRelease, releaseIndex) => {
      const release = asRecord(
        candidateRelease,
        `trusted Changesets changesets[${index}].releases[${releaseIndex}]`,
      );
      const type = release.type;
      if (
        typeof release.name !== "string" ||
        (type !== "patch" && type !== "minor" && type !== "major")
      ) {
        throw new Error(
          `trusted Changesets changeset ${changeset.id}의 release가 올바르지 않습니다.`,
        );
      }
      return {
        name: release.name,
        type: type as "patch" | "minor" | "major",
      };
    });
    return { id: changeset.id, releases };
  });
  if (new Set(changesets.map((changeset) => changeset.id)).size !== changesets.length) {
    throw new Error("trusted Changesets changeset id가 중복됩니다.");
  }

  const releases = status.releases.map((candidate, index) => {
    const release = asRecord(candidate, `trusted Changesets status releases[${index}]`);
    if (
      typeof release.name !== "string" ||
      typeof release.oldVersion !== "string" ||
      typeof release.newVersion !== "string"
    ) {
      throw new Error(`trusted Changesets status release[${index}]가 올바르지 않습니다.`);
    }
    return {
      name: release.name,
      oldVersion: release.oldVersion,
      newVersion: release.newVersion,
    };
  });
  if (new Set(releases.map((release) => release.name)).size !== releases.length) {
    throw new Error("trusted Changesets release package가 중복됩니다.");
  }
  return { changesets, releases };
}

async function trustedChangesetsStatusAt(
  repositoryPath: string,
  baseSha: string,
): Promise<TrustedChangesetsStatus> {
  const repositoryRoot = join(import.meta.dir, "..", "..", "..", "..");
  const cliPath = join(repositoryRoot, "node_modules", "@changesets", "cli", "bin.js");
  const cliStat = await lstat(cliPath).catch(() => null);
  if (!cliStat?.isFile()) {
    throw new Error(
      "trusted Changesets CLI가 없습니다. writer에서 trusted dev dependencies를 먼저 설치해야 합니다.",
    );
  }

  const worktreePath = await mkdtemp(join(tmpdir(), "seed-release-changesets-base-"));
  const outputDirectory = await mkdtemp(join(tmpdir(), "seed-release-changesets-status-"));
  const outputPath = join(outputDirectory, "release-plan.json");
  let worktreeAdded = false;
  try {
    await git(repositoryPath, ["worktree", "add", "--detach", worktreePath, baseSha]);
    worktreeAdded = true;
    const changesetsConfigPath = join(worktreePath, ".changeset", "config.json");
    const changesetsConfig = asRecord(
      JSON.parse(await readFile(changesetsConfigPath, "utf8")) as unknown,
      "trusted Changesets config",
    );
    changesetsConfig.baseBranch = baseSha;
    await writeFile(changesetsConfigPath, `${JSON.stringify(changesetsConfig, null, 2)}\n`);
    const outputArgument = relative(worktreePath, outputPath);
    const child = Bun.spawn(["node", cliPath, "status", `--output=${outputArgument}`], {
      cwd: worktreePath,
      env: {
        ...process.env,
        CI: "true",
        BUN_CONFIG: undefined,
        BUN_OPTIONS: undefined,
        GH_TOKEN: undefined,
        GITHUB_TOKEN: undefined,
        NODE_AUTH_TOKEN: undefined,
        NODE_OPTIONS: undefined,
        NODE_PATH: undefined,
        NPM_TOKEN: undefined,
      },
      stdout: "pipe",
      stderr: "pipe",
    });
    const [stdout, stderr, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code !== 0) {
      throw new Error(
        `trusted Changesets release plan 재계산이 실패했습니다 (${code}):\n${stderr.trim() || stdout.trim()}`,
      );
    }
    return parseTrustedChangesetsStatus(JSON.parse(await readFile(outputPath, "utf8")) as unknown);
  } finally {
    if (worktreeAdded) {
      await git(repositoryPath, ["worktree", "remove", "--force", worktreePath], {
        allowFailure: true,
      });
    }
    await Promise.all([
      rm(worktreePath, { recursive: true, force: true }),
      rm(outputDirectory, { recursive: true, force: true }),
    ]);
  }
}

async function assertTrustedChangesetsReleasePlan(
  repositoryPath: string,
  plan: LaneWritePlan,
  releases: VersionRelease[],
  config: LaneConfig,
): Promise<void> {
  const status = await trustedChangesetsStatusAt(repositoryPath, plan.baseSha);
  const expectedBump = config.lanes[plan.lane].bump;
  for (const changeset of status.changesets) {
    for (const release of changeset.releases) {
      if (release.type !== expectedBump) {
        throw new Error(
          `.changeset/${changeset.id}.md의 ${release.name} bump가 ${plan.lane} 정책 ${expectedBump}와 다릅니다.`,
        );
      }
    }
  }

  const expectedReleases = status.releases
    .map((release) => ({
      name: release.name,
      from: release.oldVersion,
      to: release.newVersion,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  if (canonicalJson(releases) !== canonicalJson(expectedReleases)) {
    throw new Error(
      `trusted Changesets exact release plan과 다릅니다: expected=${JSON.stringify(expectedReleases)} actual=${JSON.stringify(releases)}`,
    );
  }

  const expectedDeletedChangesets = status.changesets
    .map((changeset) => `.changeset/${changeset.id}.md`)
    .sort();
  assertSameJson(
    plan.files.filter(isChangesetMarkdown).sort(),
    expectedDeletedChangesets,
    "trusted Changesets consumed files",
  );
}

async function assertVersionTree(
  repositoryPath: string,
  plan: LaneWritePlan,
  plannedRef: string,
  options: VersionTreeOptions = {},
): Promise<VersionRelease[]> {
  const invalid = plan.files.filter((path) => !isAllowedVersionPlanPath(path));
  if (invalid.length > 0) {
    throw new Error(`Version plan이 실행 가능한/보호 경로를 변경했습니다: ${invalid.join(", ")}`);
  }
  await assertLaneChangesetsConfig(repositoryPath, plan.baseSha, plan.lane);
  await assertRegularFileModes(repositoryPath, plannedRef, plan.files);
  if (plan.files.length === 0) {
    if (
      plan.treeSha !== (await git(repositoryPath, ["rev-parse", `${plan.baseSha}^{tree}`])).stdout
    ) {
      throw new Error("빈 Version plan의 tree가 base tree와 다릅니다.");
    }
    if (options.verifyTrustedChangesets) {
      const { config } = await releaseControlAt(repositoryPath, plan.controlSha);
      await assertTrustedChangesetsReleasePlan(repositoryPath, plan, [], config);
    }
    return [];
  }

  const [basePackages, plannedPackages, state] = await Promise.all([
    packageManifestsAt(repositoryPath, plan.baseSha),
    packageManifestsAt(repositoryPath, plannedRef),
    releaseControlAt(repositoryPath, plan.controlSha),
  ]);
  const releases: VersionRelease[] = [];
  const changedPackagePaths = plan.files.filter(isPackageJsonPath);
  for (const path of changedPackagePaths) {
    const base = [...basePackages.values()].find((item) => item.path === path);
    const proposed = [...plannedPackages.values()].find((item) => item.path === path);
    if (!base || !proposed || base.name !== proposed.name) {
      throw new Error(`Version plan은 package manifest를 추가·삭제·rename할 수 없습니다: ${path}`);
    }
    assertSameJson(
      withoutVersionFields(proposed.value),
      withoutVersionFields(base.value),
      `${path} non-version fields`,
    );
    if (base.version !== proposed.version) {
      if (path === "package.json" || proposed.value.private === true) {
        throw new Error(`Version plan은 root/private package version을 바꿀 수 없습니다: ${path}`);
      }
      if (compareSemver(proposed.version, base.version) <= 0) {
        throw new Error(`${base.name} version이 단조 증가하지 않습니다.`);
      }
      releases.push({ name: base.name, from: base.version, to: proposed.version });
    }
  }
  if (releases.length === 0)
    throw new Error("Version plan에 실제 package version 증가가 없습니다.");

  const releaseNames = new Set(releases.map((release) => release.name));
  for (const path of changedPackagePaths) {
    const base = [...basePackages.values()].find((item) => item.path === path);
    const proposed = [...plannedPackages.values()].find((item) => item.path === path);
    if (!base || !proposed) continue;
    for (const field of dependencyFields) {
      const before = dependencyMap(base.value, field);
      const after = dependencyMap(proposed.value, field);
      for (const name of new Set([...Object.keys(before), ...Object.keys(after)])) {
        if (before[name] === after[name]) continue;
        const baseTarget = basePackages.get(name);
        const target = plannedPackages.get(name);
        if (
          !baseTarget ||
          !target ||
          !releaseNames.has(name) ||
          !isExactWorkspaceDependencyUpdate(before[name], after[name], target.version)
        ) {
          throw new Error(
            `${path}의 ${field}.${name} 변경이 같은 plan의 workspace version 증가에 결속되지 않았습니다.`,
          );
        }
      }
    }
  }

  await assertRootageGeneratedVersionData(
    repositoryPath,
    plan,
    plannedRef,
    basePackages,
    plannedPackages,
    releaseNames,
  );

  await assertBunLockMatchesManifests(
    repositoryPath,
    plan,
    plannedRef,
    changedPackagePaths,
    plannedPackages,
  );

  for (const path of plan.files.filter((file) => file.endsWith("/CHANGELOG.md"))) {
    const manifestPath = `${path.slice(0, -"CHANGELOG.md".length)}package.json`;
    const manifest = [...plannedPackages.values()].find((item) => item.path === manifestPath);
    if (!manifest || !releaseNames.has(manifest.name)) {
      throw new Error(`CHANGELOG 변경이 같은 plan의 version 증가와 결속되지 않았습니다: ${path}`);
    }
  }
  await assertVersionPreState(repositoryPath, plan, plannedRef);
  const marker: ReleaseMarker = { schemaVersion: 1, type: "version", lane: plan.lane };
  assertLanePullAllowed({
    lane: plan.lane,
    marker,
    files: plan.files,
    control: state.control,
    config: state.config,
  });
  const sortedReleases = releases.sort((left, right) => left.name.localeCompare(right.name));
  if (options.verifyTrustedChangesets) {
    await assertTrustedChangesetsReleasePlan(repositoryPath, plan, sortedReleases, state.config);
  }
  return sortedReleases;
}

export async function verifyLaneWritePlanTree(
  repositoryPath: string,
  plan: LaneWritePlan,
  plannedRef: string,
  options: VersionTreeOptions = {},
): Promise<VersionRelease[]> {
  const filesResult = await git(repositoryPath, [
    "diff",
    "--name-only",
    plan.baseSha,
    plannedRef,
    "--",
  ]);
  const files = filesResult.stdout ? filesResult.stdout.split("\n").sort() : [];
  assertSameJson(files, plan.files, `${plan.kind} plan changed files`);
  const treeSha = (await git(repositoryPath, ["rev-parse", `${plannedRef}^{tree}`])).stdout;
  if (treeSha !== plan.treeSha)
    throw new Error(`${plan.kind} plan tree SHA가 artifact와 다릅니다.`);
  return assertVersionTree(repositoryPath, plan, plannedRef, options);
}

export async function verifyGeneratedLaneWritePlan(
  repositoryPath: string,
  marker: ReleaseMarker,
  baseSha: string,
  headSha: string,
): Promise<VersionRelease[]> {
  if (marker.type !== "version") {
    throw new Error(`lane write verifier가 ${marker.type} marker를 처리할 수 없습니다.`);
  }
  if (
    !gitShaPattern.test(baseSha) ||
    !gitShaPattern.test(headSha) ||
    marker.expectedHeadSha !== headSha ||
    !marker.controlSha ||
    !gitShaPattern.test(marker.controlSha)
  ) {
    throw new Error("generated lane write marker/base/head/control SHA 결속이 올바르지 않습니다.");
  }
  const [currentLane, commit, tree, filesResult, patchResult] = await Promise.all([
    git(repositoryPath, ["rev-parse", `refs/remotes/origin/${marker.lane}`]),
    git(repositoryPath, ["rev-list", "--parents", "-n", "1", headSha]),
    git(repositoryPath, ["rev-parse", `${headSha}^{tree}`]),
    git(repositoryPath, ["diff", "--name-only", baseSha, headSha, "--"]),
    git(
      repositoryPath,
      ["diff", "--binary", "--full-index", "--no-ext-diff", baseSha, headSha, "--"],
      { trimOutput: false },
    ),
  ]);
  const parents = commit.stdout.split(/\s+/);
  if (currentLane.stdout !== baseSha || parents.length !== 2 || parents[1] !== baseSha) {
    throw new Error("generated lane write head가 current exact lane base의 단일 자식이 아닙니다.");
  }
  const files = filesResult.stdout ? [...new Set(filesResult.stdout.split("\n"))].sort() : [];
  const plan = parseLaneWritePlan({
    schemaVersion: 1,
    kind: marker.type,
    lane: marker.lane,
    baseSha,
    controlSha: marker.controlSha,
    treeSha: tree.stdout,
    patchSha256: sha256(patchResult.stdout),
    files,
  });
  return verifyLaneWritePlanTree(repositoryPath, plan, headSha, {
    verifyTrustedChangesets: true,
  });
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

async function createPlan(artifactPath: string): Promise<LaneWritePlan> {
  const repositoryPath = process.cwd();
  const lane = parseLane(requiredEnvironment("RELEASE_PLAN_LANE"));
  const baseSha = requiredEnvironment("RELEASE_PLAN_BASE_SHA");
  const controlSha = requiredEnvironment("RELEASE_PLAN_CONTROL_SHA");
  if (!gitShaPattern.test(baseSha) || !gitShaPattern.test(controlSha)) {
    throw new Error("planner base/control SHA가 올바르지 않습니다.");
  }
  if ((await git(repositoryPath, ["rev-parse", "HEAD"])).stdout !== baseSha) {
    throw new Error("planner checkout이 exact lane base SHA와 다릅니다.");
  }
  if ((await git(repositoryPath, ["rev-parse", "origin/dev"])).stdout !== controlSha) {
    throw new Error("planner control SHA가 fetched origin/dev와 다릅니다.");
  }

  await git(repositoryPath, ["add", "-A"]);
  const filesOutput = await git(repositoryPath, ["diff", "--cached", "--name-only", baseSha, "--"]);
  const files = filesOutput.stdout ? [...new Set(filesOutput.stdout.split("\n"))].sort() : [];
  const patch = (
    await git(
      repositoryPath,
      ["diff", "--cached", "--binary", "--full-index", "--no-ext-diff", baseSha, "--"],
      { trimOutput: false },
    )
  ).stdout;
  const treeSha = (await git(repositoryPath, ["write-tree"])).stdout;
  const plan: LaneWritePlan = {
    schemaVersion: 1,
    kind: "version",
    lane,
    baseSha,
    controlSha,
    treeSha,
    patchSha256: sha256(patch),
    files,
  };
  await verifyLaneWritePlanTree(repositoryPath, plan, treeSha);
  await mkdir(artifactPath, { recursive: true });
  await Promise.all([
    writeFile(join(artifactPath, "plan.json"), `${JSON.stringify(plan, null, 2)}\n`),
    writeFile(join(artifactPath, "plan.patch"), patch),
  ]);
  return plan;
}

async function loadArtifact(artifactPath: string): Promise<{ plan: LaneWritePlan; patch: string }> {
  const planPath = join(artifactPath, "plan.json");
  const patchPath = join(artifactPath, "plan.patch");
  const [planStat, patchStat] = await Promise.all([lstat(planPath), lstat(patchPath)]);
  if (
    !planStat.isFile() ||
    planStat.isSymbolicLink() ||
    planStat.size > maxPlanBytes ||
    !patchStat.isFile() ||
    patchStat.isSymbolicLink() ||
    patchStat.size > maxPatchBytes
  ) {
    throw new Error("release plan patch가 없거나 허용 크기를 초과했습니다.");
  }
  const [rawPlan, patch] = await Promise.all([
    readFile(planPath, "utf8"),
    readFile(patchPath, "utf8"),
  ]);
  const plan = parseLaneWritePlan(JSON.parse(rawPlan) as unknown);
  if (sha256(patch) !== plan.patchSha256) {
    throw new Error("release plan patch SHA-256이 plan.json과 다릅니다.");
  }
  return { plan, patch };
}

function authenticatedEnvironment(token: string): Record<string, string | undefined> {
  const authorization = Buffer.from(`x-access-token:${token}`).toString("base64");
  return {
    ...process.env,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${authorization}`,
  };
}

async function currentRemoteBranch(
  repositoryPath: string,
  branch: string,
  environment: Record<string, string | undefined>,
): Promise<string | null> {
  const result = await git(
    repositoryPath,
    ["ls-remote", "--heads", "origin", `refs/heads/${branch}`],
    {
      environment,
    },
  );
  const sha = result.stdout.split(/\s+/)[0];
  return sha && gitShaPattern.test(sha) ? sha : null;
}

async function isRemoteBranchLaneAncestor(
  repositoryPath: string,
  branch: string,
  remoteSha: string | null,
  laneSha: string,
  environment: Record<string, string | undefined>,
): Promise<boolean> {
  if (!remoteSha) return false;
  const reservedRef = "refs/remotes/origin/release-writer-reserved";
  await git(
    repositoryPath,
    ["fetch", "--no-tags", "origin", `+refs/heads/${branch}:${reservedRef}`],
    { environment },
  );
  if ((await git(repositoryPath, ["rev-parse", reservedRef])).stdout !== remoteSha) {
    throw new Error("reserved release branch가 조회와 fetch 사이에 변경됐습니다.");
  }
  return (
    (
      await git(repositoryPath, ["merge-base", "--is-ancestor", remoteSha, laneSha], {
        allowFailure: true,
      })
    ).code === 0
  );
}

async function fetchTrustedRefs(
  repositoryPath: string,
  plan: LaneWritePlan,
  environment: Record<string, string | undefined>,
): Promise<void> {
  const refspecs = trustedReleaseRefspecs(plan.lane);
  await git(repositoryPath, ["fetch", "--no-tags", "origin", ...refspecs], {
    environment,
  });
  const [checkoutSha, devSha, laneSha] = await Promise.all([
    git(repositoryPath, ["rev-parse", "HEAD"]),
    git(repositoryPath, ["rev-parse", "origin/dev"]),
    git(repositoryPath, ["rev-parse", `origin/${plan.lane}`]),
  ]);
  if (
    checkoutSha.stdout !== plan.controlSha ||
    devSha.stdout !== plan.controlSha ||
    laneSha.stdout !== plan.baseSha
  ) {
    throw new Error(
      "writer checkout 또는 release plan이 current exact dev/lane SHA에서 stale합니다.",
    );
  }
}

export function trustedReleaseRefspecs(lane: LaneName): string[] {
  return [
    ...new Set([
      "+refs/heads/dev:refs/remotes/origin/dev",
      `+refs/heads/${lane}:refs/remotes/origin/${lane}`,
    ]),
  ];
}

async function dispatchValidation(
  repository: string,
  token: string,
  headRef: string,
  headSha: string,
): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/release-pr-validation.yml/dispatches`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({ ref: "dev", inputs: { head_ref: headRef, head_sha: headSha } }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `release validation dispatch 실패: ${response.status} ${await response.text()}`,
    );
  }
}

function markerBody(plan: LaneWritePlan, headSha: string): string {
  const marker: ReleaseMarker = {
    schemaVersion: 1,
    type: "version",
    lane: plan.lane,
    expectedHeadSha: headSha,
    controlSha: plan.controlSha,
  };
  return encodeMarker(marker);
}

function versionPullBody(plan: LaneWritePlan, headSha: string, releases: VersionRelease[]): string {
  const rows = releases.map(
    (release) => `| \`${release.name}\` | \`${release.from}\` | \`${release.to}\` |`,
  );
  return [
    markerBody(plan, headSha),
    "",
    "## Version Packages",
    "",
    `Read-only plan from \`${plan.lane}@${plan.baseSha}\`; trusted control \`dev@${plan.controlSha}\`.`,
    "",
    "| Package | From | To |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
}

async function openPulls(client: GitHubClient, lane: LaneName): Promise<GitHubPullRequest[]> {
  return client.paginate<GitHubPullRequest>(
    `/repos/${client.repository}/pulls?state=open&base=${lane}&sort=created&direction=asc`,
  );
}

function exactBranchPulls(
  pulls: GitHubPullRequest[],
  repository: string,
  lane: LaneName,
  branch: string,
): GitHubPullRequest[] {
  return pulls.filter(
    (pull) =>
      pull.head.ref === branch &&
      pull.head.repo?.full_name === repository &&
      pull.base.ref === lane &&
      pull.base.repo.full_name === repository,
  );
}

export function assertReservedBranchPullState(
  plan: LaneWritePlan,
  branch: string,
  remoteSha: string | null,
  pulls: GitHubPullRequest[],
  repository: string,
  expectedHeadSha: string,
  remoteIsLaneAncestor: boolean,
): number | null {
  const exact = exactBranchPulls(pulls, repository, plan.lane, branch);
  const colliding = pulls.filter(
    (pull) => pull.head.ref === branch && pull.base.ref === plan.lane && !exact.includes(pull),
  );
  if (colliding.length > 0) {
    throw new Error("reserved release branch의 PR repository identity가 올바르지 않습니다.");
  }
  if (exact.length > 1) throw new Error("reserved release branch의 open PR이 둘 이상입니다.");
  if (!remoteSha) {
    if (exact.length > 0)
      throw new Error("remote branch 없이 reserved release PR이 열려 있습니다.");
  } else {
    const pull = exact[0];
    const recoverableWithoutPull = remoteSha === expectedHeadSha || remoteIsLaneAncestor;
    if (!pull && !recoverableWithoutPull) {
      throw new Error(
        "reserved release branch에 trusted open PR 또는 안전한 retry 상태가 없습니다.",
      );
    }
    if (pull) {
      const trusted = trustedVersionMarker(
        {
          author: pull.user.login,
          body: pull.body ?? "",
          baseRef: pull.base.ref,
          headRef: pull.head.ref,
          baseRepository: pull.base.repo.full_name,
          headRepository: pull.head.repo?.full_name ?? "",
        },
        remoteSha,
      );
      const repairableStaleMarker =
        remoteSha === expectedHeadSha &&
        pull.user.login === "github-actions[bot]" &&
        pull.head.sha === remoteSha;
      if ((!trusted && !repairableStaleMarker) || pull.head.sha !== remoteSha) {
        throw new Error("reserved Version branch의 PR identity/head가 trusted marker와 다릅니다.");
      }
    }
  }
  return exact[0]?.number ?? null;
}

async function createOrUpdatePull(
  client: GitHubClient,
  plan: LaneWritePlan,
  branch: string,
  headSha: string,
  releases: VersionRelease[],
  expectedPullNumber: number | null,
): Promise<number> {
  const pulls = await openPulls(client, plan.lane);
  const exact = exactBranchPulls(pulls, client.repository, plan.lane, branch);
  const title = "release: version packages";
  const body = versionPullBody(plan, headSha, releases);

  if (exact.length > 1) {
    throw new Error("동일한 Version Packages branch의 open PR이 둘 이상입니다.");
  }
  if (
    exact[0] &&
    (exact[0].user.login !== "github-actions[bot]" || exact[0].head.sha !== headSha)
  ) {
    throw new Error("Version Packages branch의 기존 PR author/head가 expected state와 다릅니다.");
  }
  if ((exact[0]?.number ?? null) !== expectedPullNumber) {
    throw new Error("reserved release branch의 open PR identity가 push 사이에 변경됐습니다.");
  }

  let number: number;
  if (exact[0]) {
    const updated = await client.request<GitHubPullRequest>(
      `/repos/${client.repository}/pulls/${exact[0].number}`,
      { method: "PATCH", body: JSON.stringify({ title, body }) },
    );
    number = updated.number;
  } else {
    const created = await client.request<GitHubPullRequest>(`/repos/${client.repository}/pulls`, {
      method: "POST",
      body: JSON.stringify({ title, body, head: branch, base: plan.lane }),
    });
    number = created.number;
  }
  const label = "release:version";
  await client.ensureLabel(label, "8250df", "Version Packages PR generated by release automation");
  await client.request(`/repos/${client.repository}/issues/${number}/labels`, {
    method: "POST",
    body: JSON.stringify({ labels: [label] }),
  });
  return number;
}

export async function createDeterministicPlanCommit(
  repositoryPath: string,
  plan: LaneWritePlan,
): Promise<string> {
  const message = "chore(release): version packages";
  const environment: Record<string, string | undefined> = {
    ...process.env,
    GH_TOKEN: undefined,
    GITHUB_TOKEN: undefined,
    GIT_AUTHOR_NAME: "github-actions[bot]",
    GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
    GIT_AUTHOR_DATE: "2000-01-01T00:00:00Z",
    GIT_COMMITTER_NAME: "github-actions[bot]",
    GIT_COMMITTER_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
    GIT_COMMITTER_DATE: "2000-01-01T00:00:00Z",
  };
  const headSha = (
    await git(repositoryPath, ["commit-tree", plan.treeSha, "-p", plan.baseSha, "-m", message], {
      environment,
    })
  ).stdout;
  const parents = (
    await git(repositoryPath, ["rev-list", "--parents", "-n", "1", headSha])
  ).stdout.split(/\s+/);
  if (parents.length !== 2 || parents[1] !== plan.baseSha) {
    throw new Error("writer commit이 exact lane base의 단일 자식이 아닙니다.");
  }
  return headSha;
}

async function prepareCommit(
  repositoryPath: string,
  plan: LaneWritePlan,
  patch: string,
): Promise<{ headSha: string; releases: VersionRelease[] }> {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), `seed-release-${plan.kind}-write-`));
  let worktreeAdded = false;
  try {
    await git(repositoryPath, ["worktree", "add", "--detach", temporaryDirectory, plan.baseSha]);
    worktreeAdded = true;
    const patchPath = join(temporaryDirectory, "release-plan.patch");
    await writeFile(patchPath, patch);
    if (plan.files.length > 0) {
      await git(temporaryDirectory, [
        "apply",
        "--index",
        "--binary",
        "--whitespace=nowarn",
        patchPath,
      ]);
    }
    const treeSha = (await git(temporaryDirectory, ["write-tree"])).stdout;
    if (treeSha !== plan.treeSha)
      throw new Error("적용한 release plan tree가 artifact tree와 다릅니다.");
    const releases = await verifyLaneWritePlanTree(repositoryPath, plan, treeSha, {
      verifyTrustedChangesets: true,
    });
    if (plan.files.length === 0) return { headSha: plan.baseSha, releases };
    const headSha = await createDeterministicPlanCommit(repositoryPath, plan);
    return { headSha, releases };
  } finally {
    if (worktreeAdded) {
      await git(repositoryPath, ["worktree", "remove", "--force", temporaryDirectory], {
        allowFailure: true,
      });
    }
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

async function assertWritePlanEnvironment(plan: LaneWritePlan): Promise<void> {
  const lane = parseLane(requiredEnvironment("RELEASE_PLAN_LANE"));
  const baseSha = requiredEnvironment("RELEASE_PLAN_BASE_SHA");
  const controlSha = requiredEnvironment("RELEASE_PLAN_CONTROL_SHA");
  if (!gitShaPattern.test(baseSha) || !gitShaPattern.test(controlSha)) {
    throw new Error("trusted writer base/control SHA가 올바르지 않습니다.");
  }
  assertLaneWritePlanIdentity(plan, { kind: "version", lane, baseSha, controlSha });
}

async function writePlan(artifactPath: string): Promise<void> {
  const repositoryPath = process.cwd();
  const token = requiredEnvironment("GH_TOKEN");
  const repository = requiredEnvironment("GITHUB_REPOSITORY");
  const { plan, patch } = await loadArtifact(artifactPath);
  await assertWritePlanEnvironment(plan);
  const environment = authenticatedEnvironment(token);
  await fetchTrustedRefs(repositoryPath, plan, environment);
  const { headSha, releases } = await prepareCommit(repositoryPath, plan, patch);
  if (plan.files.length === 0) {
    console.log(`${plan.lane}에는 생성할 Version Packages 변경이 없습니다.`);
    if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, "changed=false\n");
    return;
  }

  await fetchTrustedRefs(repositoryPath, plan, environment);
  const branch = `changeset-release/${plan.lane}`;
  const remoteSha = await currentRemoteBranch(repositoryPath, branch, environment);
  const client = new GitHubClient(repository, token);
  const [reservedPulls, remoteIsLaneAncestor] = await Promise.all([
    openPulls(client, plan.lane),
    isRemoteBranchLaneAncestor(repositoryPath, branch, remoteSha, plan.baseSha, environment),
  ]);
  const expectedPullNumber = assertReservedBranchPullState(
    plan,
    branch,
    remoteSha,
    reservedPulls,
    repository,
    headSha,
    remoteIsLaneAncestor,
  );
  if (remoteSha !== headSha) {
    const lease = remoteSha
      ? `--force-with-lease=refs/heads/${branch}:${remoteSha}`
      : `--force-with-lease=refs/heads/${branch}:`;
    await git(repositoryPath, ["push", lease, "origin", `${headSha}:refs/heads/${branch}`], {
      environment,
    });
  }

  const [remoteBranch, currentDev, currentLane] = await Promise.all([
    client.request<{ commit: { sha: string } }>(
      `/repos/${repository}/branches/${encodeURIComponent(branch)}`,
    ),
    client.request<{ commit: { sha: string } }>(`/repos/${repository}/branches/dev`),
    client.request<{ commit: { sha: string } }>(`/repos/${repository}/branches/${plan.lane}`),
  ]);
  if (
    remoteBranch.commit.sha !== headSha ||
    currentDev.commit.sha !== plan.controlSha ||
    currentLane.commit.sha !== plan.baseSha
  ) {
    throw new Error("PR 생성 직전 remote branch/dev/lane exact SHA가 plan에서 변경됐습니다.");
  }
  const pullNumber = await createOrUpdatePull(
    client,
    plan,
    branch,
    headSha,
    releases,
    expectedPullNumber,
  );
  await dispatchValidation(repository, token, branch, headSha);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `changed=true\nlane=${plan.lane}\nheadSha=${headSha}\npr=${pullNumber}\n`,
    );
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      [
        "## Version Packages writer",
        "",
        `- lane: \`${plan.lane}\``,
        `- exact base: \`${plan.baseSha}\``,
        `- exact head: \`${headSha}\``,
        `- trusted control: \`${plan.controlSha}\``,
        `- PR: #${pullNumber}`,
        "",
      ].join("\n"),
    );
  }
}

async function main(): Promise<void> {
  const [command, artifactPath] = Bun.argv.slice(2);
  if (!artifactPath) throw new Error("release plan artifact 경로가 필요합니다.");
  if (command === "create-version") {
    await createPlan(artifactPath);
    return;
  }
  if (command === "write-version") {
    await writePlan(artifactPath);
    return;
  }
  throw new Error(`지원하지 않는 lane write plan command입니다: ${command ?? "없음"}`);
}

if (import.meta.main) await main();
