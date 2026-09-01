import { readFile, realpath } from "node:fs/promises";
import { basename, dirname, extname, join, posix, relative, sep } from "node:path";
import {
  mapSeedComponent,
  type ComponentMapResult,
  type ComponentPlatform,
} from "../../seed-component-map/scripts/component-map";

export type ApiParityDimensionName =
  | "exports"
  | "props"
  | "variants"
  | "slots"
  | "state"
  | "event"
  | "accessibility"
  | "registry"
  | "docs";

export interface ApiParityDimension {
  react: string[];
  lynx: string[];
  common: string[];
  reactOnly: string[];
  lynxOnly: string[];
  confidence: "confirmed" | "partial" | "unknown";
  evidence: string[];
}

export type PlatformDifferenceCategory =
  | "composition"
  | "accessibility"
  | "heading"
  | "focus"
  | "responsive-styling";

export interface ExpectedPlatformDifference {
  id: string;
  category: PlatformDifferenceCategory;
  react: string;
  lynx: string;
  reason: string;
  evidence: string[];
}

export interface PlatformDifferenceReview {
  dimension: ApiParityDimensionName;
  reactObservedOnly: string[];
  lynxObservedOnly: string[];
  possiblyExplainedBy: PossiblePlatformDifferenceExplanation[];
  confidence: ApiParityDimension["confidence"];
  reason: string;
  evidence: string[];
}

export interface PossiblePlatformDifferenceExplanation {
  id: string;
  reactObservedOnly: string[];
  lynxObservedOnly: string[];
}

export interface PlatformDifferences {
  expected: ExpectedPlatformDifference[];
  needsReview: PlatformDifferenceReview[];
}

interface PlatformCandidates {
  implementation: string[];
  publicApi: string[];
  recipes: string[];
  registry: string[];
  docs: string[];
}

interface SourceFacts {
  exports: string[];
  props: string[];
  propsComplete: boolean;
  variants: string[];
  slots: string[];
  state: string[];
  event: string[];
  accessibility: string[];
}

interface SourceEntry {
  path: string;
  source: string;
}

interface PlatformConstraintRule extends Omit<ExpectedPlatformDifference, "evidence"> {
  evidencePattern: RegExp;
  apiNamePattern: RegExp;
}

export interface ApiParityResult {
  component: ComponentMapResult["component"];
  sources: Record<ComponentPlatform, PlatformCandidates>;
  dimensions: Record<ApiParityDimensionName, ApiParityDimension>;
  platformDifferences: PlatformDifferences;
  warnings: string[];
  readOnly: true;
}

