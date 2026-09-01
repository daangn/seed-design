import { readdir, readFile, realpath, stat } from "node:fs/promises";
import type { Dirent } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

export type ReleaseBump = "patch" | "minor" | "major";
export type ReleaseBranch = "dev" | "minor" | "major";
export type PlannedReleaseBranch = ReleaseBranch | "unknown";
export type ReleaseBaseRef = `origin/${ReleaseBranch}`;
export type ConfirmedLane = "minor" | "major" | "none";

export interface LaneEvidence {
  minor: string[];
  major: string[];
}

export interface BranchEvidence {
  complete: boolean;
  baseRef?: ReleaseBaseRef;
  laneCandidates: LaneEvidence;
  confirmedLane?: ConfirmedLane;
  errors: string[];
}

export interface ImpactedPackage {
  name: string;
  path: string;
  private: boolean | "unknown";
  evidence: string[];
}

export interface VerificationStep {
  id: string;
  kind: "command" | "skill" | "manual";
  command?: string;
  skill?: string;
  action?: string;
  reason: string;
  evidence: string[];
  source: string;
}

export interface BranchPlan {
  targetBranch: PlannedReleaseBranch;
  targetRef: `origin/${ReleaseBranch}` | "unknown";
  prBase: PlannedReleaseBranch;
  reason: string;
  evidence: string[];
}

export interface ChangePlanResult {
  paths: {
    changed: string[];
    planned: string[];
  };
  impact: {
    packages: ImpactedPackage[];
    surfaces: Array<{ kind: SurfaceKind; paths: string[] }>;
    components: string[];
    platforms: Platform[];
  };
  verification: VerificationStep[];
  branchEvidence: BranchEvidence;
  branch: BranchPlan;
  confirmedBumps: ReleaseBump[];
  releaseDecision: "unconfirmed" | "confirmed-none";
  uncertainties: string[];
  summary: string;
}

export interface ChangePlanInput {
  root: string;
  changedPaths: string[];
  plannedPaths?: string[];
  confirmedBumps?: ReleaseBump[];
  releaseDecision?: "confirmed-none";
  changesetPaths?: string[];
  baseRef?: ReleaseBaseRef;
  laneCandidates?: LaneEvidence;
  confirmedLane?: ConfirmedLane;
  branchEvidenceComplete?: boolean;
  branchEvidenceErrors?: string[];
  uncertainties?: string[];
}

type SurfaceKind =
  | "source"
  | "generated"
  | "implementation"
  | "docs"
  | "registry"
  | "examples"
  | "tests"
  | "release"
  | "tooling";
type Platform = "react" | "lynx" | "shared" | "docs" | "tooling";

