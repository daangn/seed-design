import type { Dirent } from "node:fs";
import { readdir, readFile, realpath } from "node:fs/promises";
import { basename, dirname, extname, join, posix, relative, sep } from "node:path";

export type ComponentPlatform = "react" | "lynx";

export interface PlatformPaths {
  react: string[];
  lynx: string[];
}

export interface SharedPlatformPaths extends PlatformPaths {
  shared: string[];
}

export interface ComponentAmbiguity {
  candidate: string;
  paths: string[];
}

export interface ComponentMapResult {
  component: {
    input: string;
    kebab: string;
    pascal: string;
    state: "matched" | "ambiguous" | "not-found";
  };
  platforms: ComponentPlatform[];
  rootage: string[];
  recipeSources: PlatformPaths;
  generatedOutputs: SharedPlatformPaths;
  headless: PlatformPaths;
  implementations: PlatformPaths;
  packageExports: PlatformPaths;
  registry: PlatformPaths;
  docs: SharedPlatformPaths;
  examples: PlatformPaths;
  tests: PlatformPaths;
  ambiguities: ComponentAmbiguity[];
}

interface NormalizedComponent {
  input: string;
  kebab: string;
  pascal: string;
}

type SurfaceName =
  | "rootage"
  | "recipeSources"
  | "generatedOutputs"
  | "headless"
  | "implementations"
  | "packageExports"
  | "registry"
  | "docs"
  | "examples"
  | "tests";
type SurfacePlatform = ComponentPlatform | "shared";
type BucketKey = `${SurfaceName}:${SurfacePlatform}`;

interface ClassifiedPath {
  surface: SurfaceName;
  platform: SurfacePlatform;
}

interface SurfaceRule extends ClassifiedPath {
  pattern: RegExp;
}

const REPOSITORY_NAME = "@seed-design/project";
const SCAN_ROOTS = [
  "packages/rootage/components",
  "packages/rootage/__generated__/components",
  "packages/qvism-preset/src/recipes",
  "packages/qvism-preset/src/vars/component",
  "packages/lynx-qvism-preset/src/recipes",
  "packages/lynx-qvism-preset/src/vars/component",
  "packages/css/recipes",
  "packages/css/vars/component",
  "packages/lynx-css/recipes",
  "packages/lynx-css/vars/component",
  "packages/react-headless",
  "packages/lynx-react-headless",
  "packages/react/src",
  "packages/lynx-react/src",
  "docs/content",
  "docs/registry",
  "docs/stories",
  "docs/examples",
  "examples",
] as const;
const EXCLUDED_DIRECTORIES = new Set([
  ".cache",
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "lib",
  "node_modules",
  "storybook-static",
]);
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".mjs", ".js", ".jsx"]);
const MODULE_EXTENSIONS = [".ts", ".tsx", ".mts", ".mjs", ".js", ".jsx"] as const;
const COMPONENT_PATH_PATTERNS = [
  /^packages\/rootage\/(?:components|__generated__\/components)\/([^/.]+)/,
  /^packages\/(?:qvism-preset|lynx-qvism-preset)\/src\/(?:recipes|vars\/component)\/([^/.]+)/,
  /^packages\/(?:css|lynx-css)\/(?:recipes|vars\/component)\/([^/.]+)/,
  /^packages\/(?:react|lynx-react)\/src\/components\/([^/]+)\//,
  /^packages\/(?:react-headless|lynx-react-headless)\/[^/]+\/src\/([^/.]+)/,
  /^docs\/content\/(?:(?:react|lynx)\/)?components\/([^/.]+)/,
  /^docs\/registry\/(?:react|lynx)\/(?:ui|block|breeze|lib)\/([^/.]+)/,
  /^docs\/stories\/([^/.]+)/,
  /^docs\/examples\/(?:react|lynx)\/([^/]+)\//,
  /^examples\/[^/]+\/.*\/(?:ui|components)\/([^/.]+)/,
] as const;
const STATIC_SURFACE_RULES: SurfaceRule[] = [
  {
    surface: "rootage",
    platform: "shared",
    pattern: /^packages\/rootage\/components\//,
  },
  {
    surface: "recipeSources",
    platform: "react",
    pattern: /^packages\/qvism-preset\/src\/recipes\//,
  },
  {
    surface: "recipeSources",
    platform: "lynx",
    pattern: /^packages\/lynx-qvism-preset\/src\/recipes\//,
  },
  {
    surface: "headless",
    platform: "react",
    pattern: /^packages\/react-headless\//,
  },
  {
    surface: "headless",
    platform: "lynx",
    pattern: /^packages\/lynx-react-headless\//,
  },
  {
    surface: "implementations",
    platform: "react",
    pattern: /^packages\/react\/src\/components\//,
  },
  {
    surface: "implementations",
    platform: "lynx",
    pattern: /^packages\/lynx-react\/src\/components\//,
  },
  {
    surface: "registry",
    platform: "react",
    pattern: /^docs\/registry\/react\//,
  },
  {
    surface: "registry",
    platform: "lynx",
    pattern: /^docs\/registry\/lynx\//,
  },
  {
    surface: "docs",
    platform: "react",
    pattern: /^docs\/content\/react\//,
  },
  {
    surface: "docs",
    platform: "lynx",
    pattern: /^docs\/content\/lynx\//,
  },
  {
    surface: "docs",
    platform: "shared",
    pattern: /^docs\/content\/components\//,
  },
  {
    surface: "examples",
    platform: "react",
    pattern: /^docs\/examples\/react\//,
  },
  {
    surface: "examples",
    platform: "lynx",
    pattern: /^docs\/examples\/lynx\//,
  },
  {
    surface: "examples",
    platform: "lynx",
    pattern: /^examples\/lynx-/,
  },
  {
    surface: "examples",
    platform: "react",
    pattern: /^examples\//,
  },
];
const GENERATED_SURFACE_RULES: SurfaceRule[] = [
  {
    surface: "generatedOutputs",
    platform: "shared",
    pattern: /^packages\/rootage\/__generated__\/components\//,
  },
  {
    surface: "generatedOutputs",
    platform: "lynx",
    pattern:
      /^packages\/(?:lynx-qvism-preset\/src\/vars\/component|lynx-css\/(?:recipes|vars\/component))\//,
  },
  {
    surface: "generatedOutputs",
    platform: "react",
    pattern: /^packages\/(?:qvism-preset\/src\/vars\/component|css\/(?:recipes|vars\/component))\//,
  },
];