const REPOSITORY_NAME = "@seed-design/project";
const MODULE_EXTENSIONS = [".ts", ".tsx", ".mts", ".mjs", ".js", ".jsx"] as const;
const STATE_NAMES = new Set([
  "checked",
  "defaultChecked",
  "defaultOpen",
  "defaultValue",
  "disabled",
  "expanded",
  "loading",
  "open",
  "pending",
  "pressed",
  "selected",
  "show",
  "value",
]);
const PLATFORM_CONSTRAINT_RULES: PlatformConstraintRule[] = [
  {
    id: "slot-composition",
    category: "composition",
    react: "DOM 요소를 교체하거나 합성할 때 asChild와 Slot 패턴을 사용할 수 있습니다.",
    lynx: "네이티브 요소를 직접 렌더링하며 Slot 기반 asChild를 제공하지 않습니다.",
    reason: "DOM Slot 합성과 Lynx 네이티브 요소 렌더링은 요소 구성 모델이 다릅니다.",
    evidencePattern:
      /(?:asChild.{0,120}(?:미지원|지원하지|제공하지|없(?:음|습니다)))|(?:Slot 기반.{0,120}(?:미지원|지원하지|제공하지|없(?:음|습니다)))/is,
    apiNamePattern: /^(?:as|asChild)$/,
  },
  {
    id: "native-accessibility-properties",
    category: "accessibility",
    react: "브라우저 DOM의 role과 aria-* 속성으로 의미와 상태를 전달합니다.",
    lynx: "accessibility-label, accessibility-role-description, accessibility-value 같은 네이티브 접근성 속성을 사용합니다.",
    reason: "두 렌더러가 접근성 트리에 의미를 전달하는 속성 체계가 다릅니다.",
    evidencePattern:
      /(?:DOM\s+ARIA.{0,160}(?:대신|대체|미지원|없(?:음|습니다)))|(?:aria-label.{0,120}대신.{0,120}accessibility-label)/is,
    apiNamePattern: /^(?:aria(?:-|[A-Z])|role$|accessibility)/,
  },
  {
    id: "native-heading-semantics",
    category: "heading",
    react: "HTML heading 요소와 headingLevel 또는 aria-level로 문서 구조의 단계를 표현합니다.",
    lynx: "accessibility-heading으로 heading 의미를 전달하며 HTML heading level은 받지 않습니다.",
    reason: "Lynx 네이티브 heading 접근성 표면에는 HTML 문서 개요의 단계 모델이 없습니다.",
    evidencePattern:
      /(?:headingLevel.{0,120}(?:받지|미지원|지원하지|없(?:음|습니다)))|(?:HTML heading.{0,160}(?:대신|대체).{0,120}accessibility-heading)/is,
    apiNamePattern: /^(?:headingLevel|aria-level|accessibility-heading)$/,
  },
  {
    id: "keyboard-focus-model",
    category: "focus",
    react: "키보드 focus와 focusVisible, 방향키 탐색을 브라우저 포커스 모델로 처리합니다.",
    lynx: "웹 키보드 포커스 모델 대신 네이티브 tap과 접근성 탐색을 사용합니다.",
    reason: "터치 중심 Lynx 화면과 브라우저의 키보드 포커스 이동 모델이 다릅니다.",
    evidencePattern:
      /(?:키보드 (?:포커스|focus).{0,160}(?:미지원|지원하지|없(?:음|습니다)))|(?:focus\s*\/\s*focusVisible.{0,120}(?:미지원|지원하지|없(?:음|습니다)))/is,
    apiNamePattern: /^(?:focus|focusVisible|isFocused|isFocusVisible)$/,
  },
  {
    id: "css-media-queries",
    category: "responsive-styling",
    react: "CSS media query와 반응형 variant로 화면 너비별 스타일을 전환할 수 있습니다.",
    lynx: "CSS @media 대신 viewport 단위, JavaScript 분기 또는 별도 Recipe 값이 필요합니다.",
    reason: "Lynx 런타임은 CSS @media 규칙을 지원하지 않습니다.",
    evidencePattern:
      /(?:@media|media query|미디어 쿼리).{0,160}(?:미지원|지원하지|제공하지|없(?:음|습니다))/is,
    apiNamePattern: /^(?:hideFrom|responsive)$/,
  },
];

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function repositoryName(directory: string): Promise<string | undefined> {
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

async function findRepositoryRoot(start = process.cwd()): Promise<string> {
  let current = await realpath(start);
  for (;;) {
    if ((await repositoryName(current)) === REPOSITORY_NAME) return current;
    const parent = dirname(current);
    if (parent === current) throw new Error("SEED Design 저장소 안에서 실행해야 합니다.");
    current = parent;
  }
}

function isPublicImplementation(path: string, component: ComponentMapResult["component"]): boolean {
  const file = basename(path);
  const stem = basename(file, extname(file)).toLocaleLowerCase();
  return file.includes(".namespace.") || stem === component.pascal.toLocaleLowerCase();
}

function isComponentApiModule(path: string): boolean {
  const file = basename(path);
  return file.startsWith("index.") || file.includes(".namespace.");
}

function isNamespaceModule(path: string): boolean {
  return basename(path).includes(".namespace.");
}

function isComponentNamespace(path: string, component: ComponentMapResult["component"]): boolean {
  return basename(path).startsWith(`${component.pascal}.namespace.`);
}

function belongsToComponentSurface(
  path: string,
  implementationDirectories: ReadonlySet<string>,
  component: ComponentMapResult["component"],
): boolean {
  return (
    implementationDirectories.has(posix.dirname(path)) ||
    path.includes(`/components/${component.pascal}/`) ||
    path.includes(`/primitive/${component.pascal}/`)
  );
}

function componentPublicModulesFor(
  implementation: readonly string[],
  packageExports: readonly string[],
  component: ComponentMapResult["component"],
): string[] {
  const implementationDirectories = new Set(implementation.map((path) => posix.dirname(path)));
  return packageExports.filter(
    (path) =>
      isNamespaceModule(path) ||
      (isComponentApiModule(path) &&
        belongsToComponentSurface(path, implementationDirectories, component)),
  );
}

function candidatesFor(map: ComponentMapResult, platform: ComponentPlatform): PlatformCandidates {
  const implementation = uniqueSorted([
    ...map.headless[platform],
    ...map.implementations[platform],
  ]);
  const componentModules = componentPublicModulesFor(
    implementation,
    map.packageExports[platform],
    map.component,
  );
  const indirectNamespaces = componentModules.filter(
    (path) => isNamespaceModule(path) && !isComponentNamespace(path, map.component),
  );
  return {
    implementation,
    publicApi:
      indirectNamespaces.length > 0
        ? indirectNamespaces
        : uniqueSorted([
            ...implementation.filter((path) => isPublicImplementation(path, map.component)),
            ...componentModules,
          ]),
    recipes: map.recipeSources[platform],
    registry: map.registry[platform],
    docs: map.docs[platform],
  };
}

type Quote = "'" | '"' | "`";

interface QuoteState {
  quote?: Quote;
  escaped: boolean;
}

interface KeyScanState extends QuoteState {
  curlyDepth: number;
  squareDepth: number;
  parenDepth: number;
}

type DepthKey = "curlyDepth" | "squareDepth" | "parenDepth";

const DEPTH_CHANGES: Partial<Record<string, [DepthKey, number]>> = {
  "{": ["curlyDepth", 1],
  "}": ["curlyDepth", -1],
  "[": ["squareDepth", 1],
  "]": ["squareDepth", -1],
  "(": ["parenDepth", 1],
  ")": ["parenDepth", -1],
};

function isQuote(character: string | undefined): character is Quote {
  return character === "'" || character === '"' || character === "`";
}

function consumeQuotedCharacter(state: QuoteState, character: string | undefined): boolean {
  if (!state.quote) return false;
  if (state.escaped) state.escaped = false;
  else if (character === "\\") state.escaped = true;
  else if (character === state.quote) state.quote = undefined;
  return true;
}

function updateBalancedDepth(depth: number, character: string | undefined): number {
  if (character === "{") return depth + 1;
  if (character === "}") return depth - 1;
  return depth;
}

function balancedBody(source: string, openingBrace: number): string | undefined {
  const quoteState: QuoteState = { escaped: false };
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    const character = source[index];
    if (consumeQuotedCharacter(quoteState, character)) continue;
    if (isQuote(character)) {
      quoteState.quote = character;
      continue;
    }
    depth = updateBalancedDepth(depth, character);
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }
  return undefined;
}

