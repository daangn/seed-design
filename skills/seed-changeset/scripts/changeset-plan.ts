import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { promisify } from "node:util";

type DependencySection = "dependencies" | "optionalDependencies" | "peerDependencies";
type Bump = "major" | "minor" | "patch";
type ExclusionReason = "archive" | "private";
type ReleaseBaseRef = "origin/dev" | "origin/minor" | "origin/major";

interface RootManifest {
  workspaces?: string[];
}

interface PackageManifest {
  name?: string;
  version?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface WorkspacePackage {
  name: string;
  version: string;
  directory: string;
  private: boolean;
  archived: boolean;
  dependencyRanges: Array<{
    package: string;
    section: DependencySection;
    range: string;
  }>;
}

interface ExistingChangeset {
  path: string;
  releases: Array<{ package: string; bump: Bump }>;
}

export interface ChangesetPlan {
  baseBranch: string;
  baseRef: string;
  changedPaths: string[];
  candidates: Array<{
    package: string;
    directory: string;
    version: string;
    coveredBy: string[];
  }>;
  excluded: Array<{
    package: string;
    directory: string;
    reasons: ExclusionReason[];
  }>;
  existingChangesets: ExistingChangeset[];
  reverseDependencies: Array<{
    dependency: string;
    dependent: string;
    section: DependencySection;
    range: string;
  }>;
  versionChangesReviewCandidates: Array<{
    dependency: string;
    dependent: string;
    range: string;
    reviewIn: "Version Changes PR";
  }>;
}

interface BuildChangesetPlanOptions {
  root?: string;
  baseRef?: ReleaseBaseRef;
  changedPaths?: string[];
}

const execFileAsync = promisify(execFile);
const DEPENDENCY_SECTIONS = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
] as const satisfies readonly DependencySection[];

/** JSON 파일을 읽고 구문 오류를 경로와 함께 보고합니다. */
async function readJson<T>(path: string): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${path}을 읽지 못했습니다: ${detail}`);
  }
}

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

/** 루트 기준 경로를 Git과 JSON 출력에 맞는 POSIX 형식으로 정규화합니다. */
function repositoryPath(root: string, path: string): string {
  return relative(root, path).replaceAll("\\", "/");
}

/** 한 단계 `*`를 포함한 workspace 패턴을 실제 디렉터리로 펼칩니다. */
async function expandWorkspacePattern(root: string, pattern: string): Promise<string[]> {
  let directories = [root];
  for (const segment of pattern.replaceAll("\\", "/").split("/").filter(Boolean)) {
    if (segment !== "*") {
      directories = directories.map((directory) => join(directory, segment));
      continue;
    }

    const expanded = await Promise.all(
      directories.map(async (directory) => {
        try {
          return (await readdir(directory, { withFileTypes: true }))
            .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
            .map((entry) => join(directory, entry.name));
        } catch (error) {
          if (hasErrorCode(error, "ENOENT")) return [];
          const detail = error instanceof Error ? error.message : String(error);
          throw new Error(`${directory} workspace 경로를 읽지 못했습니다: ${detail}`);
        }
      }),
    );
    directories = expanded.flat();
  }
  return directories;
}

/** package.json에서 후보 계산과 역의존 조회에 필요한 정보만 읽습니다. */
async function readWorkspacePackage(
  root: string,
  directory: string,
  archived: boolean,
): Promise<WorkspacePackage | undefined> {
  const manifestPath = join(directory, "package.json");
  let source: string;
  try {
    source = await readFile(manifestPath, "utf8");
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${manifestPath}을 읽지 못했습니다: ${detail}`);
  }
  const manifest = parsePackageManifest(manifestPath, source);
  return workspacePackageFromManifest(repositoryPath(root, directory), archived, manifest);
}