/** 문자열 목록을 중복 없이 정렬합니다. */
function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

/** 컴포넌트 이름을 경로 비교용 kebab-case로 바꿉니다. */
function kebabCase(value: string): string {
  return value
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** kebab-case 이름을 공개 심볼에 쓰는 PascalCase로 바꿉니다. */
function pascalCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

/** 경로가 아닌 단일 컴포넌트 이름만 허용하고 비교 형식으로 정규화합니다. */
function normalizeComponentName(input: string): NormalizedComponent {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("컴포넌트 이름은 비어 있을 수 없습니다.");
  if (trimmed.length > 120) throw new Error("컴포넌트 이름은 120자 이하여야 합니다.");
  if (!/^[A-Za-z\d][A-Za-z\d _-]*$/.test(trimmed)) {
    throw new Error("컴포넌트 이름에는 영문, 숫자, 공백, 밑줄과 하이픈만 사용할 수 있습니다.");
  }

  const kebab = kebabCase(trimmed);
  return { input, kebab, pascal: pascalCase(kebab) };
}

/** 알 수 없는 오류가 지정한 파일 시스템 오류 코드인지 확인합니다. */
function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

/** package.json에서 저장소 이름만 읽고 파일이 없으면 undefined를 반환합니다. */
async function readRepositoryName(directory: string): Promise<string | undefined> {
  try {
    const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8")) as {
      name?: unknown;
    };
    return typeof manifest.name === "string" ? manifest.name : undefined;
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    throw error;
  }
}

/** 현재 위치에서 위로 올라가며 SEED Design 저장소 루트를 찾습니다. */
async function findSeedRepositoryRoot(start = process.cwd()): Promise<string> {
  let current = await realpath(start);

  for (;;) {
    if ((await readRepositoryName(current)) === REPOSITORY_NAME) return current;
    const parent = dirname(current);
    if (parent === current) {
      throw new Error("SEED Design 저장소 안에서 실행해야 합니다.");
    }
    current = parent;
  }
}

/** 디렉터리가 없으면 undefined를 반환하고 다른 읽기 오류는 그대로 전달합니다. */
async function readDirectoryEntries(directory: string): Promise<Dirent[] | undefined> {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    throw error;
  }
}

