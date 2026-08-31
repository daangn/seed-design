import type { Dirent } from "node:fs";
import { lstat, readFile, readdir, realpath, stat } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

type TargetState = "matched" | "ambiguous" | "not-found";
type ManifestState = "matched" | "missing" | "invalid" | "entry-missing" | "not-checked";
type BundleState = "ready" | "missing" | "invalid" | "manifest-unavailable" | "not-checked";
type RuntimePreparation = "ready" | "build-required" | "target-required";

export interface LynxExampleCandidate {
  id: `lynx/${string}/${string}`;
  entryPath: string;
}

export interface LynxExampleResolution {
  target: {
    input: string;
    state: TargetState;
    id?: LynxExampleCandidate["id"];
    candidates: LynxExampleCandidate[];
  };
  entry: { path: string } | null;
  manifest: {
    path: string;
    state: ManifestState;
    reason?: string;
  };
  bundles: {
    web: BundleResolution;
    native: BundleResolution;
  };
  build: {
    command: string;
    required: boolean | null;
  };
  runtimeEvidence: {
    webLynx: RuntimeEvidencePlan;
    lynx: RuntimeEvidencePlan;
  };
}

interface BundleResolution {
  state: BundleState;
  manifestUrl?: string;
  path?: string;
}

type BundleKind = "web" | "native";

interface RuntimeEvidencePlan {
  state: "not-collected";
  preparation: RuntimePreparation;
  staticEvidence: string[];
  requiredEvidence: string[];
}

interface ParsedTarget {
  input: string;
  exactId?: LynxExampleCandidate["id"];
  query?: string;
}

interface LynxManifestEntry {
  web: string;
  lynx: string;
}

interface ManifestEntryResolution {
  state: ManifestState;
  entry?: LynxManifestEntry;
  reason?: string;
}

interface TargetSelection {
  state: TargetState;
  matches: LynxExampleCandidate[];
}

const REPOSITORY_NAME = "@seed-design/project";
const EXAMPLES_DIRECTORY = "docs/examples/lynx";
const MANIFEST_PATH = "docs/public/__lynx__/manifest.json";
const PUBLIC_DIRECTORY = "docs/public/__lynx__";
const BUILD_COMMAND = "bun --filter @seed-design/docs build:lynx-examples";
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9 _-]{0,119}$/;

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

function toPosixPath(path: string): string {
  return path.split(sep).join("/");
}

function kebabCase(value: string): string {
  return value
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function normalizeSegment(value: string): string {
  if (!SEGMENT.test(value)) {
    throw new Error("예제 이름에는 영문, 숫자, 공백, 밑줄과 하이픈만 사용할 수 있습니다.");
  }
  return kebabCase(value);
}

function assertRelativeTarget(value: string): void {
  if (value.startsWith("/")) {
    throw new Error("Lynx 예제 대상은 저장소 안의 상대 이름이나 경로여야 합니다.");
  }
  if (value.split("/").some((segment) => segment === "..")) {
    throw new Error("Lynx 예제 대상은 저장소 안의 상대 이름이나 경로여야 합니다.");
  }
}

function stripKnownTargetPrefix(value: string): string {
  if (value.startsWith(`${EXAMPLES_DIRECTORY}/`)) {
    return value.slice(`${EXAMPLES_DIRECTORY}/`.length);
  }
  if (value.startsWith("lynx/")) return value.slice("lynx/".length);
  return value;
}

function stripSourceExtension(value: string): string {
  return value.endsWith(".tsx") ? value.slice(0, -4) : value;
}

function exactTarget(input: string, segments: string[]): ParsedTarget {
  const component = segments[0];
  const scenario = segments[1];
  if (!component) throw new Error("Lynx 예제 컴포넌트 이름이 비어 있습니다.");
  if (!scenario) throw new Error("Lynx 예제 시나리오 이름이 비어 있습니다.");
  return {
    input,
    exactId: `lynx/${normalizeSegment(component)}/${normalizeSegment(scenario)}`,
  };
}

function queryTarget(input: string, segment: string | undefined): ParsedTarget {
  if (!segment) throw new Error("Lynx 예제 대상은 비어 있을 수 없습니다.");
  return { input, query: normalizeSegment(segment) };
}

function parseTarget(input: string): ParsedTarget {
  const trimmed = input.trim().replaceAll("\\", "/");
  if (!trimmed) throw new Error("Lynx 예제 대상은 비어 있을 수 없습니다.");
  assertRelativeTarget(trimmed);

  const value = stripSourceExtension(stripKnownTargetPrefix(trimmed));
  const segments = value.split("/").filter(Boolean);
  if (segments.length === 2) return exactTarget(input, segments);
  if (segments.length === 1) return queryTarget(input, segments[0]);
  throw new Error("예제 대상은 <component> 또는 lynx/<component>/<scenario> 형식이어야 합니다.");
}

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

async function findSeedRepositoryRoot(start = process.cwd()): Promise<string> {
  let current = await realpath(start);
  for (;;) {
    if ((await readRepositoryName(current)) === REPOSITORY_NAME) return current;
    const parent = dirname(current);
    if (parent === current) throw new Error("SEED Design 저장소 안에서 실행해야 합니다.");
    current = parent;
  }
}

async function readDirectory(directory: string): Promise<Dirent[]> {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return [];
    throw error;
  }
}