function parsePackageManifest(path: string, source: string): PackageManifest {
  try {
    return JSON.parse(source) as PackageManifest;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${path}을 읽지 못했습니다: ${detail}`);
  }
}

function workspacePackageFromManifest(
  directory: string,
  archived: boolean,
  manifest: PackageManifest,
): WorkspacePackage | undefined {
  if (!manifest.name || !manifest.version) return undefined;
  return {
    name: manifest.name,
    version: manifest.version,
    directory,
    private: manifest.private === true,
    archived,
    dependencyRanges: DEPENDENCY_SECTIONS.flatMap((section) =>
      Object.entries(manifest[section] ?? {}).map(([packageName, range]) => ({
        package: packageName,
        section,
        range,
      })),
    ),
  };
}

/** workspaces 설정의 지원 형식을 확인합니다. */
function workspacePatterns(manifest: RootManifest): string[] {
  if (!Array.isArray(manifest.workspaces)) {
    throw new Error("루트 package.json에서 workspaces 배열을 찾지 못했습니다.");
  }
  return manifest.workspaces;
}

/** 디렉터리 목록에서 유효한 패키지만 읽습니다. */
async function packagesInDirectories(
  root: string,
  directories: string[],
  archived: boolean,
): Promise<WorkspacePackage[]> {
  const packages = await Promise.all(
    directories.map((directory) => readWorkspacePackage(root, directory, archived)),
  );
  return packages.filter((workspacePackage): workspacePackage is WorkspacePackage =>
    Boolean(workspacePackage),
  );
}

/** 루트 workspace와 archive 패키지를 읽고 디렉터리별로 중복을 제거합니다. */
async function readWorkspacePackages(root: string): Promise<WorkspacePackage[]> {
  const rootManifest = await readJson<RootManifest>(join(root, "package.json"));
  const workspaceDirectories = (
    await Promise.all(
      workspacePatterns(rootManifest).map((pattern) => expandWorkspacePattern(root, pattern)),
    )
  ).flat();
  const archiveDirectories = await expandWorkspacePattern(root, "packages/archive/*");
  const [workspacePackages, archivePackages] = await Promise.all([
    packagesInDirectories(root, workspaceDirectories, false),
    packagesInDirectories(root, archiveDirectories, true),
  ]);
  const byDirectory = new Map(
    [...workspacePackages, ...archivePackages].map((workspacePackage) => [
      workspacePackage.directory,
      workspacePackage,
    ]),
  );
  return [...byDirectory.values()].sort((left, right) => left.name.localeCompare(right.name));
}

/** Changeset frontmatter에서 패키지와 bump만 읽습니다. */
function parseChangeset(path: string, source: string): ExistingChangeset | undefined {
  const lines = source.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return undefined;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) return undefined;

  const releases = lines.slice(1, end).flatMap((line) => {
    const match = line.match(/^\s*["']([^"']+)["']\s*:\s*(major|minor|patch)\s*$/);
    return match ? [{ package: match[1], bump: match[2] as Bump }] : [];
  });
  return releases.length > 0 ? { path, releases } : undefined;
}

/** 현재 저장소에 이미 있는 Changeset coverage를 읽습니다. */
async function readExistingChangesets(root: string): Promise<ExistingChangeset[]> {
  const directory = join(root, ".changeset");
  let names: string[];
  try {
    names = await readdir(directory);
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return [];
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${directory}을 읽지 못했습니다: ${detail}`);
  }

  const changesets = await Promise.all(
    names
      .filter((name) => name.endsWith(".md") && name !== "README.md")
      .sort()
      .map(async (name) => {
        const path = `.changeset/${name}`;
        return parseChangeset(path, await readFile(join(directory, name), "utf8"));
      }),
  );
  return changesets.filter((changeset): changeset is ExistingChangeset => Boolean(changeset));
}

/** Git name-status의 rename/copy 양쪽 경로를 보존합니다. */
function nameStatusPathCount(status: string | undefined): number {
  return status && /^[RC]/.test(status) ? 2 : 1;
}