function commentEnd(body: string, index: number): number | undefined {
  if (body.startsWith("//", index)) {
    const end = body.indexOf("\n", index + 2);
    return end < 0 ? body.length : end;
  }
  if (body.startsWith("/*", index)) {
    const end = body.indexOf("*/", index + 2);
    return end < 0 ? body.length : end + 2;
  }
  return undefined;
}

function atTopLevel(state: KeyScanState): boolean {
  return state.curlyDepth === 0 && state.squareDepth === 0 && state.parenDepth === 0;
}

function propertyMatch(body: string, index: number): RegExpMatchArray | undefined {
  return (
    body
      .slice(index)
      .match(/^(?:readonly\s+)?(?:([A-Za-z_$][\w$-]*)|["']([^"']+)["'])\??\s*[:(]/) ?? undefined
  );
}

function propertyName(match: RegExpMatchArray): string | undefined {
  if (match[1]) return match[1];
  return match[2];
}

function propertyAt(
  body: string,
  index: number,
  state: KeyScanState,
): { end: number; name: string } | undefined {
  if (!atTopLevel(state)) return undefined;
  const match = propertyMatch(body, index);
  if (!match) return undefined;
  const name = propertyName(match);
  if (!name) return undefined;
  return { end: index + match[0].length, name };
}

function updateDepth(state: KeyScanState, character: string): void {
  const change = DEPTH_CHANGES[character];
  if (!change) return;
  const [key, amount] = change;
  state[key] = Math.max(0, state[key] + amount);
}

function scanSyntaxCharacter(body: string, index: number, state: KeyScanState): number {
  const character = body[index] ?? "";
  if (consumeQuotedCharacter(state, character)) return index + 1;
  if (isQuote(character)) state.quote = character;
  else updateDepth(state, character);
  return index + 1;
}

function scanTopLevelToken(
  body: string,
  index: number,
  state: KeyScanState,
  keys: Set<string>,
): number {
  const afterComment = commentEnd(body, index);
  if (afterComment !== undefined) return afterComment;
  const property = propertyAt(body, index, state);
  if (property) {
    keys.add(property.name);
    return property.end;
  }
  return scanSyntaxCharacter(body, index, state);
}

function topLevelKeys(body: string): string[] {
  const keys = new Set<string>();
  const state: KeyScanState = {
    curlyDepth: 0,
    squareDepth: 0,
    parenDepth: 0,
    escaped: false,
  };
  let index = 0;
  while (index < body.length) index = scanTopLevelToken(body, index, state, keys);
  return uniqueSorted(keys);
}

function extractProps(source: string): string[] {
  const props = new Set<string>();
  const declarations = [
    /export\s+interface\s+[A-Za-z_$][\w$]*Props\b[^{]*{/g,
    /export\s+type\s+[A-Za-z_$][\w$]*Props\s*=\s*{/g,
  ];
  for (const declaration of declarations) {
    for (const match of source.matchAll(declaration)) {
      const openingBrace = source.indexOf("{", match.index);
      const body = balancedBody(source, openingBrace);
      if (body) for (const prop of topLevelKeys(body)) props.add(prop);
    }
  }
  return uniqueSorted(props);
}

function hasUnresolvedProps(source: string): boolean {
  if (/export\s+interface\s+[A-Za-z_$][\w$]*Props\b[^{]*\bextends\b/.test(source)) {
    return true;
  }
  for (const match of source.matchAll(/export\s+type\s+[A-Za-z_$][\w$]*Props\s*=\s*/g)) {
    const valueStart = (match.index ?? 0) + match[0].length;
    if (!source.slice(valueStart).trimStart().startsWith("{")) return true;
  }
  return false;
}

function declarationExports(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(
    /\bexport\s+(?:declare\s+)?(?:const|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    if (match[1]) names.add(match[1]);
  }
  return uniqueSorted(names);
}

function exportedBlockName(item: string): string | undefined {
  const cleaned = item.replace(/^\s*type\s+/, "").trim();
  return (
    cleaned.match(/\bas\s+([A-Za-z_$][\w$]*)$/)?.[1] ?? cleaned.match(/^([A-Za-z_$][\w$]*)/)?.[1]
  );
}

function blockExports(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(/\bexport\s+(?:type\s+)?\{([\s\S]*?)\}\s*from\b/g)) {
    for (const item of (match[1] ?? "").split(",")) {
      const name = exportedBlockName(item);
      if (name) names.add(name);
    }
  }
  return uniqueSorted(names);
}

function componentAliasName(
  item: string,
  component: ComponentMapResult["component"],
): string | undefined {
  const cleaned = item.replace(/^\s*type\s+/, "").trim();
  const original = cleaned.match(/^([A-Za-z_$][\w$]*)/)?.[1];
  if (!original?.startsWith(component.pascal)) return undefined;
  return exportedBlockName(item);
}

function componentAliasExports(
  source: string,
  component: ComponentMapResult["component"],
): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(/\bexport\s+(?:type\s+)?\{([\s\S]*?)\}\s*from\b/g)) {
    for (const item of (match[1] ?? "").split(",")) {
      const name = componentAliasName(item, component);
      if (name) names.add(name);
    }
  }
  return uniqueSorted(names);
}

function namespaceExportsFor(
  path: string,
  source: string,
  component: ComponentMapResult["component"],
): string[] {
  if (!isNamespaceModule(path)) return [];
  return isComponentNamespace(path, component)
    ? extractExports(source)
    : componentAliasExports(source, component);
}

function namespaceExports(source: string): string[] {
  return uniqueSorted(
    [...source.matchAll(/\bexport\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\b/g)].flatMap((match) =>
      match[1] ? [match[1]] : [],
    ),
  );
}

function extractExports(source: string): string[] {
  return uniqueSorted([
    ...declarationExports(source),
    ...blockExports(source),
    ...namespaceExports(source),
  ]);
}

function starReexportSpecifiers(source: string): string[] {
  return uniqueSorted(
    [
      ...source.matchAll(/\bexport\s+\*(?:\s+as\s+[A-Za-z_$][\w$]*)?\s+from\s*["']([^"']+)["']/g),
    ].flatMap((match) => (match[1] ? [match[1]] : [])),
  );
}

function resolvePublicReexport(
  sourcePath: string,
  specifier: string,
  available: ReadonlySet<string>,
): string | undefined {
  if (!specifier.startsWith(".")) return undefined;
  const base = posix.normalize(posix.join(posix.dirname(sourcePath), specifier));
  return [
    base,
    ...MODULE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...MODULE_EXTENSIONS.map((extension) => `${base}/index${extension}`),
  ].find((path) => available.has(path));
}

function enqueuePublicReexports(
  sourcePath: string,
  source: string,
  available: ReadonlySet<string>,
  included: Set<string>,
  queue: string[],
): void {
  for (const specifier of starReexportSpecifiers(source)) {
    const target = resolvePublicReexport(sourcePath, specifier, available);
    if (!target || included.has(target)) continue;
    included.add(target);
    queue.push(target);
  }
}

function publicExportSources(paths: readonly string[], sources: readonly string[]): string[] {
  const sourceByPath = new Map(paths.map((path, index) => [path, sources[index] ?? ""]));
  const available = new Set(paths);
  const queue = paths.filter((path) => basename(path).startsWith("index."));
  const included = new Set(queue);
  for (let index = 0; index < queue.length; index += 1) {
    const path = queue[index];
    if (!path) continue;
    enqueuePublicReexports(path, sourceByPath.get(path) ?? "", available, included, queue);
  }
  return [...included].flatMap((path) =>
    sourceByPath.has(path) ? [sourceByPath.get(path) ?? ""] : [],
  );
}

function extractSlots(source: string): string[] {
  const slots = new Set<string>();
  const slotBlock = source.match(/\bslots\s*:\s*\[([\s\S]*?)\]/)?.[1];
  if (!slotBlock) return [];
  for (const match of slotBlock.matchAll(/["']([^"']+)["']/g)) {
    if (match[1]) slots.add(match[1]);
  }
  return uniqueSorted(slots);
}

function extractVariants(source: string): string[] {
  const variantsStart = source.search(/\bvariants\s*:\s*\{/);
  if (variantsStart < 0) return [];
  const openingBrace = source.indexOf("{", variantsStart);
  const body = balancedBody(source, openingBrace);
  return body ? topLevelKeys(body) : [];
}

function extractRecipe(source: string): { slots: string[]; variants: string[] } {
  return { slots: extractSlots(source), variants: extractVariants(source) };
}

function canonicalSlotName(name: string): string {
  return name
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLocaleLowerCase();
}

function isNamespaceSlot(name: string): boolean {
  return /^[A-Z]/.test(name) && !name.endsWith("Props");
}

async function readSourceEntry(root: string, path: string): Promise<SourceEntry> {
  const absolute = await realpath(join(root, path));
  const relativePath = relative(root, absolute);
  if (relativePath === ".." || relativePath.startsWith(`..${sep}`)) {
    throw new Error(`저장소 밖의 파일은 읽지 않습니다: ${path}`);
  }
  return { path, source: await readFile(absolute, "utf8") };
}

async function readSourceEntries(root: string, paths: readonly string[]): Promise<SourceEntry[]> {
  return Promise.all(uniqueSorted(paths).map((path) => readSourceEntry(root, path)));
}

async function readSources(root: string, paths: readonly string[]): Promise<string[]> {
  return (await readSourceEntries(root, paths)).map(({ source }) => source);
}

async function collectFacts(
  root: string,
  candidates: PlatformCandidates,
  component: ComponentMapResult["component"],
): Promise<SourceFacts> {
  const publicSources = await readSources(root, candidates.publicApi);
  const recipeSources = await readSources(root, candidates.recipes);
  const props = uniqueSorted(publicSources.flatMap(extractProps));
  const recipes = recipeSources.map(extractRecipe);
  const namespaceExports = candidates.publicApi.flatMap((path, index) =>
    namespaceExportsFor(path, publicSources[index] ?? "", component),
  );
  const exports = uniqueSorted([
    ...publicExportSources(candidates.publicApi, publicSources).flatMap(extractExports),
    ...namespaceExports,
  ]);
  const slots = uniqueSorted([
    ...recipes.flatMap(({ slots }) => slots),
    ...namespaceExports.filter(isNamespaceSlot),
  ]);
  const variants = uniqueSorted(recipes.flatMap(({ variants }) => variants));
  return {
    exports,
    props,
    propsComplete: publicSources.every((source) => !hasUnresolvedProps(source)),
    variants,
    slots: uniqueSorted(slots.map(canonicalSlotName)),
    state: props.filter((name) => STATE_NAMES.has(name)),
    event: props.filter((name) => /^(?:on[A-Z]|bind|catch|main-thread:)/.test(name)),
    accessibility: props.filter((name) => /^(?:aria(?:-|[A-Z])|accessibility|role$)/.test(name)),
  };
}

function dimension(
  react: readonly string[],
  lynx: readonly string[],
  evidence: readonly string[],
  confidence: ApiParityDimension["confidence"],
): ApiParityDimension {
  const reactValues = uniqueSorted(react);
  const lynxValues = uniqueSorted(lynx);
  const reactSet = new Set(reactValues);
  const lynxSet = new Set(lynxValues);
  const comparable = confidence !== "unknown";
  return {
    react: reactValues,
    lynx: lynxValues,
    common: reactValues.filter((value) => lynxSet.has(value)),
    reactOnly: comparable ? reactValues.filter((value) => !lynxSet.has(value)) : [],
    lynxOnly: comparable ? lynxValues.filter((value) => !reactSet.has(value)) : [],
    confidence,
    evidence: uniqueSorted(evidence),
  };
}

function sourceConfidence(
  react: readonly string[],
  lynx: readonly string[],
): ApiParityDimension["confidence"] {
  return react.length > 0 && lynx.length > 0 ? "partial" : "unknown";
}

function slotSourceConfidence(
  sources: Record<ComponentPlatform, PlatformCandidates>,
  publicConfidence: ApiParityDimension["confidence"],
): ApiParityDimension["confidence"] {
  const hasReactRecipe = sources.react.recipes.length > 0;
  const hasLynxRecipe = sources.lynx.recipes.length > 0;
  return publicConfidence === "partial" && hasReactRecipe === hasLynxRecipe ? "partial" : "unknown";
}

function propsSourceConfidence(
  react: SourceFacts,
  lynx: SourceFacts,
  publicConfidence: ApiParityDimension["confidence"],
): ApiParityDimension["confidence"] {
  return publicConfidence === "partial" && react.propsComplete && lynx.propsComplete
    ? "partial"
    : "unknown";
}

function sourceEvidence(
  sources: Record<ComponentPlatform, PlatformCandidates>,
  key: "publicApi" | "recipes",
): string[] {
  return [...sources.react[key], ...sources.lynx[key]];
}

function sourceDimension(
  react: SourceFacts,
  lynx: SourceFacts,
  name: Exclude<ApiParityDimensionName, "registry" | "docs">,
  evidence: readonly string[],
  confidence: ApiParityDimension["confidence"],
): ApiParityDimension {
  const result = dimension(react[name], lynx[name], evidence, confidence);
  if (result.react.length === 0 && result.lynx.length === 0) {
    return { ...result, confidence: "unknown" };
  }
  return result;
}

function presenceDimension(
  reactPaths: readonly string[],
  lynxPaths: readonly string[],
  value: string,
  confidence: ApiParityDimension["confidence"],
): ApiParityDimension {
  const react = reactPaths.length > 0 ? [value] : [];
  const lynx = lynxPaths.length > 0 ? [value] : [];
  return dimension(react, lynx, [...reactPaths, ...lynxPaths], confidence);
}

function buildDimensions(
  map: ComponentMapResult,
  sources: Record<ComponentPlatform, PlatformCandidates>,
  react: SourceFacts,
  lynx: SourceFacts,
): Record<ApiParityDimensionName, ApiParityDimension> {
  const publicEvidence = sourceEvidence(sources, "publicApi");
  const recipeEvidence = sourceEvidence(sources, "recipes");
  const publicConfidence = sourceConfidence(sources.react.publicApi, sources.lynx.publicApi);
  const recipeConfidence = sourceConfidence(sources.react.recipes, sources.lynx.recipes);
  const slotConfidence = slotSourceConfidence(sources, publicConfidence);
  const propsConfidence = propsSourceConfidence(react, lynx, publicConfidence);
  const exactConfidence = map.component.state === "matched" ? "confirmed" : "unknown";
  return {
    exports: sourceDimension(react, lynx, "exports", publicEvidence, publicConfidence),
    props: sourceDimension(react, lynx, "props", publicEvidence, propsConfidence),
    variants: sourceDimension(react, lynx, "variants", recipeEvidence, recipeConfidence),
    slots: sourceDimension(
      react,
      lynx,
      "slots",
      [...publicEvidence, ...recipeEvidence],
      slotConfidence,
    ),
    state: sourceDimension(react, lynx, "state", publicEvidence, propsConfidence),
    event: sourceDimension(react, lynx, "event", publicEvidence, propsConfidence),
    accessibility: sourceDimension(react, lynx, "accessibility", publicEvidence, propsConfidence),
    registry: presenceDimension(
      sources.react.registry,
      sources.lynx.registry,
      "registered",
      exactConfidence,
    ),
    docs: presenceDimension(sources.react.docs, sources.lynx.docs, "documented", exactConfidence),
  };
}

function platformEvidencePaths(candidates: PlatformCandidates): string[] {
  return uniqueSorted([
    ...candidates.implementation,
    ...candidates.publicApi,
    ...candidates.recipes,
    ...candidates.docs,
  ]);
}

function constraintEvidence(
  rule: PlatformConstraintRule,
  entries: readonly SourceEntry[],
): string[] {
  return entries.filter(({ source }) => rule.evidencePattern.test(source)).map(({ path }) => path);
}

function expectedDifference(
  rule: PlatformConstraintRule,
  evidence: string[],
): ExpectedPlatformDifference {
  return {
    id: rule.id,
    category: rule.category,
    react: rule.react,
    lynx: rule.lynx,
    reason: rule.reason,
    evidence,
  };
}

function expectedPlatformDifferences(
  entries: readonly SourceEntry[],
): ExpectedPlatformDifference[] {
  return PLATFORM_CONSTRAINT_RULES.flatMap((rule) => {
    const evidence = constraintEvidence(rule, entries);
    return evidence.length > 0 ? [expectedDifference(rule, evidence)] : [];
  });
}

function activeConstraintRules(
  expected: readonly ExpectedPlatformDifference[],
): PlatformConstraintRule[] {
  const activeIds = new Set(expected.map(({ id }) => id));
  return PLATFORM_CONSTRAINT_RULES.filter(({ id }) => activeIds.has(id));
}

function observedOnly(values: readonly string[], otherValues: readonly string[]): string[] {
  const other = new Set(otherValues);
  return values.filter((value) => !other.has(value));
}

function possiblyExplainedBy(
  reactObservedOnly: readonly string[],
  lynxObservedOnly: readonly string[],
  expectedRules: readonly PlatformConstraintRule[],
): PossiblePlatformDifferenceExplanation[] {
  return expectedRules.flatMap(({ id, apiNamePattern }) => {
    const reactMatches = reactObservedOnly.filter((value) => apiNamePattern.test(value));
    const lynxMatches = lynxObservedOnly.filter((value) => apiNamePattern.test(value));
    return reactMatches.length > 0 || lynxMatches.length > 0
      ? [{ id, reactObservedOnly: reactMatches, lynxObservedOnly: lynxMatches }]
      : [];
  });
}

function observedDifferences(
  dimension: ApiParityDimension,
): Pick<PlatformDifferenceReview, "reactObservedOnly" | "lynxObservedOnly"> {
  return {
    reactObservedOnly: observedOnly(dimension.react, dimension.lynx),
    lynxObservedOnly: observedOnly(dimension.lynx, dimension.react),
  };
}

function reviewReason(confidence: ApiParityDimension["confidence"]): string {
  if (confidence === "unknown") {
    return "직접 관찰한 값은 다르지만 근거가 완전하지 않습니다. 누락으로 판정하지 말고 타입 상속과 구현 경로를 확인해야 합니다.";
  }
  return "한쪽에서만 관찰된 공개 표면입니다. 플랫폼 제약 후보와 대체 동작을 확인한 뒤 의도된 차이인지 구현 누락인지 판정해야 합니다.";
}

function differenceReview(
  name: ApiParityDimensionName,
  dimension: ApiParityDimension,
  expectedRules: readonly PlatformConstraintRule[],
): PlatformDifferenceReview | undefined {
  const { reactObservedOnly, lynxObservedOnly } = observedDifferences(dimension);
  if (reactObservedOnly.length === 0 && lynxObservedOnly.length === 0) return undefined;
  return {
    dimension: name,
    reactObservedOnly,
    lynxObservedOnly,
    possiblyExplainedBy: possiblyExplainedBy(reactObservedOnly, lynxObservedOnly, expectedRules),
    confidence: dimension.confidence,
    reason: reviewReason(dimension.confidence),
    evidence: dimension.evidence,
  };
}

/*
 * 플랫폼 제약 후보는 관찰값을 검토 목록에서 제거하지 않는다. 같은 이름의 API가
 * 없더라도 실제 대체 동작이 있는지 소스에서 확인해야 하기 때문이다.
 */
function platformDifferences(
  dimensions: Record<ApiParityDimensionName, ApiParityDimension>,
  expected: ExpectedPlatformDifference[],
): PlatformDifferences {
  const expectedRules = activeConstraintRules(expected);
  const names = Object.keys(dimensions) as ApiParityDimensionName[];
  const needsReview = names.flatMap((name) => {
    const review = differenceReview(name, dimensions[name], expectedRules);
    return review ? [review] : [];
  });
  return { expected, needsReview };
}

function warningsFor(
  sources: Record<ComponentPlatform, PlatformCandidates>,
  react: SourceFacts,
  lynx: SourceFacts,
): string[] {
  const warnings = ["정적 구문으로 직접 선언된 공개 표면만 읽습니다."];
  if (!react.propsComplete || !lynx.propsComplete) {
    warnings.push(
      "extends, Omit 또는 다른 타입을 참조하는 Props가 있어 props, state, event, accessibility 차원을 unknown으로 남겼습니다.",
    );
  }
  if (sourceConfidence(sources.react.publicApi, sources.lynx.publicApi) === "unknown") {
    warnings.push("한 플랫폼의 공개 API 원천이 없어 소스 기반 차원을 unknown으로 남겼습니다.");
  }
  if (sourceConfidence(sources.react.recipes, sources.lynx.recipes) === "unknown") {
    warnings.push("한 플랫폼의 Recipe 원천이 없어 variant 차원을 unknown으로 남겼습니다.");
  }
  return warnings;
}

/** 현재 체크아웃의 컴포넌트 맵을 근거로 React와 Lynx 공개 API를 비교합니다. */
export async function compareSeedComponentApi(component: string): Promise<ApiParityResult> {
  const [root, map] = await Promise.all([findRepositoryRoot(), mapSeedComponent(component)]);
  const sources = {
    react: candidatesFor(map, "react"),
    lynx: candidatesFor(map, "lynx"),
  };
  const [react, lynx, lynxEvidence] = await Promise.all([
    collectFacts(root, sources.react, map.component),
    collectFacts(root, sources.lynx, map.component),
    readSourceEntries(root, platformEvidencePaths(sources.lynx)),
  ]);
  const dimensions = buildDimensions(map, sources, react, lynx);
  const expected = expectedPlatformDifferences(lynxEvidence);

  return {
    component: map.component,
    sources,
    dimensions,
    platformDifferences: platformDifferences(dimensions, expected),
    warnings: warningsFor(sources, react, lynx),
    readOnly: true,
  };
}

async function runCli(args: string[]): Promise<void> {
  try {
    if (args.length !== 1 || !args[0]) {
      throw new Error("사용법: bun skills/seed-api-parity/scripts/api-parity.ts <component>");
    }
    process.stdout.write(`${JSON.stringify(await compareSeedComponentApi(args[0]), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) await runCli(Bun.argv.slice(2));
