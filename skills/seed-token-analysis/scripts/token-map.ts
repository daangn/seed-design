import { readdir, readFile, realpath } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { parseDocument } from "yaml";

export type ColorMode = `theme-${string}`;

export interface RootageColorToken {
  id: string;
  description?: string;
  values: Record<ColorMode, string>;
  line?: number;
}

export interface RootageColorCatalog {
  path: "packages/rootage/color.yaml";
  modes: ColorMode[];
  tokens: ReadonlyMap<string, RootageColorToken>;
}

export interface ResolvedColorToken {
  token: string;
  mode: ColorMode;
  raw?: string;
  resolved?: string;
  chain: string[];
  status: "resolved" | "unresolved";
  error?: string;
}

export interface TokenBackgroundContext {
  token: string;
  state: string;
  confidence: "confirmed" | "inferred";
}

export interface TokenComponentUsage {
  component: string;
  path: string;
  selector: string;
  variants: Record<string, string>;
  state: string;
  slot: string;
  property: string;
  role: "foreground" | "background" | "stroke" | "other";
  backgrounds: TokenBackgroundContext[];
}

export interface GeneratedTokenSurface {
  id:
    | "rootage-artifacts"
    | "qvism-web"
    | "css-web"
    | "qvism-lynx"
    | "css-lynx"
    | "tailwind3"
    | "tailwind4";
  platform: "shared" | "web" | "lynx";
  packagePath: string;
  status: "present" | "missing";
  paths: string[];
  expectedPaths: string[];
}

export interface TokenMapResult {
  token: {
    input: string;
    canonical?: string;
    state: "matched" | "ambiguous" | "not-found";
    candidates: string[];
    publicNames?: {
      cssVariable: string;
      tailwind: string;
    };
  };
  definition?: RootageColorToken & { path: RootageColorCatalog["path"] };
  resolvedValues: ResolvedColorToken[];
  dependentTokens: Array<{ token: string; modes: ColorMode[]; path: RootageColorCatalog["path"] }>;
  componentUsages: TokenComponentUsage[];
  generatedSurfaces: GeneratedTokenSurface[];
  warnings: string[];
  readOnly: true;
}

interface ParsedComponentState {
  name: string;
  slots: Record<string, unknown>;
}

interface ParsedComponentDefinition {
  component: string;
  selector: string;
  variants: Record<string, string>;
  states: ParsedComponentState[];
}

interface SurfaceSpec {
  id: GeneratedTokenSurface["id"];
  platform: GeneratedTokenSurface["platform"];
  packagePath: string;
  candidates: string[];
  symbols: Array<{ kind: "rootage" | "css-variable"; value: string }>;
}

interface ColorTokenIdMatch {
  state: "matched" | "ambiguous" | "not-found";
  canonical?: string;
  candidates: string[];
}

interface AliasResolutionState {
  token: string;
  mode: ColorMode;
  raw?: string;
  chain: string[];
  visited: Set<string>;
  current: string;
}

type AliasResolutionStep = { result: ResolvedColorToken } | { next: string };