function nameStatusPaths(output: string): string[] {
  const fields = output.split("\0").filter(Boolean);
  const paths: string[] = [];
  for (let index = 0; index < fields.length; ) {
    const pathCount = nameStatusPathCount(fields[index]);
    paths.push(
      ...fields.slice(index + 1, index + 1 + pathCount).map((path) => path.replaceAll("\\", "/")),
    );
    index += pathCount + 1;
  }
  return [...new Set(paths)].sort();
}

async function gitNameStatusPaths(root: string, args: string[]): Promise<string[]> {
  const { stdout } = await execFileAsync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return nameStatusPaths(stdout);
}

async function gitPlainPaths(root: string, args: string[]): Promise<string[]> {
  const { stdout } = await execFileAsync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout
    .split("\0")
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/"));
}

/** 원격 base를 우선하고 로컬 branch를 대안으로 사용합니다. */
async function resolveBaseRef(root: string, baseBranch: string): Promise<string> {
  for (const candidate of [`origin/${baseBranch}`, baseBranch]) {
    try {
      await execFileAsync("git", ["rev-parse", "--verify", "--quiet", `${candidate}^{commit}`], {
        cwd: root,
        encoding: "utf8",
      });
      return candidate;
    } catch {
      // 다음 후보를 확인합니다.
    }
  }
  throw new Error(`Git 기준점을 찾지 못했습니다: origin/${baseBranch}, ${baseBranch}`);
}

/** base 이후 커밋과 index, worktree, untracked 파일을 합칩니다. */
async function changedPathsFromGit(root: string, baseRef: string): Promise<string[]> {
  const groups = await Promise.all([
    gitNameStatusPaths(root, [
      "diff",
      "--name-status",
      "-z",
      "--find-renames",
      `${baseRef}...HEAD`,
    ]),
    gitNameStatusPaths(root, ["diff", "--name-status", "-z", "--find-renames"]),
    gitNameStatusPaths(root, ["diff", "--cached", "--name-status", "-z", "--find-renames"]),
    gitPlainPaths(root, ["ls-files", "--others", "--exclude-standard", "-z"]),
  ]);
  return [...new Set(groups.flat())].sort();
}

/** 변경 경로를 가장 구체적인 패키지 디렉터리에 연결합니다. */
function changedPackages(packages: WorkspacePackage[], changedPaths: string[]): WorkspacePackage[] {
  return packages.filter((workspacePackage) =>
    changedPaths.some((path) => packageContainsPath(workspacePackage, path)),
  );
}

function packageContainsPath(workspacePackage: WorkspacePackage, path: string): boolean {
  return path === workspacePackage.directory || path.startsWith(`${workspacePackage.directory}/`);
}

function isPossibleWorkspacePath(path: string): boolean {
  return /^(?:packages|tools|ecosystem|examples|docs)(?:\/|$)/.test(path);
}

async function readWorkspacePackageAtRef(
  root: string,
  baseRef: string,
  directory: string,
): Promise<WorkspacePackage | undefined> {
  const manifestPath = `${directory}/package.json`;
  let source: string;
  try {
    ({ stdout: source } = await execFileAsync("git", ["show", `${baseRef}:${manifestPath}`], {
      cwd: root,
      encoding: "utf8",
    }));
  } catch {
    return undefined;
  }
  const manifest = parsePackageManifest(`${baseRef}:${manifestPath}`, source);
  return workspacePackageFromManifest(
    directory,
    directory.startsWith("packages/archive/"),
    manifest,
  );
}

async function readDeletedWorkspacePackage(
  root: string,
  baseRef: string,
  directory: string,
): Promise<WorkspacePackage> {
  const found = await readWorkspacePackageAtRef(root, baseRef, directory);
  if (found) return found;
  throw new Error(`${baseRef}에서 삭제된 workspace package 근거를 찾지 못했습니다: ${directory}`);
}