/** 디렉터리 항목 하나를 검사해 일반 파일만 수집합니다. */
async function collectDirectoryEntry(
  repositoryRoot: string,
  directory: string,
  entry: Dirent,
  files: string[],
): Promise<void> {
  if (entry.isSymbolicLink()) return;
  const absolutePath = join(directory, entry.name);
  if (entry.isDirectory()) {
    if (EXCLUDED_DIRECTORIES.has(entry.name)) return;
    await walkDirectory(repositoryRoot, absolutePath, files);
    return;
  }
  if (!entry.isFile()) return;
  files.push(relative(repositoryRoot, absolutePath).split(sep).join("/"));
}

/** 지정한 디렉터리 아래 일반 파일을 모으되 심링크와 캐시 디렉터리는 따라가지 않습니다. */
async function walkDirectory(
  repositoryRoot: string,
  directory: string,
  files: string[],
): Promise<void> {
  const entries = await readDirectoryEntries(directory);
  if (!entries) return;
  for (const entry of entries) {
    await collectDirectoryEntry(repositoryRoot, directory, entry, files);
  }
}

/** 컴포넌트 표면이 있는 고정된 저장소 경로만 순회해 상대 경로 목록을 만듭니다. */
async function listScanFiles(repositoryRoot: string): Promise<string[]> {
  const files: string[] = [];
  await Promise.all(
    SCAN_ROOTS.map((scanRoot) =>
      walkDirectory(repositoryRoot, join(repositoryRoot, scanRoot), files),
    ),
  );
  return uniqueSorted(files);
}

/** 경로 구조상 컴포넌트 이름을 나타내는 구간만 추출합니다. */
function componentCandidatesForPath(path: string): string[] {
  const candidates: string[] = [];
  for (const pattern of COMPONENT_PATH_PATTERNS) {
    const match = pattern.exec(path);
    if (match?.[1]) candidates.push(match[1]);
  }
  return uniqueSorted(candidates);
}

/** 경로가 대상 컴포넌트의 직접 표면인지 정확한 이름으로 판별합니다. */
function pathMatchesComponent(path: string, component: NormalizedComponent): boolean {
  return componentCandidatesForPath(path).some(
    (candidate) => kebabCase(candidate) === component.kebab,
  );
}

/** import와 export 문에서 상대 모듈 지정자를 추출합니다. */
function extractModuleSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  for (const match of source.matchAll(/\bfrom\s*["']([^"']+)["']/g)) {
    if (match[1]) specifiers.push(match[1]);
  }
  for (const match of source.matchAll(/\bimport\s*(?:\(\s*)?["']([^"']+)["']/g)) {
    if (match[1]) specifiers.push(match[1]);
  }
  return uniqueSorted(specifiers);
}

/** 모듈 파일이나 디렉터리 index를 현재 파일 목록 안에서 해석합니다. */
function resolveModuleSpecifier(
  sourcePath: string,
  specifier: string,
  files: ReadonlySet<string>,
): string | undefined {
  if (!specifier.startsWith(".")) return undefined;
  const base = posix.normalize(posix.join(posix.dirname(sourcePath), specifier));
  const candidates = [
    base,
    ...MODULE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...MODULE_EXTENSIONS.map((extension) => `${base}/index${extension}`),
  ];
  return candidates.find((candidate) => files.has(candidate));
}

/** 공개 index 파일이 다시 내보내는 로컬 모듈의 역방향 그래프를 만듭니다. */
async function buildReverseExportGraph(
  repositoryRoot: string,
  files: readonly string[],
): Promise<Map<string, Set<string>>> {
  const fileSet = new Set(files);
  const reverseGraph = new Map<string, Set<string>>();

  for (const sourcePath of files.filter(isIndexModule)) {
    const source = await readFile(join(repositoryRoot, sourcePath), "utf8");
    for (const specifier of extractModuleSpecifiers(source)) {
      const targetPath = resolveModuleSpecifier(sourcePath, specifier, fileSet);
      if (!targetPath) continue;
      const importers = reverseGraph.get(targetPath) ?? new Set<string>();
      importers.add(sourcePath);
      reverseGraph.set(targetPath, importers);
    }
  }

  return reverseGraph;
}

/** 파일이 코드 import/export 그래프에 참여할 수 있는지 확인합니다. */
function isCodeFile(path: string): boolean {
  return CODE_EXTENSIONS.has(extname(path));
}