async function isRegularFile(path: string): Promise<boolean> {
  try {
    const file = await stat(path);
    return file.isFile() && file.size > 0;
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return false;
    throw error;
  }
}

async function discoverComponentEntries(
  repositoryRoot: string,
  examplesRoot: string,
  component: Dirent,
): Promise<LynxExampleCandidate[]> {
  const componentDirectory = join(examplesRoot, component.name);
  if (!(await isUsableComponentDirectory(component, componentDirectory))) return [];

  const candidates: LynxExampleCandidate[] = [];
  for (const scenario of await readDirectory(componentDirectory)) {
    if (!isExampleSource(scenario)) continue;
    candidates.push(exampleCandidate(repositoryRoot, componentDirectory, component.name, scenario));
  }
  return candidates;
}

async function isUsableComponentDirectory(component: Dirent, path: string): Promise<boolean> {
  if (!component.isDirectory()) return false;
  if (component.isSymbolicLink()) return false;
  return !(await lstat(path)).isSymbolicLink();
}

function isExampleSource(entry: Dirent): boolean {
  if (!entry.isFile()) return false;
  if (entry.isSymbolicLink()) return false;
  return entry.name.endsWith(".tsx");
}

function exampleCandidate(
  repositoryRoot: string,
  componentDirectory: string,
  component: string,
  scenario: Dirent,
): LynxExampleCandidate {
  const scenarioName = scenario.name.slice(0, -4);
  return {
    id: `lynx/${component}/${scenarioName}`,
    entryPath: toPosixPath(relative(repositoryRoot, join(componentDirectory, scenario.name))),
  };
}

async function discoverExamples(repositoryRoot: string): Promise<LynxExampleCandidate[]> {
  const examplesRoot = join(repositoryRoot, EXAMPLES_DIRECTORY);
  const candidates = (
    await Promise.all(
      (
        await readDirectory(examplesRoot)
      ).map((entry) => discoverComponentEntries(repositoryRoot, examplesRoot, entry)),
    )
  ).flat();
  return candidates.sort((left, right) => left.id.localeCompare(right.id));
}

function selectExactId(
  exactId: LynxExampleCandidate["id"],
  candidates: LynxExampleCandidate[],
): TargetSelection {
  const match = candidates.find(({ id }) => id === exactId);
  return match ? { state: "matched", matches: [match] } : { state: "not-found", matches: [] };
}

function candidateNames(id: LynxExampleCandidate["id"]): [string, string] {
  const [, component = "", scenario = ""] = id.split("/");
  return [component, scenario];
}

function matchesExactName(candidate: LynxExampleCandidate, query: string): boolean {
  const [component, scenario] = candidateNames(candidate.id);
  return component === query || scenario === query;
}

function matchesPartialName(candidate: LynxExampleCandidate, query: string): boolean {
  const [component, scenario] = candidateNames(candidate.id);
  return component.includes(query) || scenario.includes(query);
}

function selectExactNames(matches: LynxExampleCandidate[]): TargetSelection | undefined {
  if (matches.length === 1) return { state: "matched", matches };
  if (matches.length > 1) return { state: "ambiguous", matches };
  return undefined;
}

function selectPartialNames(matches: LynxExampleCandidate[]): TargetSelection {
  return matches.length > 0 ? { state: "ambiguous", matches } : { state: "not-found", matches: [] };
}

function matchingCandidates(
  target: ParsedTarget,
  candidates: LynxExampleCandidate[],
): TargetSelection {
  if (target.exactId) return selectExactId(target.exactId, candidates);
  const query = target.query;
  if (!query) return { state: "not-found", matches: [] };

  const exact = selectExactNames(
    candidates.filter((candidate) => matchesExactName(candidate, query)),
  );
  if (exact) return exact;
  return selectPartialNames(candidates.filter((candidate) => matchesPartialName(candidate, query)));
}

async function readManifestSource(repositoryRoot: string): Promise<string | undefined> {
  try {
    return await readFile(join(repositoryRoot, MANIFEST_PATH), "utf8");
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return undefined;
    throw error;
  }
}