const REPOSITORY_NAME = "@seed-design/project";
const COLOR_SOURCE_PATH = "packages/rootage/color.yaml" as const;
const TOKEN_ID_PATTERN = /^\$color\.[a-z\d][a-z\d._-]*$/;
const COLOR_VALUE_PATTERN = /^(?:#[\da-f]{6}|#[\da-f]{8}|\$color\.[a-z\d][a-z\d._-]*)$/i;
const MAX_ALIAS_DEPTH = 32;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function isPathInside(parent: string, child: string): boolean {
  const path = relative(parent, child);
  return path === "" || (!path.startsWith(`..${sep}`) && path !== ".." && !path.startsWith(sep));
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

/** 현재 경로에서 가장 가까운 SEED Design 저장소 루트를 찾습니다. */
export async function findSeedRepositoryRoot(start = process.cwd()): Promise<string> {
  let current = await realpath(start);
  for (;;) {
    if ((await readRepositoryName(current)) === REPOSITORY_NAME) return current;
    const parent = dirname(current);
    if (parent === current) throw new Error("SEED Design 저장소 안에서 실행해야 합니다.");
    current = parent;
  }
}

function kebabCase(value: string): string {
  return value
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function assertNormalizableColorTokenInput(value: string): void {
  if (!value) throw new Error("색상 토큰은 비어 있을 수 없습니다.");
  if (value.length > 180) throw new Error("색상 토큰은 180자 이하여야 합니다.");
  if (value.startsWith("--seed-color-")) {
    throw new Error("CSS 변수 표기는 Rootage 카탈로그와 대조해야 합니다.");
  }
}

function normalizedColorTokenSegments(value: string): string[] {
  return value
    .replace(/^\$color\./, "")
    .replace(/^color[./]/, "")
    .replaceAll("/", ".")
    .split(".")
    .map(kebabCase)
    .filter(Boolean);
}

function assertValidColorTokenSegments(segments: string[], input: string): void {
  if (segments.length < 2) throw new Error(`색상 토큰 형식을 해석할 수 없습니다: ${input}`);
  if (segments.some((segment) => !/^[a-z\d][a-z\d-]*$/.test(segment))) {
    throw new Error(`색상 토큰 형식을 해석할 수 없습니다: ${input}`);
  }
}

/** Rootage ID와 슬래시 표기를 정규화합니다. CSS 변수는 카탈로그에서 따로 대조합니다. */
export function normalizeColorTokenId(input: string): string {
  const value = input.trim();
  assertNormalizableColorTokenInput(value);
  const segments = normalizedColorTokenSegments(value);
  assertValidColorTokenSegments(segments, input);

  const token = `$color.${segments.join(".")}`;
  if (!TOKEN_ID_PATTERN.test(token)) throw new Error(`지원하지 않는 색상 토큰입니다: ${input}`);
  return token;
}

export function normalizeColorTokenReference(input: string): string {
  const value = input.trim();
  if (!value) throw new Error("색상 토큰은 비어 있을 수 없습니다.");
  if (!value.startsWith("--seed-color-")) return normalizeColorTokenId(value);
  if (!/^--seed-color-[a-z\d][a-z\d-]*$/.test(value)) {
    throw new Error(`색상 CSS 변수 형식을 해석할 수 없습니다: ${input}`);
  }
  return value;
}

export function colorTokenCssVariable(token: string): string {
  return `--seed-color-${token.slice("$color.".length).replaceAll(".", "-")}`;
}

function tailwindName(token: string): string {
  return token.slice("$color.".length).replaceAll(".", "-");
}

function lineForToken(source: string, token: string): number | undefined {
  const index = source.split("\n").findIndex((line) => line.trimStart().startsWith(`${token}:`));
  return index < 0 ? undefined : index + 1;
}

function yamlMessage(messages: readonly { message: string }[]): string {
  return messages.map(({ message }) => message).join("; ");
}

function parseColorYaml(source: string): unknown {
  const document = parseDocument(source, {
    schema: "failsafe",
    strict: true,
    uniqueKeys: true,
    merge: false,
    customTags: [],
  });
  if (document.errors.length > 0) {
    throw new Error(`Rootage color YAML을 파싱하지 못했습니다: ${yamlMessage(document.errors)}`);
  }
  if (document.warnings.length > 0) {
    throw new Error(
      `Rootage color YAML 경고를 허용하지 않습니다: ${yamlMessage(document.warnings)}`,
    );
  }
  return document.toJS({ maxAliasCount: 0 });
}

function colorTokenEntries(parsed: unknown): Record<string, unknown> {
  if (!isRecord(parsed) || parsed.kind !== "Tokens") {
    throw new Error("Rootage color YAML의 kind는 Tokens여야 합니다.");
  }
  return colorTokenDataEntries(parsed.data);
}

function colorTokenDataEntries(data: unknown): Record<string, unknown> {
  if (!isRecord(data) || data.collection !== "color" || !isRecord(data.tokens)) {
    throw new Error("Rootage color YAML에 data.collection=color과 data.tokens가 필요합니다.");
  }
  return data.tokens;
}

function colorTokenValueEntries(id: string, value: unknown): Record<string, unknown> {
  if (!TOKEN_ID_PATTERN.test(id)) throw new Error(`잘못된 color token ID입니다: ${id}`);
  if (!isRecord(value)) throw new Error(`${id}에 values가 필요합니다.`);
  if (!isRecord(value.values)) throw new Error(`${id}에 values가 필요합니다.`);
  return value.values;
}

function assertColorModeValue(id: string, mode: string, raw: unknown): asserts raw is string {
  if (!/^theme-[a-z\d][a-z\d-]*$/.test(mode) || typeof raw !== "string") {
    throw new Error(`${id}의 mode 또는 값 형식이 올바르지 않습니다: ${mode}`);
  }
  if (!COLOR_VALUE_PATTERN.test(raw)) {
    throw new Error(`${id}의 ${mode} 값이 지원하는 색상 또는 alias 형식이 아닙니다.`);
  }
}

function parseColorTokenValues(
  id: string,
  value: unknown,
  modes: Set<ColorMode>,
): Record<ColorMode, string> {
  const tokenValues: Record<ColorMode, string> = {};
  for (const [mode, raw] of Object.entries(colorTokenValueEntries(id, value))) {
    assertColorModeValue(id, mode, raw);
    tokenValues[mode as ColorMode] = raw;
    modes.add(mode as ColorMode);
  }
  return tokenValues;
}

function parseColorToken(
  source: string,
  id: string,
  value: unknown,
  modes: Set<ColorMode>,
): RootageColorToken {
  const token: RootageColorToken = { id, values: parseColorTokenValues(id, value, modes) };
  if (isRecord(value) && typeof value.description === "string") {
    token.description = value.description;
  }
  const line = lineForToken(source, id);
  if (line) token.line = line;
  return token;
}

function buildColorCatalog(
  source: string,
  entries: Record<string, unknown>,
  path: RootageColorCatalog["path"],
): RootageColorCatalog {
  const tokens = new Map<string, RootageColorToken>();
  const modes = new Set<ColorMode>();
  for (const [id, value] of Object.entries(entries)) {
    tokens.set(id, parseColorToken(source, id, value, modes));
  }
  return { path, modes: [...modes].sort(), tokens };
}

/** Rootage color.yaml을 검증된 색상 카탈로그로 파싱합니다. */
export function parseRootageColor(
  source: string,
  path: RootageColorCatalog["path"] = COLOR_SOURCE_PATH,
): RootageColorCatalog {
  return buildColorCatalog(source, colorTokenEntries(parseColorYaml(source)), path);
}

/** 저장소 밖을 가리키는 심링크를 거부하고 Rootage 색상 카탈로그를 읽습니다. */
export async function loadRootageColor(repositoryRoot: string): Promise<RootageColorCatalog> {
  const [canonicalRoot, colorPath] = await Promise.all([
    realpath(repositoryRoot),
    realpath(join(repositoryRoot, COLOR_SOURCE_PATH)),
  ]);
  if (!isPathInside(canonicalRoot, colorPath)) {
    throw new Error("Rootage color YAML이 저장소 밖을 가리킵니다.");
  }
  return parseRootageColor(await readFile(colorPath, "utf8"));
}

/** CSS 변수처럼 평탄화된 표기는 실제 카탈로그와 대조해 토큰 ID를 확정합니다. */
export function resolveColorTokenId(
  catalog: RootageColorCatalog,
  input: string,
): { state: "matched" | "ambiguous" | "not-found"; canonical?: string; candidates: string[] } {
  const reference = normalizeColorTokenReference(input);
  if (!reference.startsWith("--seed-color-")) return matchRootageTokenId(catalog, reference);
  return matchColorCssVariable(catalog, reference);
}

function matchRootageTokenId(catalog: RootageColorCatalog, reference: string): ColorTokenIdMatch {
  if (catalog.tokens.has(reference)) {
    return { state: "matched", canonical: reference, candidates: [reference] };
  }
  return { state: "not-found", canonical: reference, candidates: [] };
}

function matchColorCssVariable(catalog: RootageColorCatalog, reference: string): ColorTokenIdMatch {
  const candidates = [...catalog.tokens.keys()]
    .filter((token) => colorTokenCssVariable(token) === reference)
    .sort();
  if (candidates.length === 1) {
    return { state: "matched", canonical: candidates[0], candidates };
  }
  if (candidates.length > 1) return { state: "ambiguous", candidates };
  return { state: "not-found", candidates };
}

function colorModeKey(themeOrMode: string): ColorMode {
  const value = themeOrMode.trim().toLowerCase();
  if (!value) throw new Error("색상 mode는 비어 있을 수 없습니다.");
  return (value.startsWith("theme-") ? value : `theme-${value}`) as ColorMode;
}

function unresolvedAlias(
  state: AliasResolutionState,
  chain: string[],
  error: string,
): ResolvedColorToken {
  return {
    token: state.token,
    mode: state.mode,
    raw: state.raw,
    chain,
    status: "unresolved",
    error,
  };
}

function resolveAliasStep(
  catalog: RootageColorCatalog,
  state: AliasResolutionState,
): AliasResolutionStep {
  if (state.visited.has(state.current)) {
    const repeatedChain = [...state.chain, state.current];
    return {
      result: unresolvedAlias(
        state,
        repeatedChain,
        `색상 토큰 alias 순환을 발견했습니다: ${repeatedChain.join(" → ")}`,
      ),
    };
  }
  state.visited.add(state.current);
  state.chain.push(state.current);

  const definition = catalog.tokens.get(state.current);
  if (!definition) {
    return {
      result: unresolvedAlias(state, state.chain, `색상 토큰을 찾지 못했습니다: ${state.current}`),
    };
  }
  const value = definition.values[state.mode];
  if (!value) {
    return {
      result: unresolvedAlias(
        state,
        state.chain,
        `${state.current}에 ${state.mode} 값이 없습니다. 다른 mode 값으로 대체하지 않았습니다.`,
      ),
    };
  }
  if (value.startsWith("#")) {
    return {
      result: {
        token: state.token,
        mode: state.mode,
        raw: state.raw,
        resolved: value.toLowerCase(),
        chain: state.chain,
        status: "resolved",
      },
    };
  }
  return { next: value };
}

function resolveAliasChain(
  catalog: RootageColorCatalog,
  state: AliasResolutionState,
): ResolvedColorToken {
  for (let depth = 0; depth <= MAX_ALIAS_DEPTH; depth += 1) {
    const step = resolveAliasStep(catalog, state);
    if ("result" in step) return step.result;
    state.current = step.next;
  }
  return unresolvedAlias(
    state,
    state.chain,
    `색상 토큰 alias 깊이가 ${MAX_ALIAS_DEPTH}단계를 초과했습니다.`,
  );
}

/** mode별 alias 사슬을 따라 최종 색상값을 해석합니다. */
export function resolveColorToken(
  catalog: RootageColorCatalog,
  input: string,
  themeOrMode: string,
): ResolvedColorToken {
  const match = resolveColorTokenId(catalog, input);
  const token = match.canonical ?? normalizeColorTokenReference(input);
  const mode = colorModeKey(themeOrMode);
  if (match.state === "ambiguous") {
    return {
      token,
      mode,
      chain: [],
      status: "unresolved",
      error: `색상 토큰 표기가 모호합니다: ${match.candidates.join(", ")}`,
    };
  }
  return resolveAliasChain(catalog, {
    token,
    mode,
    raw: catalog.tokens.get(token)?.values[mode],
    chain: [],
    visited: new Set<string>(),
    current: token,
  });
}

function parseSelector(selector: string): Record<string, string> {
  if (selector === "base") return {};
  return Object.fromEntries(
    selector.split(",").flatMap((part) => {
      const [name, value] = part.split("=").map((item) => item.trim());
      return name && value ? [[name, value]] : [];
    }),
  );
}

function parseComponentYaml(source: string): unknown {
  const document = parseDocument(source, {
    schema: "failsafe",
    strict: true,
    uniqueKeys: true,
    merge: false,
    customTags: [],
  });
  if (document.errors.length > 0) {
    throw new Error(
      `Rootage component YAML을 파싱하지 못했습니다: ${yamlMessage(document.errors)}`,
    );
  }
  return document.toJS({ maxAliasCount: 0 });
}

function assertComponentDocument(
  parsed: unknown,
  path: string,
): asserts parsed is Record<string, unknown> {
  if (!isRecord(parsed) || parsed.kind !== "ComponentSpec") {
    throw new Error(`${path}의 kind는 ComponentSpec이어야 합니다.`);
  }
}

function componentId(parsed: Record<string, unknown>, path: string): string {
  if (!isRecord(parsed.metadata) || typeof parsed.metadata.id !== "string") {
    throw new Error(`${path}에 metadata.id가 필요합니다.`);
  }
  return parsed.metadata.id;
}

function componentDefinitions(
  parsed: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!isRecord(parsed.data) || !isRecord(parsed.data.definitions)) return undefined;
  return parsed.data.definitions;
}

function componentStates(definition: Record<string, unknown>): ParsedComponentState[] {
  return Object.entries(definition).flatMap(([name, slots]) =>
    isRecord(slots) ? [{ name, slots }] : [],
  );
}

function parsedComponentDefinition(
  component: string,
  selector: string,
  definition: unknown,
): ParsedComponentDefinition[] {
  if (!isRecord(definition)) return [];
  return [
    {
      component,
      selector,
      variants: parseSelector(selector),
      states: componentStates(definition),
    },
  ];
}

function parseRootageComponent(source: string, path: string): ParsedComponentDefinition[] {
  const parsed = parseComponentYaml(source);
  assertComponentDocument(parsed, path);
  const component = componentId(parsed, path);
  const definitions = componentDefinitions(parsed);
  if (!definitions) return [];
  return Object.entries(definitions).flatMap(([selector, definition]) =>
    parsedComponentDefinition(component, selector, definition),
  );
}

function colorToken(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("$color.")) return undefined;
  try {
    return normalizeColorTokenId(value);
  } catch {
    return undefined;
  }
}

function propertyValue(state: ParsedComponentState, slot: string, property: string): unknown {
  const value = state.slots[slot];
  return isRecord(value) ? value[property] : undefined;
}

function isRootColorProperty(slot: string, property: string): boolean {
  return slot === "root" && property === "color";
}

function confirmedBackground(state: ParsedComponentState): TokenBackgroundContext[] {
  const token = colorToken(propertyValue(state, "root", "color"));
  if (!token) return [];
  return [{ token, state: state.name, confidence: "confirmed" }];
}

function inheritsUsageProperty(
  candidate: ParsedComponentState,
  state: ParsedComponentState,
  slot: string,
  property: string,
): boolean {
  if (candidate.name === state.name) return false;
  return propertyValue(candidate, slot, property) === undefined;
}

function inferredBackgrounds(
  definition: ParsedComponentDefinition,
  state: ParsedComponentState,
  slot: string,
  property: string,
): TokenBackgroundContext[] {
  if (state.name !== "enabled") return [];
  const backgrounds: TokenBackgroundContext[] = [];
  for (const candidate of definition.states) {
    if (!inheritsUsageProperty(candidate, state, slot, property)) continue;
    const token = colorToken(propertyValue(candidate, "root", "color"));
    if (token) backgrounds.push({ token, state: candidate.name, confidence: "inferred" });
  }
  return backgrounds;
}

function backgroundContexts(
  definition: ParsedComponentDefinition,
  state: ParsedComponentState,
  slot: string,
  property: string,
): TokenBackgroundContext[] {
  if (isRootColorProperty(slot, property)) return [];
  const backgrounds = [
    ...confirmedBackground(state),
    ...inferredBackgrounds(definition, state, slot, property),
  ];
  return backgrounds.sort((left, right) =>
    `${left.state}\0${left.token}`.localeCompare(`${right.state}\0${right.token}`),
  );
}

function isStrokeColorProperty(property: string): boolean {
  return /^(?:border|stroke).*color$/i.test(property);
}

function isForegroundUsage(token: string, slot: string, property: string): boolean {
  if (token.startsWith("$color.fg.")) return true;
  return slot !== "root" && /color$/i.test(property);
}

function usageRole(token: string, slot: string, property: string): TokenComponentUsage["role"] {
  if (isRootColorProperty(slot, property)) return "background";
  if (isStrokeColorProperty(property)) return "stroke";
  if (isForegroundUsage(token, slot, property)) return "foreground";
  if (token.startsWith("$color.bg.")) return "background";
  return "other";
}

function usageFromProperty(
  token: string,
  path: string,
  definition: ParsedComponentDefinition,
  state: ParsedComponentState,
  slot: string,
  property: string,
  value: unknown,
): TokenComponentUsage | undefined {
  if (value !== token) return undefined;
  return {
    component: definition.component,
    path,
    selector: definition.selector,
    variants: definition.variants,
    state: state.name,
    slot,
    property,
    role: usageRole(token, slot, property),
    backgrounds: backgroundContexts(definition, state, slot, property),
  };
}

function usagesFromSlot(
  token: string,
  path: string,
  definition: ParsedComponentDefinition,
  state: ParsedComponentState,
  slot: string,
  slotValue: unknown,
): TokenComponentUsage[] {
  if (!isRecord(slotValue)) return [];
  return Object.entries(slotValue).flatMap(([property, value]) => {
    const usage = usageFromProperty(token, path, definition, state, slot, property, value);
    return usage ? [usage] : [];
  });
}

function usagesFromState(
  token: string,
  path: string,
  definition: ParsedComponentDefinition,
  state: ParsedComponentState,
): TokenComponentUsage[] {
  return Object.entries(state.slots).flatMap(([slot, slotValue]) =>
    usagesFromSlot(token, path, definition, state, slot, slotValue),
  );
}

function usagesFromDefinition(
  token: string,
  path: string,
  definition: ParsedComponentDefinition,
): TokenComponentUsage[] {
  return definition.states.flatMap((state) => usagesFromState(token, path, definition, state));
}

async function rootageComponentsDirectory(repositoryRoot: string): Promise<string> {
  const [canonicalRoot, directory] = await Promise.all([
    realpath(repositoryRoot),
    realpath(join(repositoryRoot, "packages/rootage/components")),
  ]);
  if (!isPathInside(canonicalRoot, directory)) {
    throw new Error("Rootage component 경로가 저장소 밖을 가리킵니다.");
  }
  return directory;
}

async function componentYamlFiles(directory: string): Promise<string[]> {
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function scanComponentFile(
  directory: string,
  file: string,
  token: string,
): Promise<{ usages: TokenComponentUsage[]; warnings: string[] }> {
  const path = `packages/rootage/components/${file}`;
  const source = await readFile(join(directory, file), "utf8");
  if (!source.includes(token)) return { usages: [], warnings: [] };
  try {
    return {
      usages: parseRootageComponent(source, path).flatMap((definition) =>
        usagesFromDefinition(token, path, definition),
      ),
      warnings: [],
    };
  } catch (error) {
    return { usages: [], warnings: [`${path}을 분석하지 못했습니다: ${errorMessage(error)}`] };
  }
}

async function scanComponentUsages(
  repositoryRoot: string,
  token: string,
): Promise<{ usages: TokenComponentUsage[]; warnings: string[] }> {
  const directory = await rootageComponentsDirectory(repositoryRoot);
  const files = await componentYamlFiles(directory);
  const usages: TokenComponentUsage[] = [];
  const warnings: string[] = [];
  for (const file of files) {
    const result = await scanComponentFile(directory, file, token);
    usages.push(...result.usages);
    warnings.push(...result.warnings);
  }
  usages.sort((left, right) =>
    [left.component, left.selector, left.state, left.slot, left.property]
      .join("\0")
      .localeCompare(
        [right.component, right.selector, right.state, right.slot, right.property].join("\0"),
      ),
  );
  return { usages, warnings };
}

function escapedRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasExactSurfaceSymbol(source: string, symbol: SurfaceSpec["symbols"][number]): boolean {
  const boundary = symbol.kind === "rootage" ? "(?![a-z\\d._-])" : "(?![a-z\\d_-])";
  return new RegExp(`${escapedRegExp(symbol.value)}${boundary}`, "i").test(source);
}

function surfaceSpecs(token: string): SurfaceSpec[] {
  const cssVariable = colorTokenCssVariable(token);
  const publicName = tailwindName(token);
  const variablePath = token.slice(1).split(".").slice(0, -1).join("/");
  return [
    {
      id: "rootage-artifacts",
      platform: "shared",
      packagePath: "packages/rootage",
      candidates: [
        "packages/rootage/__generated__/color.json",
        "packages/rootage/__generated__/color.mjs",
        "packages/rootage/__generated__/color.d.ts",
      ],
      symbols: [{ kind: "rootage", value: token }],
    },
    {
      id: "qvism-web",
      platform: "web",
      packagePath: "packages/qvism-preset",
      candidates: [
        "packages/qvism-preset/src/token.css",
        "packages/qvism-preset/src/tokens.ts",
        `packages/qvism-preset/src/vars/${variablePath}.mjs`,
        `packages/qvism-preset/src/vars/${variablePath}.d.ts`,
      ],
      symbols: [{ kind: "css-variable", value: cssVariable }],
    },
    {
      id: "css-web",
      platform: "web",
      packagePath: "packages/css",
      candidates: [
        `packages/css/vars/${variablePath}.mjs`,
        `packages/css/vars/${variablePath}.d.ts`,
      ],
      symbols: [{ kind: "css-variable", value: cssVariable }],
    },
    {
      id: "qvism-lynx",
      platform: "lynx",
      packagePath: "packages/lynx-qvism-preset",
      candidates: [
        "packages/lynx-qvism-preset/src/token.css",
        "packages/lynx-qvism-preset/src/tokens.ts",
        `packages/lynx-qvism-preset/src/vars/${variablePath}.mjs`,
        `packages/lynx-qvism-preset/src/vars/${variablePath}.d.ts`,
      ],
      symbols: [{ kind: "css-variable", value: cssVariable }],
    },
    {
      id: "css-lynx",
      platform: "lynx",
      packagePath: "packages/lynx-css",
      candidates: [
        `packages/lynx-css/vars/${variablePath}.mjs`,
        `packages/lynx-css/vars/${variablePath}.d.ts`,
      ],
      symbols: [{ kind: "css-variable", value: cssVariable }],
    },
    {
      id: "tailwind3",
      platform: "web",
      packagePath: "packages/tailwind3-plugin",
      candidates: ["packages/tailwind3-plugin/src/index.ts"],
      symbols: [{ kind: "css-variable", value: cssVariable }],
    },
    {
      id: "tailwind4",
      platform: "web",
      packagePath: "packages/tailwind4-theme",
      candidates: ["packages/tailwind4-theme/index.css"],
      symbols: [
        { kind: "css-variable", value: cssVariable },
        { kind: "css-variable", value: `--color-${publicName}` },
      ],
    },
  ];
}

async function inspectSurfacePath(
  canonicalRoot: string,
  path: string,
  symbols: SurfaceSpec["symbols"],
): Promise<{ foundPath?: string; warning?: string }> {
  try {
    const canonicalPath = await realpath(join(canonicalRoot, path));
    if (!isPathInside(canonicalRoot, canonicalPath)) {
      return { warning: `생성 표면이 저장소 밖을 가리켜 제외했습니다: ${path}` };
    }
    const source = await readFile(canonicalPath, "utf8");
    if (symbols.some((symbol) => hasExactSurfaceSymbol(source, symbol))) {
      return { foundPath: path };
    }
    return {};
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return {};
    return { warning: `${path}을 읽지 못했습니다: ${errorMessage(error)}` };
  }
}

async function inspectSurface(
  canonicalRoot: string,
  spec: SurfaceSpec,
): Promise<{ surface: GeneratedTokenSurface; warnings: string[] }> {
  const paths: string[] = [];
  const warnings: string[] = [];
  const expectedPaths = uniqueSorted(spec.candidates);
  for (const path of expectedPaths) {
    const result = await inspectSurfacePath(canonicalRoot, path, spec.symbols);
    if (result.foundPath) paths.push(result.foundPath);
    if (result.warning) warnings.push(result.warning);
  }
  return {
    surface: {
      id: spec.id,
      platform: spec.platform,
      packagePath: spec.packagePath,
      status: paths.length > 0 ? "present" : "missing",
      paths: uniqueSorted(paths),
      expectedPaths,
    },
    warnings,
  };
}

async function generatedSurfaces(
  repositoryRoot: string,
  token: string,
): Promise<{ surfaces: GeneratedTokenSurface[]; warnings: string[] }> {
  const canonicalRoot = await realpath(repositoryRoot);
  const results = await Promise.all(
    surfaceSpecs(token).map((spec) => inspectSurface(canonicalRoot, spec)),
  );
  return {
    surfaces: results
      .map(({ surface }) => surface)
      .sort((left, right) => left.id.localeCompare(right.id)),
    warnings: uniqueSorted(results.flatMap(({ warnings }) => warnings)),
  };
}

function dependentTokens(
  catalog: RootageColorCatalog,
  token: string,
): TokenMapResult["dependentTokens"] {
  return [...catalog.tokens.values()]
    .flatMap((definition) => {
      const modes = Object.entries(definition.values)
        .filter(([, value]) => value === token)
        .map(([mode]) => mode as ColorMode)
        .sort();
      return modes.length > 0 ? [{ token: definition.id, modes, path: catalog.path }] : [];
    })
    .sort((left, right) => left.token.localeCompare(right.token));
}

function nearbyCandidates(catalog: RootageColorCatalog, token: string): string[] {
  const parts = token.split(".");
  const group = parts.slice(0, -1).join(".");
  const name = parts.at(-1) ?? "";
  return [...catalog.tokens.keys()]
    .filter((candidate) => candidate.startsWith(`${group}.`) || candidate.includes(name))
    .sort()
    .slice(0, 8);
}

function mapCandidates(catalog: RootageColorCatalog, match: ColorTokenIdMatch): string[] {
  if (match.state === "not-found" && match.canonical) {
    return nearbyCandidates(catalog, match.canonical);
  }
  return match.candidates;
}

function unresolvedTokenMapResult(
  input: string,
  match: ColorTokenIdMatch,
  candidates: string[],
): TokenMapResult {
  return {
    token: { input, state: match.state, candidates },
    resolvedValues: [],
    dependentTokens: [],
    componentUsages: [],
    generatedSurfaces: [],
    warnings: ["토큰 ID를 하나로 확정하지 못해 사용처와 생성 표면을 분석하지 않았습니다."],
    readOnly: true,
  };
}

function mappedDefinition(
  definition: RootageColorToken | undefined,
  path: RootageColorCatalog["path"],
): { definition?: RootageColorToken & { path: RootageColorCatalog["path"] } } {
  if (!definition) return {};
  return { definition: { ...definition, path } };
}

function mappedResolvedValues(
  catalog: RootageColorCatalog,
  canonical: string,
  definition: RootageColorToken | undefined,
): ResolvedColorToken[] {
  if (!definition) return [];
  return catalog.modes.map((mode) => resolveColorToken(catalog, canonical, mode));
}

function mappedWarnings(
  definition: RootageColorToken | undefined,
  componentWarnings: string[],
  generatedWarnings: string[],
): string[] {
  const warnings = [...componentWarnings, ...generatedWarnings];
  if (!definition) warnings.push("Rootage 정의는 없지만 남은 사용처와 생성 표면을 확인했습니다.");
  return uniqueSorted(warnings);
}

async function analyzeCanonicalToken(
  input: string,
  match: ColorTokenIdMatch,
  candidates: string[],
  canonical: string,
  catalog: RootageColorCatalog,
  repositoryRoot: string,
): Promise<TokenMapResult> {
  const definition = catalog.tokens.get(canonical);
  const componentScan = await scanComponentUsages(repositoryRoot, canonical);
  const generated = await generatedSurfaces(repositoryRoot, canonical);
  return {
    token: {
      input,
      canonical,
      state: match.state,
      candidates,
      publicNames: {
        cssVariable: colorTokenCssVariable(canonical),
        tailwind: tailwindName(canonical),
      },
    },
    ...mappedDefinition(definition, catalog.path),
    resolvedValues: mappedResolvedValues(catalog, canonical, definition),
    dependentTokens: dependentTokens(catalog, canonical),
    componentUsages: componentScan.usages,
    generatedSurfaces: generated.surfaces,
    warnings: mappedWarnings(definition, componentScan.warnings, generated.warnings),
    readOnly: true,
  };
}

/** 현재 체크아웃에서 한 색상 토큰의 원천, 사용처와 생성 표면을 조회합니다. */
export async function mapSeedColorToken(input: string): Promise<TokenMapResult> {
  const repositoryRoot = await findSeedRepositoryRoot();
  const catalog = await loadRootageColor(repositoryRoot);
  const match = resolveColorTokenId(catalog, input);
  const canonical = match.canonical;
  const candidates = mapCandidates(catalog, match);
  if (!canonical) return unresolvedTokenMapResult(input, match, candidates);
  return analyzeCanonicalToken(input, match, candidates, canonical, catalog, repositoryRoot);
}

async function runCli(args: string[]): Promise<void> {
  try {
    if (args.length !== 1 || !args[0]) {
      throw new Error("사용법: bun skills/seed-token-analysis/scripts/token-map.ts <color-token>");
    }
    process.stdout.write(`${JSON.stringify(await mapSeedColorToken(args[0]), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${errorMessage(error)}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) await runCli(Bun.argv.slice(2));