/** 파일이 패키지 공개 표면으로 이어질 수 있는 index 모듈인지 확인합니다. */
function isIndexModule(path: string): boolean {
  return /^index\.(?:ts|tsx|mts|mjs|js|jsx)$/.test(basename(path));
}

/** 한 모듈을 다시 내보내는 barrel을 역추적 큐에 추가합니다. */
function collectImportingBarrels(
  targetPath: string,
  reverseGraph: ReadonlyMap<string, ReadonlySet<string>>,
  reached: Set<string>,
  barrels: Set<string>,
  queue: string[],
): void {
  for (const importer of reverseGraph.get(targetPath) ?? []) {
    if (reached.has(importer)) continue;
    reached.add(importer);
    barrels.add(importer);
    queue.push(importer);
  }
}

/** 직접 컴포넌트 파일에서 패키지 루트로 이어지는 모든 barrel을 역추적합니다. */
function collectBarrelPaths(
  seedPaths: readonly string[],
  reverseGraph: ReadonlyMap<string, ReadonlySet<string>>,
): Set<string> {
  const queue = seedPaths.filter(isCodeFile);
  const reached = new Set(queue);
  const barrels = new Set(queue.filter(isIndexModule));

  for (let index = 0; index < queue.length; index += 1) {
    const targetPath = queue[index];
    if (!targetPath) continue;
    collectImportingBarrels(targetPath, reverseGraph, reached, barrels, queue);
  }

  return barrels;
}