const REPOSITORY_NAME = "@seed-design/project";
const BUMP_ORDER: Record<ReleaseBump, number> = { patch: 0, minor: 1, major: 2 };
const BUMP_BRANCH: Record<ReleaseBump, ReleaseBranch> = {
  patch: "dev",
  minor: "minor",
  major: "major",
};
const IGNORED_COMPONENT_IDS = new Set(["index", "meta", "schema"]);
const MANUAL_SOURCE_PATHS = new Set([
  "packages/lynx-css/recipes/progress-circle.css",
  "packages/lynx-css/recipes/progress-circle.mjs",
  "packages/lynx-css/recipes/progress-circle.d.ts",
]);
const SURFACE_RULES: Array<{ kind: SurfaceKind; pattern: RegExp }> = [
  {
    kind: "generated",
    pattern:
      /^(?:packages\/rootage\/(?:__generated__\/|components\/schema\.json$)|packages\/(?:lynx-)?qvism-preset\/src\/(?:vars\/|token\.css$|tokens\.ts$)|packages\/css\/(?:recipes\/|vars\/|[^/]+\.css$)|packages\/lynx-css\/(?:recipes\/|vars\/|[^/]+\.css$)|docs\/public\/(?:__registry__\/|__docs__\/index\.json$)|docs\/app\/_llms\/rules\/component-grid-manifest\.ts$)|(?:^|\/)(?:dist|node_modules)(?:\/|$)/,
  },
  { kind: "release", pattern: /^(?:\.changeset\/|bun\.lock$)/ },
  { kind: "registry", pattern: /^docs\/(?:public\/__registry__|registry)\// },
  { kind: "examples", pattern: /^(?:docs\/examples\/|examples\/)/ },
  {
    kind: "tests",
    pattern: /(?:^|\/)(?:test|tests|__tests__)(?:\/|$)|\.(?:test|spec)\.[^.]+$|\.stories\.[^.]+$/i,
  },
  { kind: "docs", pattern: /^docs\// },
  {
    kind: "source",
    pattern:
      /^(?:packages\/rootage\/(?:[^/]+\.yaml$|(?:components|foundation)\/)|packages\/(?:qvism-preset|lynx-qvism-preset)\/src\/recipes\/|docs\/registry\/)/,
  },
  { kind: "tooling", pattern: /^(?:skills\/|tools\/|scripts\/|\.github\/)/ },
];
const PLATFORM_RULES: Array<{ platform: Platform; pattern: RegExp }> = [
  {
    platform: "react",
    pattern:
      /^(?:packages\/(?:react|react-headless|stackflow|css|qvism-preset)\/|docs\/(?:(?:content|examples|registry)\/react\/|public\/__registry__\/react\/))/,
  },
  {
    platform: "lynx",
    pattern:
      /^(?:packages\/(?:lynx-react|lynx-react-headless|lynx-css|lynx-qvism-preset)\/|docs\/(?:(?:content|examples|registry)\/lynx\/|public\/__registry__\/lynx\/)|examples\/lynx)/,
  },
  { platform: "shared", pattern: /^(?:packages\/rootage\/|ecosystem\/rootage\/)/ },
  { platform: "react", pattern: /^(?:packages\/rootage\/|ecosystem\/rootage\/)/ },
  { platform: "lynx", pattern: /^(?:packages\/rootage\/|ecosystem\/rootage\/)/ },
  { platform: "docs", pattern: /^docs\// },
  { platform: "tooling", pattern: /^(?:skills\/|tools\/|scripts\/|\.github\/)/ },
];
const FOCUSED_VERIFICATION_RULES: Array<{
  id: string;
  pattern: RegExp;
  command: string;
  source: string;
}> = [
  {
    id: "headless-test",
    pattern: /^packages\/react-headless\//,
    command: "bun headless:test",
    source: "package.json#scripts.headless:test",
  },
  {
    id: "react-test",
    pattern: /^packages\/react\//,
    command: "bun react:test",
    source: "package.json#scripts.react:test",
  },
  {
    id: "lynx-test",
    pattern: /^packages\/lynx-react\//,
    command: "bun test:lynx-react",
    source: "package.json#scripts.test:lynx-react",
  },
  {
    id: "cli-test",
    pattern: /^packages\/cli\//,
    command: "bun test packages/cli",
    source: "TECH.md#테스트",
  },
  {
    id: "rootage-test",
    pattern: /^(?:packages\/rootage\/|ecosystem\/rootage\/)/,
    command: "bun rootage:test",
    source: "package.json#scripts.rootage:test",
  },
  {
    id: "qvism-test",
    pattern: /^ecosystem\/qvism\//,
    command: "bun test ecosystem/qvism",
    source: "TECH.md#테스트",
  },
  {
    id: "docs-test",
    pattern: /^docs\//,
    command: "bun docs:test",
    source: "package.json#scripts.docs:test",
  },
];

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function normalizedRelativePath(slashPath: string): string {
  const normalized = slashPath
    .replace(/^(?:\.\/)+/, "")
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");
  if (normalized) return normalized;
  return /^\.\/*$/.test(slashPath) ? "." : "";
}

function normalizeRepositoryPath(value: string): string {
  const slashPath = value.replaceAll("\\", "/");
  const normalized = normalizedRelativePath(slashPath);
  if (!normalized) throw new Error(`저장소 상대 경로만 사용할 수 있습니다: ${value}`);
  if (isAbsolute(slashPath)) throw new Error(`저장소 상대 경로만 사용할 수 있습니다: ${value}`);
  if (normalized.split("/").includes("..")) {
    throw new Error(`저장소 상대 경로만 사용할 수 있습니다: ${value}`);
  }
  return normalized;
}

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function readJson(path: string): Promise<Record<string, unknown> | undefined> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    throw error;
  }
}

async function findSeedRepositoryRoot(start = process.cwd()): Promise<string> {
  let current = await realpath(start);
  while (dirname(current) !== current) {
    if ((await readJson(join(current, "package.json")))?.name === REPOSITORY_NAME) return current;
    const parent = dirname(current);
    current = parent;
  }
  throw new Error("SEED Design 저장소 루트를 찾지 못했습니다.");
}

function isWithinRoot(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === "" || (!pathFromRoot.startsWith("..") && !isAbsolute(pathFromRoot));
}

async function findPackage(
  root: string,
  repositoryPath: string,
): Promise<ImpactedPackage | undefined> {
  let directory = await packageSearchStart(root, repositoryPath);
  if (!isWithinRoot(root, directory)) return undefined;
  while (directory !== root) {
    const found = await readPackageAtDirectory(root, directory);
    if (found) return found;
    directory = dirname(directory);
  }
  return undefined;
}

async function packageSearchStart(root: string, repositoryPath: string): Promise<string> {
  const candidate = resolve(root, repositoryPath);
  try {
    return (await stat(candidate)).isDirectory() ? candidate : dirname(candidate);
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return dirname(candidate);
    throw error;
  }
}

function impactedPackageFromManifest(
  manifest: Record<string, unknown>,
  packagePath: string,
  evidence: string,
): ImpactedPackage | undefined {
  if (typeof manifest.name !== "string") return undefined;
  return {
    name: manifest.name,
    path: packagePath,
    private: typeof manifest.private === "boolean" ? manifest.private : "unknown",
    evidence: [evidence],
  };
}

async function readPackageAtDirectory(
  root: string,
  directory: string,
): Promise<ImpactedPackage | undefined> {
  const manifest = await readJson(join(directory, "package.json"));
  if (!manifest) return undefined;
  const packagePath = relative(root, directory).split(sep).join("/");
  return impactedPackageFromManifest(manifest, packagePath, `${packagePath}/package.json`);
}

function readPackageAtRef(
  root: string,
  baseRef: ReleaseBaseRef,
  packagePath: string,
): ImpactedPackage | undefined {
  const manifestPath = `${packagePath}/package.json`;
  const result = gitOutput(root, ["show", `${baseRef}:${manifestPath}`]);
  if (!result.ok) return undefined;
  try {
    const manifest = JSON.parse(result.output) as Record<string, unknown>;
    return impactedPackageFromManifest(manifest, packagePath, `${baseRef}:${manifestPath}`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${baseRef}:${manifestPath}을 읽지 못했습니다: ${detail}`);
  }
}

function findPackageAtRef(
  root: string,
  baseRef: ReleaseBaseRef,
  repositoryPath: string,
): ImpactedPackage | undefined {
  let directory = normalizeRepositoryPath(repositoryPath);
  while (directory !== ".") {
    const found = readPackageAtRef(root, baseRef, directory);
    if (found) return found;
    directory = dirname(directory).replaceAll("\\", "/");
  }
  return undefined;
}

function surfaceForPath(path: string): SurfaceKind {
  if (MANUAL_SOURCE_PATHS.has(path)) return "source";
  return SURFACE_RULES.find(({ pattern }) => pattern.test(path))?.kind ?? "implementation";
}

function platformsForPaths(paths: string[]): Platform[] {
  return uniqueSorted(
    paths.flatMap((path) =>
      PLATFORM_RULES.filter(({ pattern }) => pattern.test(path)).map(({ platform }) => platform),
    ),
  ) as Platform[];
}

function componentsForPaths(paths: string[]): string[] {
  const patterns = [
    /^packages\/rootage\/(?:components|__generated__\/components)\/([^/.]+)/,
    /^packages\/(?:qvism-preset|lynx-qvism-preset)\/src\/(?:recipes|vars\/component)\/([^/.]+)/,
    /^packages\/(?:react|lynx-react)\/src\/components\/([^/]+)/,
    /^packages\/stackflow\/src\/(?:components|primitive)\/([^/]+)/,
    /^packages\/(?:react-headless|lynx-react-headless)\/([^/]+)\/src\//,
    /^docs\/examples\/(?:react|lynx)\/([^/]+)/,
  ] as const;
  return uniqueSorted(
    paths.flatMap((path) => {
      const structuredComponent = componentFromDocsPath(path) ?? componentFromRegistryPath(path);
      if (structuredComponent) return [structuredComponent];
      const match = patterns.map((pattern) => path.match(pattern)).find(Boolean);
      const component = normalizeComponentId(match?.[1]);
      return component ? [component] : [];
    }),
  );
}

function componentFromDocsPath(path: string): string | undefined {
  const match = path.match(
    /^docs\/content\/(?:(?:react|lynx)\/)?components\/(?:.+\/)?([^/]+\.mdx)$/,
  );
  return normalizeComponentId(match?.[1]);
}

function componentFromRegistryPath(path: string): string | undefined {
  const match = path.match(/^docs\/(?:registry|public\/__registry__)\/(?:react|lynx)\/(.+)$/);
  const segments = match?.[1].split("/") ?? [];
  const item = segments.length > 2 ? segments[1] : segments.at(-1);
  return segments.length >= 2 ? normalizeComponentId(item) : undefined;
}

function normalizeComponentId(value: string | undefined): string | undefined {
  const component = value
    ?.replace(/\.[^.]+$/, "")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return component && !IGNORED_COMPONENT_IDS.has(component) ? component : undefined;
}

function highestBump(bumps: ReleaseBump[]): ReleaseBump | undefined {
  return [...bumps].sort((left, right) => BUMP_ORDER[right] - BUMP_ORDER[left])[0];
}

function branchForBump(bump: ReleaseBump): ReleaseBranch {
  return BUMP_BRANCH[bump];
}

function unknownBranchPlan(reason: string, evidence: string[]): BranchPlan {
  return {
    targetBranch: "unknown",
    targetRef: "unknown",
    prBase: "unknown",
    reason,
    evidence,
  };
}

function knownBranchPlan(branch: ReleaseBranch, reason: string, evidence: string[]): BranchPlan {
  return {
    targetBranch: branch,
    targetRef: `origin/${branch}`,
    prBase: branch,
    reason,
    evidence,
  };
}

function releaseBranchEvidence(input: {
  minorCandidates: string[];
  majorCandidates: string[];
  confirmedLane?: ConfirmedLane;
  changesetPaths: string[];
  confirmedBumps: ReleaseBump[];
  releaseDecision: "unconfirmed" | "confirmed-none";
}): string[] {
  return [
    ...input.minorCandidates.map((path) => `origin/minor lane 후보: ${path}`),
    ...input.majorCandidates.map((path) => `origin/major lane 후보: ${path}`),
    ...(input.confirmedLane ? [`확정 lane: ${input.confirmedLane}`] : []),
    ...input.changesetPaths.map((path) => `확정 changeset: ${path}`),
    ...input.confirmedBumps.map((bump) => `확정 bump: ${bump}`),
    ...(input.releaseDecision === "confirmed-none" ? ["확정 릴리스 판단: changeset 없음"] : []),
  ];
}

function branchFromConfirmedLane(
  lane: ConfirmedLane | undefined,
  bump: ReleaseBump | undefined,
  evidence: string[],
): BranchPlan | undefined {
  if (!lane || lane === "none") return undefined;
  if (laneConflictsWithBump(lane, bump)) {
    return unknownBranchPlan(
      `브랜치 전용 근거(${lane})와 확정 bump(${bump})가 충돌합니다.`,
      evidence,
    );
  }
  return knownBranchPlan(
    lane,
    `수정 대상이 origin/${lane}에만 있는 미출시 작업과 겹칩니다.`,
    evidence,
  );
}

function laneConflictsWithBump(lane: ReleaseBranch, bump: ReleaseBump | undefined): boolean {
  if (!bump) return false;
  return lane !== branchForBump(bump);
}

function branchWithoutLane(
  bump: ReleaseBump | undefined,
  releaseRequired: boolean,
  releaseDecision: "unconfirmed" | "confirmed-none",
  evidence: string[],
): BranchPlan {
  if (bump) {
    const bumpBranch = branchForBump(bump);
    return knownBranchPlan(
      bumpBranch,
      `확정 changeset의 가장 높은 bump가 ${bump}입니다.`,
      evidence,
    );
  }
  if (releaseRequired && releaseDecision !== "confirmed-none") {
    return unknownBranchPlan(
      "배포 가능한 패키지가 바뀌었지만 bump가 아직 확정되지 않았습니다.",
      evidence,
    );
  }
  return knownBranchPlan(
    "dev",
    "문서, 스킬 또는 내부 도구 변경이며 릴리스 bump가 필요하지 않습니다.",
    evidence,
  );
}

function hasLaneCandidates(branchEvidence: BranchEvidence): boolean {
  return (
    branchEvidence.laneCandidates.minor.length > 0 || branchEvidence.laneCandidates.major.length > 0
  );
}

function branchFromLaneEvidence(
  branchEvidence: BranchEvidence,
  bump: ReleaseBump | undefined,
  evidence: string[],
): BranchPlan | undefined {
  const confirmedPlan = branchFromConfirmedLane(branchEvidence.confirmedLane, bump, evidence);
  if (confirmedPlan) return confirmedPlan;
  if (branchEvidence.confirmedLane) return undefined;
  if (!hasLaneCandidates(branchEvidence)) return undefined;
  return unknownBranchPlan(
    "릴리스 lane과 겹치는 경로 후보가 있습니다. 양쪽 diff를 확인하고 --lane을 확정해야 합니다.",
    evidence,
  );
}

function releaseDecisionOrDefault(
  releaseDecision: "confirmed-none" | undefined,
): "unconfirmed" | "confirmed-none" {
  return releaseDecision ?? "unconfirmed";
}

function releaseEvidenceForResolution(
  input: Parameters<typeof resolveReleaseBranch>[0],
  minorCandidates: string[],
  majorCandidates: string[],
  releaseDecision: "unconfirmed" | "confirmed-none",
): string[] {
  return releaseBranchEvidence({
    minorCandidates,
    majorCandidates,
    confirmedLane: input.branchEvidence.confirmedLane,
    changesetPaths: input.changesetPaths ?? [],
    confirmedBumps: input.confirmedBumps,
    releaseDecision,
  });
}

function branchSafetyGate(
  branchEvidence: BranchEvidence,
  releaseRequired: boolean,
  bump: ReleaseBump | undefined,
  releaseDecision: "unconfirmed" | "confirmed-none",
  evidence: string[],
): BranchPlan | undefined {
  if (!branchEvidence.complete) {
    return unknownBranchPlan(
      `Git 브랜치 근거가 불완전합니다: ${branchEvidence.errors.join("; ")}`,
      evidence,
    );
  }
  if (releaseRequired && !bump && releaseDecision !== "confirmed-none") {
    return branchWithoutLane(bump, releaseRequired, releaseDecision, evidence);
  }
  return undefined;
}

export function resolveReleaseBranch(input: {
  releaseRequired: boolean;
  confirmedBumps: ReleaseBump[];
  branchEvidence: BranchEvidence;
  changesetPaths?: string[];
  releaseDecision?: "confirmed-none";
}): BranchPlan {
  const minorCandidates = uniqueSorted(input.branchEvidence.laneCandidates.minor);
  const majorCandidates = uniqueSorted(input.branchEvidence.laneCandidates.major);
  const releaseDecision = releaseDecisionOrDefault(input.releaseDecision);
  const evidence = releaseEvidenceForResolution(
    input,
    minorCandidates,
    majorCandidates,
    releaseDecision,
  );
  const bump = highestBump(input.confirmedBumps);
  const safetyPlan = branchSafetyGate(
    input.branchEvidence,
    input.releaseRequired,
    bump,
    releaseDecision,
    evidence,
  );
  if (safetyPlan) return safetyPlan;
  const lanePlan = branchFromLaneEvidence(input.branchEvidence, bump, evidence);
  if (lanePlan) return lanePlan;
  return branchWithoutLane(bump, input.releaseRequired, releaseDecision, evidence);
}

async function listTestFiles(root: string, repositoryDirectory: string): Promise<string[]> {
  const absoluteDirectory = join(root, repositoryDirectory);
  const found: string[] = [];
  await collectTestFiles(root, absoluteDirectory, found);
  return uniqueSorted(found);
}

async function readDirectory(directory: string): Promise<Dirent[]> {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return [];
    throw error;
  }
}

async function collectTestFiles(root: string, directory: string, found: string[]): Promise<void> {
  for (const entry of await readDirectory(directory)) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectTestFiles(root, path, found);
      continue;
    }
    if (/\.(?:test|spec)\.(?:ts|tsx|js|jsx)$/.test(entry.name)) {
      found.push(relative(root, path).split(sep).join("/"));
    }
  }
}

function requiredVerificationSteps(paths: string[]): VerificationStep[] {
  return [
    {
      id: "generate-all",
      kind: "command",
      command: "bun generate:all",
      reason: "저장소 작업 뒤 생성물을 현재 원천과 맞춥니다.",
      evidence: paths,
      source: "AGENTS.md#Boundaries, package.json#scripts.generate:all",
    },
    {
      id: "test-all",
      kind: "command",
      command: "bun test:all",
      reason: "커밋 전에 전체 회귀를 확인합니다.",
      evidence: paths,
      source: "AGENTS.md#Boundaries, package.json#scripts.test:all",
    },
  ];
}

function focusedVerificationSteps(paths: string[]): VerificationStep[] {
  return FOCUSED_VERIFICATION_RULES.flatMap(({ id, pattern, command, source }) => {
    const evidence = paths.filter((path) => pattern.test(path));
    return evidence.length > 0
      ? [
          {
            id,
            kind: "command" as const,
            command,
            reason: "변경 경로에 해당하는 집중 검증입니다.",
            evidence,
            source,
          },
        ]
      : [];
  });
}

function skillDirectoriesForPaths(paths: string[]): string[] {
  return uniqueSorted(
    paths.flatMap((path) => {
      const match = path.match(/^(skills\/[^/]+)\//);
      return match?.[1] ? [match[1]] : [];
    }),
  );
}

async function skillTestStep(root: string, paths: string[]): Promise<VerificationStep | undefined> {
  const tests = uniqueSorted(
    (
      await Promise.all(
        skillDirectoriesForPaths(paths).map((directory) =>
          listTestFiles(root, `${directory}/scripts`),
        ),
      )
    ).flat(),
  );
  if (tests.length === 0) return undefined;
  return {
    id: "skill-tests",
    kind: "command",
    command: `bun test ${tests.join(" ")}`,
    reason: "수정한 스킬의 기존 집중 테스트를 실행합니다.",
    evidence: tests,
    source: "AGENTS.md#테스트",
  };
}

function packageBuildStep(paths: string[]): VerificationStep | undefined {
  const evidence = paths.filter((path) => path.startsWith("packages/"));
  if (evidence.length === 0) return undefined;
  return {
    id: "packages-build",
    kind: "command",
    command: "bun packages:build",
    reason: "패키지 변경의 공개 빌드 표면을 확인합니다.",
    evidence,
    source: "package.json#scripts.packages:build",
  };
}

function lynxRuntimeReviewStep(paths: string[]): VerificationStep | undefined {
  const evidence = paths.filter((path) => /^(?:docs\/examples\/lynx\/|examples\/lynx)/.test(path));
  if (evidence.length === 0) return undefined;
  return {
    id: "lynx-example-runtime",
    kind: "manual",
    action:
      "문서 미리보기의 entry·bundle 연결을 확인하고, 네이티브 동작을 새로 주장한다면 실제 Lynx 환경에서 별도로 확인합니다.",
    reason: "Lynx 예제 또는 실행 앱이 변경됐습니다.",
    evidence,
    source: "skills/seed-write-lynx-component-docs/references/verification.md",
  };
}

function reactVisualStep(paths: string[]): VerificationStep | undefined {
  const evidence = paths.filter((path) =>
    /^(?:docs\/(?:stories|examples\/react)\/|packages\/react\/)/.test(path),
  );
  if (evidence.length === 0) return undefined;
  return {
    id: "react-visual",
    kind: "manual",
    action: "관련 Storybook 또는 문서 예제를 브라우저에서 확인합니다.",
    reason: "React의 시각 표면이 변경됐습니다.",
    evidence,
    source: "skills/seed-create-component/references/verification-checklist.md",
  };
}

function changesetStep(
  packages: ImpactedPackage[],
  releaseDecision: "unconfirmed" | "confirmed-none",
): VerificationStep | undefined {
  if (releaseDecision === "confirmed-none") return undefined;
  const publishable = packages.filter(
    (item) => item.private !== true && !item.path.startsWith("packages/archive/"),
  );
  if (publishable.length === 0) return undefined;
  return {
    id: "changeset",
    kind: "skill",
    skill: "seed-changeset",
    action: "후보 패키지와 bump를 사용자와 확정합니다.",
    reason: "배포 가능한 패키지가 변경됐습니다.",
    evidence: publishable.flatMap((item) => item.evidence),
    source: "skills/seed-changeset/SKILL.md",
  };
}

function definedSteps(steps: Array<VerificationStep | undefined>): VerificationStep[] {
  return steps.filter((step): step is VerificationStep => Boolean(step));
}

async function buildVerification(
  root: string,
  paths: string[],
  packages: ImpactedPackage[],
  releaseDecision: "unconfirmed" | "confirmed-none",
): Promise<VerificationStep[]> {
  const [generateAll, testAll] = requiredVerificationSteps(paths);
  return definedSteps([
    generateAll,
    ...focusedVerificationSteps(paths),
    await skillTestStep(root, paths),
    packageBuildStep(paths),
    lynxRuntimeReviewStep(paths),
    reactVisualStep(paths),
    changesetStep(packages, releaseDecision),
    testAll,
  ]);
}

async function readTextIfPresent(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    throw error;
  }
}

function parseChangesetBumps(content: string | undefined): ReleaseBump[] {
  const frontmatter = content?.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  return [
    ...frontmatter.matchAll(/^\s*(?:"[^"]+"|'[^']+'|[^:]+)\s*:\s*(patch|minor|major)\s*$/gm),
  ].map((match) => match[1] as ReleaseBump);
}

async function readChangesetBumps(root: string, paths: string[]): Promise<ReleaseBump[]> {
  const changesets = paths.filter((path) => /^\.changeset\/[^/]+\.md$/.test(path));
  const contents = await Promise.all(changesets.map((path) => readTextIfPresent(join(root, path))));
  return contents.flatMap(parseChangesetBumps);
}

function mergePackage(
  packages: Map<string, ImpactedPackage>,
  item: ImpactedPackage | undefined,
): void {
  if (!item) return;
  const previous = packages.get(item.path);
  if (!previous) packages.set(item.path, item);
  else previous.evidence = uniqueSorted([...previous.evidence, ...item.evidence]);
}

interface PackageLookup {
  item?: ImpactedPackage;
  error?: string;
}

async function packageForPath(
  root: string,
  path: string,
  baseRef: ReleaseBaseRef | undefined,
): Promise<PackageLookup> {
  const current = await findPackage(root, path);
  if (current) return { item: current };
  if (!path.startsWith("packages/")) return {};
  if (!baseRef) return { error: `삭제 또는 미생성 package 경로의 기준 ref가 없습니다: ${path}` };
  const previous = findPackageAtRef(root, baseRef, path);
  return previous
    ? { item: previous }
    : { error: `${baseRef}에서 package 근거를 찾지 못했습니다: ${path}` };
}

async function impactedPackages(
  root: string,
  paths: string[],
  baseRef: ReleaseBaseRef | undefined,
): Promise<{ packages: ImpactedPackage[]; errors: string[] }> {
  const packages = new Map<string, ImpactedPackage>();
  const lookups = await Promise.all(paths.map((path) => packageForPath(root, path, baseRef)));
  for (const lookup of lookups) {
    mergePackage(packages, lookup.item);
  }
  return {
    packages: [...packages.values()].sort((left, right) => left.path.localeCompare(right.path)),
    errors: uniqueSorted(lookups.flatMap((lookup) => (lookup.error ? [lookup.error] : []))),
  };
}

function impactSurfaces(paths: string[]): Array<{ kind: SurfaceKind; paths: string[] }> {
  const grouped = new Map<SurfaceKind, string[]>();
  for (const path of paths) {
    const kind = surfaceForPath(path);
    grouped.set(kind, [...(grouped.get(kind) ?? []), path]);
  }
  return [...grouped.entries()]
    .map(([kind, groupedPaths]) => ({ kind, paths: uniqueSorted(groupedPaths) }))
    .sort((left, right) => left.kind.localeCompare(right.kind));
}

function releaseRequired(packages: ImpactedPackage[]): boolean {
  return packages.some(
    (item) => item.private !== true && !item.path.startsWith("packages/archive/"),
  );
}

function changePlanUncertainties(existing: string[], branch: BranchPlan): string[] {
  return uniqueSorted([...existing, ...(branch.targetBranch === "unknown" ? [branch.reason] : [])]);
}

function plannedPathsFor(input: ChangePlanInput): string[] {
  return uniqueSorted((input.plannedPaths ?? []).map(normalizeRepositoryPath));
}

function changesetPathsFor(input: ChangePlanInput, allPaths: string[]): string[] {
  return uniqueSorted(
    input.changesetPaths ?? allPaths.filter((path) => path.startsWith(".changeset/")),
  );
}

async function confirmedBumpsFor(
  input: ChangePlanInput,
  root: string,
  changesetPaths: string[],
): Promise<ReleaseBump[]> {
  return uniqueSorted([
    ...(input.confirmedBumps ?? []),
    ...(await readChangesetBumps(root, changesetPaths)),
  ]) as ReleaseBump[];
}

function releaseDecisionFor(input: ChangePlanInput): "unconfirmed" | "confirmed-none" {
  return input.releaseDecision ?? "unconfirmed";
}

function validateReleaseDecision(
  releaseDecision: "unconfirmed" | "confirmed-none",
  confirmedBumps: ReleaseBump[],
): void {
  if (releaseDecision === "confirmed-none" && confirmedBumps.length > 0) {
    throw new Error("changeset 없음 확정과 package bump는 함께 사용할 수 없습니다.");
  }
}

function existingUncertaintiesFor(input: ChangePlanInput): string[] {
  return input.uncertainties ?? [];
}

function branchEvidenceErrors(input: ChangePlanInput, packageErrors: string[]): string[] {
  const errors = uniqueSorted([...(input.branchEvidenceErrors ?? []), ...packageErrors]);
  if (input.branchEvidenceComplete !== false || errors.length > 0) return errors;
  return ["Git 브랜치 근거 수집이 완료되지 않았습니다."];
}

function isBranchEvidenceComplete(
  requestedCompleteness: boolean | undefined,
  errors: string[],
): boolean {
  return requestedCompleteness !== false && errors.length === 0;
}

function branchEvidenceFor(input: ChangePlanInput, packageErrors: string[]): BranchEvidence {
  const errors = branchEvidenceErrors(input, packageErrors);
  return {
    complete: isBranchEvidenceComplete(input.branchEvidenceComplete, errors),
    baseRef: input.baseRef,
    laneCandidates: input.laneCandidates ?? { minor: [], major: [] },
    confirmedLane: input.confirmedLane,
    errors,
  };
}

export async function planSeedChange(input: ChangePlanInput): Promise<ChangePlanResult> {
  const root = await realpath(input.root);
  const changed = uniqueSorted(input.changedPaths.map(normalizeRepositoryPath));
  const planned = plannedPathsFor(input);
  const allPaths = uniqueSorted([...changed, ...planned]);
  const packageImpact = await impactedPackages(root, allPaths, input.baseRef);
  const branchEvidence = branchEvidenceFor(input, packageImpact.errors);
  const changesetPaths = changesetPathsFor(input, allPaths);
  const confirmedBumps = await confirmedBumpsFor(input, root, changesetPaths);
  const releaseDecision = releaseDecisionFor(input);
  validateReleaseDecision(releaseDecision, confirmedBumps);
  const branch = resolveReleaseBranch({
    releaseRequired: releaseRequired(packageImpact.packages),
    confirmedBumps,
    branchEvidence,
    changesetPaths,
    releaseDecision: input.releaseDecision,
  });
  const verification = await buildVerification(
    root,
    allPaths,
    packageImpact.packages,
    releaseDecision,
  );

  return {
    paths: { changed, planned },
    impact: {
      packages: packageImpact.packages,
      surfaces: impactSurfaces(allPaths),
      components: componentsForPaths(allPaths),
      platforms: platformsForPaths(allPaths),
    },
    verification,
    branchEvidence,
    branch,
    confirmedBumps,
    releaseDecision,
    uncertainties: changePlanUncertainties(existingUncertaintiesFor(input), branch),
    summary: `${allPaths.length}개 경로에서 ${packageImpact.packages.length}개 패키지와 ${verification.length}개 검증 단계를 찾았습니다. 기준 브랜치는 ${branch.targetBranch}입니다.`,
  };
}

function gitOutput(root: string, args: string[]): { ok: boolean; output: string } {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  return { ok: result.status === 0, output: result.stdout ?? "" };
}

function nulPaths(output: string): string[] {
  return output.split("\0").filter(Boolean).map(normalizeRepositoryPath);
}

function nameStatusPathCount(status: string | undefined): number {
  return status && /^[RC]/.test(status) ? 2 : 1;
}

function nameStatusPaths(output: string): string[] {
  const fields = output.split("\0").filter(Boolean);
  const paths: string[] = [];
  for (let index = 0; index < fields.length; ) {
    const pathCount = nameStatusPathCount(fields[index]);
    paths.push(...fields.slice(index + 1, index + 1 + pathCount).map(normalizeRepositoryPath));
    index += pathCount + 1;
  }
  return uniqueSorted(paths);
}

function gitDiffPaths(root: string, args: string[]): string[] | undefined {
  const result = gitOutput(root, args);
  return result.ok ? nameStatusPaths(result.output) : undefined;
}

function optionalGitDiffPaths(
  root: string,
  args: string[],
  missingMessage: string,
  errors: string[],
): string[] {
  const paths = gitDiffPaths(root, args);
  if (!paths) errors.push(missingMessage);
  return paths ?? [];
}

function requiredGitDiffPaths(root: string, args: string[], errorMessage: string): string[] {
  const paths = gitDiffPaths(root, args);
  if (!paths) throw new Error(errorMessage);
  return paths;
}

function committedChangePaths(
  root: string,
  baseRef: ReleaseBaseRef | undefined,
  errors: string[],
): string[] {
  if (!baseRef) {
    errors.push("암시적 Git 변경 수집에는 --base-ref가 필요합니다.");
    return [];
  }
  return optionalGitDiffPaths(
    root,
    [
      "diff",
      "--name-status",
      "-z",
      "--find-renames",
      "--diff-filter=ACDMRT",
      `${baseRef}...HEAD`,
      "--",
    ],
    `${baseRef}와 HEAD의 커밋 차이를 읽지 못했습니다.`,
    errors,
  );
}

function worktreeChangePaths(root: string): string[] {
  const tracked = requiredGitDiffPaths(
    root,
    ["diff", "--name-status", "-z", "--find-renames", "--diff-filter=ACDMRT", "HEAD", "--"],
    "현재 Git 작업 트리의 추적 변경 경로를 읽지 못했습니다.",
  );
  const result = gitOutput(root, ["ls-files", "--others", "--exclude-standard", "-z"]);
  if (!result.ok) throw new Error("현재 Git 작업 트리의 미추적 경로를 읽지 못했습니다.");
  const untracked = nulPaths(result.output);
  return [...tracked, ...untracked];
}

function releaseLanePaths(root: string, branch: "minor" | "major", errors: string[]): string[] {
  return optionalGitDiffPaths(
    root,
    [
      "diff",
      "--name-status",
      "-z",
      "--find-renames",
      "--diff-filter=ACDMRT",
      `origin/dev...origin/${branch}`,
      "--",
    ],
    `origin/${branch}의 브랜치 전용 경로를 읽지 못했습니다.`,
    errors,
  );
}

function collectGitEvidence(
  root: string,
  input: { baseRef?: ReleaseBaseRef; explicitPaths: boolean },
): {
  changedPaths: string[];
  laneDiffs: LaneEvidence;
  branchEvidenceComplete: boolean;
  branchEvidenceErrors: string[];
} {
  const branchEvidenceErrors: string[] = [];
  const committed = input.explicitPaths
    ? []
    : committedChangePaths(root, input.baseRef, branchEvidenceErrors);
  const worktree = input.explicitPaths ? [] : worktreeChangePaths(root);
  return {
    changedPaths: uniqueSorted([...committed, ...worktree]),
    laneDiffs: {
      minor: releaseLanePaths(root, "minor", branchEvidenceErrors),
      major: releaseLanePaths(root, "major", branchEvidenceErrors),
    },
    branchEvidenceComplete: branchEvidenceErrors.length === 0,
    branchEvidenceErrors,
  };
}

function intersectPaths(paths: string[], lanePaths: string[]): string[] {
  return uniqueSorted(
    lanePaths.filter((lanePath) => paths.some((path) => pathsOverlap(path, lanePath))),
  );
}

function pathsOverlap(left: string, right: string): boolean {
  return (
    left === "." ||
    right === "." ||
    left === right ||
    left.startsWith(`${right}/`) ||
    right.startsWith(`${left}/`)
  );
}

interface ChangePlanCliOptions {
  paths: string[];
  planned: string[];
  bumps: ReleaseBump[];
  baseRef?: ReleaseBaseRef;
  confirmedLane?: ConfirmedLane;
  releaseDecision?: "confirmed-none";
}

function parseCli(args: string[]): ChangePlanCliOptions {
  const result: ChangePlanCliOptions = {
    paths: [],
    planned: [],
    bumps: [],
  };
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--no-release") {
      result.releaseDecision = "confirmed-none";
      continue;
    }
    const value = args[index + 1];
    if (!value) throw new Error(`값이 필요합니다: ${option}`);
    setCliArgument(result, option, value);
    index += 1;
  }
  validateCliReleaseDecision(result);
  return result;
}

function setCliArgument(result: ChangePlanCliOptions, option: string, value: string): void {
  const setters: Record<string, () => void> = {
    "--path": () => result.paths.push(value),
    "--planned": () => result.planned.push(value),
    "--bump": () => result.bumps.push(parseBump(value)),
    "--base-ref": () => {
      result.baseRef = parseBaseRef(value);
    },
    "--lane": () => {
      result.confirmedLane = parseLane(value);
    },
  };
  const setter = setters[option];
  if (!setter) throw new Error(`알 수 없는 옵션입니다: ${option}`);
  setter();
}

function parseBump(value: string): ReleaseBump {
  if (["patch", "minor", "major"].includes(value)) return value as ReleaseBump;
  throw new Error(`지원하지 않는 bump입니다: ${value}`);
}

function parseBaseRef(value: string): ReleaseBaseRef {
  if (["origin/dev", "origin/minor", "origin/major"].includes(value)) {
    return value as ReleaseBaseRef;
  }
  throw new Error(`지원하지 않는 기준 ref입니다: ${value}`);
}

function parseLane(value: string): ConfirmedLane {
  if (["minor", "major", "none"].includes(value)) return value as ConfirmedLane;
  throw new Error(`지원하지 않는 lane입니다: ${value}`);
}

function validateCliReleaseDecision(input: {
  bumps: ReleaseBump[];
  releaseDecision?: "confirmed-none";
}): void {
  if (input.releaseDecision && input.bumps.length > 0) {
    throw new Error("--no-release와 --bump는 함께 사용할 수 없습니다.");
  }
}

async function runCli(args: string[]): Promise<void> {
  try {
    const root = await findSeedRepositoryRoot();
    const cli = parseCli(args);
    const git = collectGitEvidence(root, {
      baseRef: cli.baseRef,
      explicitPaths: cli.paths.length > 0,
    });
    const changedPaths =
      cli.paths.length > 0 ? cli.paths.map(normalizeRepositoryPath) : git.changedPaths;
    const allPaths = uniqueSorted([...changedPaths, ...cli.planned.map(normalizeRepositoryPath)]);
    const result = await planSeedChange({
      root,
      changedPaths,
      plannedPaths: cli.planned,
      confirmedBumps: cli.bumps,
      releaseDecision: cli.releaseDecision,
      baseRef: cli.baseRef,
      laneCandidates: {
        minor: intersectPaths(allPaths, git.laneDiffs.minor),
        major: intersectPaths(allPaths, git.laneDiffs.major),
      },
      confirmedLane: cli.confirmedLane,
      branchEvidenceComplete: git.branchEvidenceComplete,
      branchEvidenceErrors: git.branchEvidenceErrors,
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) await runCli(Bun.argv.slice(2));