function isUnmatchedPackageManifest(path: string, currentPackages: WorkspacePackage[]): boolean {
  if (!isPossibleWorkspacePath(path)) return false;
  if (!path.endsWith("/package.json")) return false;
  return !currentPackages.some((workspacePackage) => packageContainsPath(workspacePackage, path));
}

async function deletedWorkspacePackages(
  root: string,
  baseRef: string,
  currentPackages: WorkspacePackage[],
  changedPaths: string[],
): Promise<WorkspacePackage[]> {
  const directories = new Set(
    changedPaths
      .filter((path) => isUnmatchedPackageManifest(path, currentPackages))
      .map((path) => dirname(path).replaceAll("\\", "/")),
  );
  const found = await Promise.all(
    [...directories].map((directory) => readDeletedWorkspacePackage(root, baseRef, directory)),
  );
  return found;
}

interface ChangesetPlanContext {
  root: string;
  baseBranch: string;
  baseRef: string;
  changedPaths: string[];
}

/** CLI 옵션과 저장소 설정에서 계획의 Git 기준과 변경 경로를 정합니다. */
async function changesetPlanContext(
  options: BuildChangesetPlanOptions,
): Promise<ChangesetPlanContext> {
  const root = resolve(options.root ?? process.cwd());
  const config = await readJson<{ baseBranch?: string }>(join(root, ".changeset/config.json"));
  const baseBranch = config.baseBranch ?? "dev";
  const baseRef = options.baseRef ?? (await resolveBaseRef(root, baseBranch));
  const changedPaths = options.changedPaths
    ? [...new Set(options.changedPaths.map((path) => path.replaceAll("\\", "/")))].sort()
    : await changedPathsFromGit(root, baseRef);
  return { root, baseBranch, baseRef, changedPaths };
}

/** 기존 Changeset이 포함한 패키지를 파일 경로에 연결합니다. */
function changesetCoverage(existingChangesets: ExistingChangeset[]): Map<string, string[]> {
  const coverageByPackage = new Map<string, string[]>();
  for (const changeset of existingChangesets) {
    for (const release of changeset.releases) {
      const paths = coverageByPackage.get(release.package) ?? [];
      paths.push(changeset.path);
      coverageByPackage.set(release.package, paths);
    }
  }
  return coverageByPackage;
}

/** 공개 후보를 의존하는 공개 workspace 패키지를 찾습니다. */
function reverseDependenciesForCandidates(
  packages: WorkspacePackage[],
  releaseCandidates: WorkspacePackage[],
): ChangesetPlan["reverseDependencies"] {
  const candidateNames = new Set(
    releaseCandidates.map((workspacePackage) => workspacePackage.name),
  );
  return packages
    .filter((workspacePackage) => !workspacePackage.private && !workspacePackage.archived)
    .flatMap((dependent) =>
      dependent.dependencyRanges
        .filter((dependency) => candidateNames.has(dependency.package))
        .map((dependency) => ({
          dependency: dependency.package,
          dependent: dependent.name,
          section: dependency.section,
          range: dependency.range,
        })),
    )
    .sort((left, right) =>
      `${left.dependency}:${left.dependent}:${left.section}`.localeCompare(
        `${right.dependency}:${right.dependent}:${right.section}`,
      ),
    );
}

/** 공개 변경 패키지를 JSON 후보 형식으로 바꿉니다. */
function releaseCandidateResults(
  releaseCandidates: WorkspacePackage[],
  coverageByPackage: Map<string, string[]>,
): ChangesetPlan["candidates"] {
  return releaseCandidates.map((workspacePackage) => ({
    package: workspacePackage.name,
    directory: workspacePackage.directory,
    version: workspacePackage.version,
    coveredBy: coverageByPackage.get(workspacePackage.name) ?? [],
  }));
}