type JsonResult = { state: "parsed"; value: unknown } | { state: "invalid"; reason: string };

function parseJson(source: string): JsonResult {
  try {
    return { state: "parsed", value: JSON.parse(source) };
  } catch (error) {
    return {
      state: "invalid",
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type ManifestExamplesResult =
  | { state: "valid"; examples: Record<string, unknown> }
  | { state: "invalid"; reason: string };

function readManifestExamples(value: unknown): ManifestExamplesResult {
  if (!isRecord(value)) {
    return { state: "invalid", reason: "Lynx manifest가 객체가 아닙니다." };
  }
  if (value.schemaVersion !== 1) {
    return { state: "invalid", reason: "지원하는 schemaVersion 1 manifest가 아닙니다." };
  }
  if (!isRecord(value.examples)) {
    return { state: "invalid", reason: "Lynx manifest에 examples 객체가 없습니다." };
  }
  return { state: "valid", examples: value.examples };
}

function validateManifestEntry(
  value: unknown,
  id: LynxExampleCandidate["id"],
): ManifestEntryResolution {
  if (!isRecord(value)) {
    return { state: "invalid", reason: `${id} manifest entry가 객체가 아닙니다.` };
  }
  if (typeof value.web !== "string") {
    return { state: "invalid", reason: `${id}의 web bundle 경로가 없습니다.` };
  }
  if (typeof value.lynx !== "string") {
    return { state: "invalid", reason: `${id}의 lynx bundle 경로가 없습니다.` };
  }
  return { state: "matched", entry: { web: value.web, lynx: value.lynx } };
}

async function readManifestEntry(
  repositoryRoot: string,
  id: LynxExampleCandidate["id"],
): Promise<ManifestEntryResolution> {
  const source = await readManifestSource(repositoryRoot);
  if (source === undefined) return { state: "missing" };

  const parsed = parseJson(source);
  if (parsed.state === "invalid") return parsed;
  const manifest = readManifestExamples(parsed.value);
  if (manifest.state === "invalid") return manifest;
  const value = manifest.examples[id];
  if (value === undefined) return { state: "entry-missing" };
  return validateManifestEntry(value, id);
}

function relativeBundlePath(manifestUrl: string): string | undefined {
  const prefix = "/__lynx__/";
  if (!manifestUrl.startsWith(prefix)) return undefined;
  const relativeBundle = manifestUrl.slice(prefix.length);
  if (isInvalidRelativeBundle(relativeBundle)) return undefined;
  return relativeBundle;
}

function isInvalidRelativeBundle(path: string): boolean {
  return !path || path.includes("\\") || path.includes("?") || path.includes("#");
}

function hasExpectedBundleSuffix(manifestUrl: string, kind: BundleKind): boolean {
  return manifestUrl.endsWith(kind === "web" ? ".web.bundle" : ".lynx.bundle");
}

function isInsideDirectory(path: string, directory: string): boolean {
  const pathFromDirectory = relative(directory, path);
  if (pathFromDirectory === "..") return false;
  if (pathFromDirectory.startsWith(`..${sep}`)) return false;
  return !pathFromDirectory.startsWith(sep);
}

function bundleFilePath(repositoryRoot: string, manifestUrl: string): string | undefined {
  const relativeBundle = relativeBundlePath(manifestUrl);
  if (!relativeBundle) return undefined;
  const publicDirectory = join(repositoryRoot, PUBLIC_DIRECTORY);
  const absolutePath = join(publicDirectory, relativeBundle);
  return isInsideDirectory(absolutePath, publicDirectory) ? absolutePath : undefined;
}

async function resolveExistingBundle(
  repositoryRoot: string,
  manifestUrl: string,
): Promise<BundleResolution> {
  const absolutePath = bundleFilePath(repositoryRoot, manifestUrl);
  if (!absolutePath) return { state: "invalid", manifestUrl };
  return {
    state: (await isRegularFile(absolutePath)) ? "ready" : "missing",
    manifestUrl,
    path: toPosixPath(relative(repositoryRoot, absolutePath)),
  };
}

async function resolveBundle(
  repositoryRoot: string,
  manifestState: ManifestState,
  manifestUrl: string | undefined,
  kind: BundleKind,
): Promise<BundleResolution> {
  if (manifestState !== "matched") return { state: "manifest-unavailable" };
  if (!manifestUrl) return { state: "manifest-unavailable" };
  if (!hasExpectedBundleSuffix(manifestUrl, kind)) return { state: "invalid", manifestUrl };
  return resolveExistingBundle(repositoryRoot, manifestUrl);
}

function runtimePlan(
  preparation: RuntimePreparation,
  staticEvidence: string[],
  environment: "webLynx" | "lynx",
): RuntimeEvidencePlan {
  return {
    state: "not-collected",
    preparation,
    staticEvidence,
    requiredEvidence:
      environment === "webLynx"
        ? ["실제 LynxComponentExample 주소", "확인한 구조와 상호작용"]
        : ["정확한 client ID", "기존 Lynx session ID", "확인한 DOM, style, box 또는 screenshot"],
  };
}

function unresolvedResult(
  target: ParsedTarget,
  state: Exclude<TargetState, "matched">,
  candidates: LynxExampleCandidate[],
): LynxExampleResolution {
  return {
    target: { input: target.input, state, candidates },
    entry: null,
    manifest: { path: MANIFEST_PATH, state: "not-checked" },
    bundles: { web: { state: "not-checked" }, native: { state: "not-checked" } },
    build: { command: BUILD_COMMAND, required: null },
    runtimeEvidence: {
      webLynx: runtimePlan("target-required", [], "webLynx"),
      lynx: runtimePlan("target-required", [], "lynx"),
    },
  };
}

async function resolveRepositoryRoot(repositoryRoot: string | undefined): Promise<string> {
  return repositoryRoot ? realpath(repositoryRoot) : findSeedRepositoryRoot();
}

function manifestBundleUrl(
  manifest: ManifestEntryResolution,
  platform: keyof LynxManifestEntry,
): string | undefined {
  if (!manifest.entry) return undefined;
  return manifest.entry[platform];
}

function buildIsRequired(
  manifest: ManifestEntryResolution,
  web: BundleResolution,
  native: BundleResolution,
): boolean {
  if (manifest.state !== "matched") return true;
  if (web.state !== "ready") return true;
  return native.state !== "ready";
}

function staticEvidence(entryPath: string, bundle: BundleResolution): string[] {
  if (bundle.state !== "ready") return [entryPath];
  if (!bundle.path) return [entryPath];
  return [entryPath, MANIFEST_PATH, bundle.path];
}

function runtimePreparation(bundle: BundleResolution): RuntimePreparation {
  return bundle.state === "ready" ? "ready" : "build-required";
}

function manifestResult(manifest: ManifestEntryResolution): LynxExampleResolution["manifest"] {
  const base = { path: MANIFEST_PATH, state: manifest.state };
  return manifest.reason ? { ...base, reason: manifest.reason } : base;
}

function resolvedResult(input: {
  target: ParsedTarget;
  candidate: LynxExampleCandidate;
  manifest: ManifestEntryResolution;
  web: BundleResolution;
  native: BundleResolution;
}): LynxExampleResolution {
  const buildRequired = buildIsRequired(input.manifest, input.web, input.native);
  return {
    target: {
      input: input.target.input,
      state: "matched",
      id: input.candidate.id,
      candidates: [],
    },
    entry: { path: input.candidate.entryPath },
    manifest: manifestResult(input.manifest),
    bundles: { web: input.web, native: input.native },
    build: { command: BUILD_COMMAND, required: buildRequired },
    runtimeEvidence: {
      webLynx: runtimePlan(
        runtimePreparation(input.web),
        staticEvidence(input.candidate.entryPath, input.web),
        "webLynx",
      ),
      lynx: runtimePlan(
        runtimePreparation(input.native),
        staticEvidence(input.candidate.entryPath, input.native),
        "lynx",
      ),
    },
  };
}

export async function resolveLynxExample(
  input: string,
  repositoryRoot?: string,
): Promise<LynxExampleResolution> {
  const target = parseTarget(input);
  const root = await resolveRepositoryRoot(repositoryRoot);
  const selection = matchingCandidates(target, await discoverExamples(root));
  if (selection.state !== "matched") {
    return unresolvedResult(target, selection.state, selection.matches);
  }

  const candidate = selection.matches[0];
  if (!candidate) return unresolvedResult(target, "not-found", []);
  const manifest = await readManifestEntry(root, candidate.id);
  const [web, native] = await Promise.all([
    resolveBundle(root, manifest.state, manifestBundleUrl(manifest, "web"), "web"),
    resolveBundle(root, manifest.state, manifestBundleUrl(manifest, "lynx"), "native"),
  ]);
  return resolvedResult({ target, candidate, manifest, web, native });
}

async function runCli(args: string[]): Promise<void> {
  try {
    if (args.length !== 1 || !args[0]) {
      throw new Error(
        "사용법: bun skills/seed-verify-lynx-example/scripts/resolve-example.ts <component|example>",
      );
    }
    process.stdout.write(`${JSON.stringify(await resolveLynxExample(args[0]), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) await runCli(Bun.argv.slice(2));