/** Headless 컴포넌트와 같은 워크스페이스 패키지의 manifest 경로를 찾습니다. */
function headlessManifestForPath(path: string): string | undefined {
  const match = path.match(/^(packages\/(?:react-headless|lynx-react-headless)\/[^/]+)\//);
  return match?.[1] ? `${match[1]}/package.json` : undefined;
}

/** 실제로 존재하는 Headless package.json을 공개 export 근거에 추가합니다. */
function collectHeadlessManifests(paths: Iterable<string>, files: ReadonlySet<string>): string[] {
  const manifests: string[] = [];
  for (const path of paths) {
    const manifest = headlessManifestForPath(path);
    if (manifest && files.has(manifest)) manifests.push(manifest);
  }
  return uniqueSorted(manifests);
}

/** 정규식에서 컴포넌트 이름을 리터럴로 비교할 수 있게 이스케이프합니다. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Registry 목록에서 정확한 id나 파일 경로로 등록된 항목인지 확인합니다. */
function registryManifestMentions(source: string, component: NormalizedComponent): boolean {
  const name = escapeRegExp(component.kebab);
  const idPattern = new RegExp(`\\bid\\s*:\\s*["']${name}["']`);
  const pathPattern = new RegExp(`\\bpath\\s*:\\s*["']${name}\\.(?:ts|tsx|js|jsx)["']`);
  return idPattern.test(source) || pathPattern.test(source);
}

/** React와 Lynx Registry 목록에서 대상 컴포넌트의 등록 파일을 찾습니다. */
async function collectRegistryManifestPaths(
  repositoryRoot: string,
  files: readonly string[],
  component: NormalizedComponent,
): Promise<string[]> {
  const manifests = files.filter((path) =>
    /^docs\/registry\/(?:react|lynx)\/registry-(?:ui|block|breeze|lib)\.(?:ts|tsx|js|jsx)$/.test(
      path,
    ),
  );
  const matches: string[] = [];
  for (const manifest of manifests) {
    const source = await readFile(join(repositoryRoot, manifest), "utf8");
    if (registryManifestMentions(source, component)) matches.push(manifest);
  }
  return uniqueSorted(matches);
}

/** 정확한 표면이 없을 때 부분 이름이 겹치는 실제 컴포넌트 후보를 모읍니다. */
function isAmbiguousCandidate(candidate: string, searchedName: string): boolean {
  if (!candidate || candidate === searchedName) return false;
  return candidate.includes(searchedName) || searchedName.includes(candidate);
}

/** 부분 이름이 겹치는 후보 경로 하나를 후보별 목록에 누적합니다. */
function addAmbiguousCandidate(
  candidates: Map<string, string[]>,
  rawCandidate: string,
  component: NormalizedComponent,
  path: string,
): void {
  const candidate = kebabCase(rawCandidate);
  if (!isAmbiguousCandidate(candidate, component.kebab)) return;
  const paths = candidates.get(candidate) ?? [];
  paths.push(path);
  candidates.set(candidate, paths);
}

/** 정확한 표면이 없을 때 부분 이름이 겹치는 실제 컴포넌트 후보를 모읍니다. */
function collectAmbiguities(
  files: readonly string[],
  component: NormalizedComponent,
): ComponentAmbiguity[] {
  const candidates = new Map<string, string[]>();
  for (const path of files) {
    for (const rawCandidate of componentCandidatesForPath(path)) {
      addAmbiguousCandidate(candidates, rawCandidate, component, path);
    }
  }

  return [...candidates.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([candidate, paths]) => ({ candidate, paths: uniqueSorted(paths) }));
}

/** 생성 규칙으로 파생되는 경로를 공유, React, Lynx 출력으로 분류합니다. */
function classifyGeneratedPath(path: string): ClassifiedPath | undefined {
  const rule = GENERATED_SURFACE_RULES.find(({ pattern }) => pattern.test(path));
  return rule ? { surface: rule.surface, platform: rule.platform } : undefined;
}

/** 테스트 파일과 Storybook story를 다른 구현 표면보다 먼저 판별합니다. */
function isTestPath(path: string): boolean {
  return (
    path.startsWith("docs/stories/") ||
    /(?:^|\/)(?:test|tests|__tests__)(?:\/|$)/.test(path) ||
    /\.(?:test|spec)\.[^.]+$/.test(path)
  );
}

/** 경로 명명 규칙으로 React와 Lynx 중 어느 플랫폼인지 판별합니다. */
function platformForPath(path: string): ComponentPlatform {
  return /^(?:packages\/lynx-|docs\/(?:content|registry|examples)\/lynx\/|examples\/lynx-)/.test(
    path,
  )
    ? "lynx"
    : "react";
}

/** 발견 경로를 수정 책임에 맞는 결과 표면 하나로 분류합니다. */
function classifyMatchedPath(
  path: string,
  packageExportPaths: ReadonlySet<string>,
): ClassifiedPath | undefined {
  const generated = classifyGeneratedPath(path);
  if (generated) return generated;
  if (isTestPath(path)) return { surface: "tests", platform: platformForPath(path) };
  if (packageExportPaths.has(path)) {
    return { surface: "packageExports", platform: platformForPath(path) };
  }
  const rule = STATIC_SURFACE_RULES.find(({ pattern }) => pattern.test(path));
  return rule ? { surface: rule.surface, platform: rule.platform } : undefined;
}

/** 표면과 플랫폼을 결과 버킷의 안정적인 키로 직렬화합니다. */
function bucketKey(surface: SurfaceName, platform: SurfacePlatform): BucketKey {
  return `${surface}:${platform}`;
}

/** 분류된 경로를 결과 버킷에 누적합니다. */
function addBucketPath(
  buckets: Map<BucketKey, string[]>,
  classification: ClassifiedPath,
  path: string,
): void {
  const key = bucketKey(classification.surface, classification.platform);
  const paths = buckets.get(key) ?? [];
  paths.push(path);
  buckets.set(key, paths);
}

/** 결과 버킷에서 정렬된 단일 표면 경로를 읽습니다. */
function bucketPaths(
  buckets: ReadonlyMap<BucketKey, readonly string[]>,
  surface: SurfaceName,
  platform: SurfacePlatform,
): string[] {
  return uniqueSorted(buckets.get(bucketKey(surface, platform)) ?? []);
}

/** 결과 버킷을 React와 Lynx 경로 객체로 바꿉니다. */
function platformPaths(
  buckets: ReadonlyMap<BucketKey, readonly string[]>,
  surface: SurfaceName,
): PlatformPaths {
  return {
    react: bucketPaths(buckets, surface, "react"),
    lynx: bucketPaths(buckets, surface, "lynx"),
  };
}

/** 결과 버킷을 공유, React, Lynx 경로 객체로 바꿉니다. */
function sharedPlatformPaths(
  buckets: ReadonlyMap<BucketKey, readonly string[]>,
  surface: SurfaceName,
): SharedPlatformPaths {
  return {
    shared: bucketPaths(buckets, surface, "shared"),
    ...platformPaths(buckets, surface),
  };
}

/** 하나라도 실제 표면이 발견된 플랫폼만 고정된 순서로 반환합니다. */
function availablePlatforms(
  buckets: ReadonlyMap<BucketKey, readonly string[]>,
): ComponentPlatform[] {
  return (["react", "lynx"] as const).filter((platform) =>
    [...buckets.entries()].some(([key, paths]) => key.endsWith(`:${platform}`) && paths.length > 0),
  );
}

/** 직접 컴포넌트 경로에서 패키지 공개 export로 이어지는 경로를 모읍니다. */
async function collectPackageExportPaths(
  repositoryRoot: string,
  files: readonly string[],
  exactPaths: readonly string[],
): Promise<Set<string>> {
  let barrelPaths = new Set<string>();
  if (exactPaths.some(isCodeFile)) {
    const reverseGraph = await buildReverseExportGraph(repositoryRoot, files);
    barrelPaths = collectBarrelPaths(exactPaths, reverseGraph);
  }
  const headlessManifests = collectHeadlessManifests(
    [...exactPaths, ...barrelPaths],
    new Set(files),
  );
  return new Set([...barrelPaths, ...headlessManifests]);
}

/** 직접 일치 여부와 부분 이름 후보로 조회 상태를 결정합니다. */
function resolveComponentMatch(
  files: readonly string[],
  component: NormalizedComponent,
  exactPaths: readonly string[],
  registryManifests: readonly string[],
): {
  state: ComponentMapResult["component"]["state"];
  ambiguities: ComponentAmbiguity[];
} {
  if (exactPaths.length > 0 || registryManifests.length > 0) {
    return { state: "matched", ambiguities: [] };
  }
  const ambiguities = collectAmbiguities(files, component);
  if (ambiguities.length > 0) return { state: "ambiguous", ambiguities };
  return { state: "not-found", ambiguities };
}

/** 발견 경로를 표면별 결과 버킷에 분류합니다. */
function collectPathBuckets(
  matchedPaths: readonly string[],
  packageExportPaths: ReadonlySet<string>,
): Map<BucketKey, string[]> {
  const buckets = new Map<BucketKey, string[]>();
  for (const path of matchedPaths) {
    const classification = classifyMatchedPath(path, packageExportPaths);
    if (classification) addBucketPath(buckets, classification, path);
  }
  return buckets;
}

/** 현재 SEED Design 체크아웃에서 한 컴포넌트의 원천과 공개 표면을 조회합니다. */
export async function mapSeedComponent(input: string): Promise<ComponentMapResult> {
  const component = normalizeComponentName(input);
  const repositoryRoot = await findSeedRepositoryRoot();
  const files = await listScanFiles(repositoryRoot);
  const exactPaths = files.filter((path) => pathMatchesComponent(path, component));
  const registryManifests = await collectRegistryManifestPaths(repositoryRoot, files, component);
  const packageExportPaths = await collectPackageExportPaths(repositoryRoot, files, exactPaths);
  const matchedPaths = uniqueSorted([...exactPaths, ...registryManifests, ...packageExportPaths]);
  const { state, ambiguities } = resolveComponentMatch(
    files,
    component,
    exactPaths,
    registryManifests,
  );
  const buckets = collectPathBuckets(matchedPaths, packageExportPaths);

  return {
    component: { ...component, state },
    platforms: availablePlatforms(buckets),
    rootage: bucketPaths(buckets, "rootage", "shared"),
    recipeSources: platformPaths(buckets, "recipeSources"),
    generatedOutputs: sharedPlatformPaths(buckets, "generatedOutputs"),
    headless: platformPaths(buckets, "headless"),
    implementations: platformPaths(buckets, "implementations"),
    packageExports: platformPaths(buckets, "packageExports"),
    registry: platformPaths(buckets, "registry"),
    docs: sharedPlatformPaths(buckets, "docs"),
    examples: platformPaths(buckets, "examples"),
    tests: platformPaths(buckets, "tests"),
    ambiguities,
  };
}

/** CLI 인자를 검증하고 컴포넌트 맵 JSON을 표준 출력에 씁니다. */
async function runCli(args: string[]): Promise<void> {
  try {
    if (args.length !== 1 || !args[0]) {
      throw new Error("사용법: bun skills/seed-component-map/scripts/component-map.ts <component>");
    }
    const result = await mapSeedComponent(args[0]);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  await runCli(Bun.argv.slice(2));
}