/** private와 archive 변경을 제외 사유와 함께 JSON 형식으로 바꿉니다. */
function excludedPackageResults(changed: WorkspacePackage[]): ChangesetPlan["excluded"] {
  return changed
    .filter((workspacePackage) => workspacePackage.private || workspacePackage.archived)
    .map((workspacePackage) => ({
      package: workspacePackage.name,
      directory: workspacePackage.directory,
      reasons: [
        ...(workspacePackage.archived ? (["archive"] as const) : []),
        ...(workspacePackage.private ? (["private"] as const) : []),
      ],
    }));
}

function mergeWorkspacePackages(
  current: WorkspacePackage[],
  deleted: WorkspacePackage[],
): WorkspacePackage[] {
  const byName = new Map(
    [...deleted, ...current].map((workspacePackage) => [
      workspacePackage.name,
      workspacePackage,
    ]),
  );
  return [...byName.values()].sort((left, right) => left.name.localeCompare(right.name));
}

/** 현재 PR에서는 수정하지 않고 Version Changes PR에서 확인할 peer 범위를 찾습니다. */
function versionChangesReviewCandidates(
  reverseDependencies: ChangesetPlan["reverseDependencies"],
): ChangesetPlan["versionChangesReviewCandidates"] {
  return reverseDependencies
    .filter((dependency) => dependency.section === "peerDependencies")
    .map(({ dependency, dependent, range }) => ({
      dependency,
      dependent,
      range,
      reviewIn: "Version Changes PR",
    }));
}

/** 현재 diff와 workspace metadata로 읽기 전용 Changeset 계획을 만듭니다. */
export async function buildChangesetPlan(
  options: BuildChangesetPlanOptions = {},
): Promise<ChangesetPlan> {
  const { root, baseBranch, baseRef, changedPaths } = await changesetPlanContext(options);
  const [currentPackages, existingChangesets] = await Promise.all([
    readWorkspacePackages(root),
    readExistingChangesets(root),
  ]);
  const deletedPackages = await deletedWorkspacePackages(
    root,
    baseRef,
    currentPackages,
    changedPaths,
  );
  const packages = mergeWorkspacePackages(currentPackages, deletedPackages);
  const changed = changedPackages(packages, changedPaths);
  const releaseCandidates = changed.filter(
    (workspacePackage) => !workspacePackage.private && !workspacePackage.archived,
  );
  const coverageByPackage = changesetCoverage(existingChangesets);
  const reverseDependencies = reverseDependenciesForCandidates(packages, releaseCandidates);

  return {
    baseBranch,
    baseRef,
    changedPaths,
    candidates: releaseCandidateResults(releaseCandidates, coverageByPackage),
    excluded: excludedPackageResults(changed),
    existingChangesets,
    reverseDependencies,
    versionChangesReviewCandidates: versionChangesReviewCandidates(reverseDependencies),
  };
}

/** 지원하는 CLI 옵션을 계획 옵션에 반영합니다. */
function setArgument(options: BuildChangesetPlanOptions, argument: string, value: string): void {
  if (argument === "--root") {
    options.root = value;
    return;
  }
  if (argument === "--base-ref") {
    options.baseRef = parseBaseRef(value);
    return;
  }
  throw new Error(`알 수 없는 인자입니다: ${argument}`);
}

function parseBaseRef(value: string): ReleaseBaseRef {
  if (["origin/dev", "origin/minor", "origin/major"].includes(value)) {
    return value as ReleaseBaseRef;
  }
  throw new Error(`지원하지 않는 기준 ref입니다: ${value}`);
}

/** CLI에서 저장소 루트와 명시적 base ref만 받습니다. */
function parseArguments(args: string[]): BuildChangesetPlanOptions {
  const options: BuildChangesetPlanOptions = {};
  for (let index = 0; index < args.length; index += 2) {
    const argument = args[index];
    const value = args[index + 1];
    if (!argument || !value) {
      throw new Error(`알 수 없는 인자입니다: ${argument}`);
    }
    setArgument(options, argument, value);
  }
  return options;
}

if (import.meta.main) {
  try {
    const result = await buildChangesetPlan(parseArguments(process.argv.slice(2)));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
