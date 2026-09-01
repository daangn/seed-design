import {
  findSeedRepositoryRoot,
  loadRootageColor,
  normalizeColorTokenReference,
  resolveColorToken,
  type ResolvedColorToken,
  type RootageColorCatalog,
} from "./token-map";

export type ContrastTheme = "light" | "dark";

export interface RgbaColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface WcagContrastResult {
  aaNormalText: boolean;
  aaLargeText: boolean;
  aaaNormalText: boolean;
  aaaLargeText: boolean;
  nonText: boolean;
}

export interface ResolvedContrastCalculation {
  status: "resolved";
  ratio: number;
  displayRatio: number;
  renderedForeground: string;
  renderedBackground: string;
  wcag: WcagContrastResult;
}

export interface NeedsBackdropCalculation {
  status: "needs-backdrop";
  reason: string;
}

export type ContrastCalculation = ResolvedContrastCalculation | NeedsBackdropCalculation;

export interface TokenContrastCheck {
  theme: ContrastTheme;
  mode: `theme-${ContrastTheme}`;
  foreground: ResolvedColorToken;
  background: ResolvedColorToken;
  backdrop?: ResolvedColorToken;
  status: "resolved" | "unresolved" | "needs-backdrop";
  reason?: string;
  ratio?: number;
  displayRatio?: number;
  renderedForeground?: string;
  renderedBackground?: string;
  wcag?: WcagContrastResult;
}

export interface TokenContrastRequest {
  foreground: string;
  backgrounds: string[];
  themes: ContrastTheme[];
  backdrop?: string;
}

export interface TokenContrastResult {
  status: "ok" | "partial";
  source: RootageColorCatalog["path"];
  request: TokenContrastRequest;
  checks: TokenContrastCheck[];
  minimumRatio?: number;
  warnings: string[];
  readOnly: true;
}

export interface TokenContrastInput {
  foreground: string;
  backgrounds: string[];
  themes?: ContrastTheme[];
  backdrop?: string;
}

const DEFAULT_THEMES = ["light", "dark"] as const satisfies readonly ContrastTheme[];
const OPAQUE_EPSILON = 1e-12;

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function normalizeThemes(themes?: readonly ContrastTheme[]): ContrastTheme[] {
  if (themes === undefined) return [...DEFAULT_THEMES];
  if (themes.length === 0) throw new Error("themes에는 하나 이상의 테마가 필요합니다.");
  const requested = new Set(themes.map(validateTheme));
  return DEFAULT_THEMES.filter((theme) => requested.has(theme));
}

function validateTheme(theme: string): ContrastTheme {
  if (theme !== "light" && theme !== "dark") {
    throw new Error(`지원하지 않는 테마입니다: ${theme}`);
  }
  return theme;
}

function normalizeBackgrounds(backgrounds: readonly string[]): string[] {
  if (backgrounds.length === 0) {
    throw new Error("backgrounds에는 하나 이상의 색상 토큰이 필요합니다.");
  }
  return [...new Set(backgrounds.map(normalizeColorTokenReference))];
}

function contrastRequest(input: TokenContrastInput): TokenContrastRequest {
  return {
    foreground: normalizeColorTokenReference(input.foreground),
    backgrounds: normalizeBackgrounds(input.backgrounds),
    themes: normalizeThemes(input.themes),
    ...(input.backdrop ? { backdrop: normalizeColorTokenReference(input.backdrop) } : {}),
  };
}

function isOpaque(color: RgbaColor): boolean {
  return color.alpha >= 1 - OPAQUE_EPSILON;
}

/** Rootage의 #RRGGBB와 #RRGGBBAA 값을 RGBA 채널로 변환합니다. */
export function parseHexColor(value: string): RgbaColor {
  const match = value
    .trim()
    .toLowerCase()
    .match(/^#([\da-f]{6})([\da-f]{2})?$/);
  if (!match?.[1]) throw new Error(`지원하지 않는 색상 형식입니다: ${value}`);
  const rgb = match[1];
  return {
    red: Number.parseInt(rgb.slice(0, 2), 16) / 255,
    green: Number.parseInt(rgb.slice(2, 4), 16) / 255,
    blue: Number.parseInt(rgb.slice(4, 6), 16) / 255,
    alpha: match[2] ? Number.parseInt(match[2], 16) / 255 : 1,
  };
}

/** CSS source-over 규칙으로 두 sRGB 색상을 합성합니다. */
export function compositeColor(foreground: RgbaColor, background: RgbaColor): RgbaColor {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
  if (alpha <= OPAQUE_EPSILON) return { red: 0, green: 0, blue: 0, alpha: 0 };
  return {
    red:
      (foreground.red * foreground.alpha +
        background.red * background.alpha * (1 - foreground.alpha)) /
      alpha,
    green:
      (foreground.green * foreground.alpha +
        background.green * background.alpha * (1 - foreground.alpha)) /
      alpha,
    blue:
      (foreground.blue * foreground.alpha +
        background.blue * background.alpha * (1 - foreground.alpha)) /
      alpha,
    alpha,
  };
}

function channelToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** 불투명한 sRGB 색상의 WCAG 상대 휘도를 계산합니다. */
export function relativeLuminance(color: RgbaColor): number {
  if (!isOpaque(color)) {
    throw new Error("상대 휘도는 불투명하게 합성된 색상에서만 계산할 수 있습니다.");
  }
  return (
    0.2126 * channelToLinear(color.red) +
    0.7152 * channelToLinear(color.green) +
    0.0722 * channelToLinear(color.blue)
  );
}

/** 두 불투명 색상의 WCAG 2.x 대비율을 계산합니다. */
export function wcagContrastRatio(foreground: RgbaColor, background: RgbaColor): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function byteHex(value: number): string {
  return Math.round(Math.min(1, Math.max(0, value)) * 255)
    .toString(16)
    .padStart(2, "0");
}

function colorToHex(color: RgbaColor): string {
  const rgb = `${byteHex(color.red)}${byteHex(color.green)}${byteHex(color.blue)}`;
  return isOpaque(color) ? `#${rgb}` : `#${rgb}${byteHex(color.alpha)}`;
}

function wcagResult(ratio: number): WcagContrastResult {
  return {
    aaNormalText: ratio >= 4.5,
    aaLargeText: ratio >= 3,
    aaaNormalText: ratio >= 7,
    aaaLargeText: ratio >= 4.5,
    nonText: ratio >= 3,
  };
}

/** alpha가 있는 색상을 실제 배경 위에 합성한 뒤 WCAG 2.x 대비를 계산합니다. */
export function calculateColorContrast(
  foregroundHex: string,
  backgroundHex: string,
  backdropHex?: string,
): ContrastCalculation {
  const foreground = parseHexColor(foregroundHex);
  const background = parseHexColor(backgroundHex);
  let renderedBackground = background;
  if (!isOpaque(background)) {
    if (!backdropHex) {
      return {
        status: "needs-backdrop",
        reason: "배경 토큰이 반투명하므로 실제 아래 배경(backdrop)이 필요합니다.",
      };
    }
    const backdrop = parseHexColor(backdropHex);
    if (!isOpaque(backdrop)) {
      return {
        status: "needs-backdrop",
        reason: "backdrop도 반투명합니다. 최종적으로 불투명한 backdrop이 필요합니다.",
      };
    }
    renderedBackground = compositeColor(background, backdrop);
  }

  const renderedForeground = compositeColor(foreground, renderedBackground);
  const ratio = wcagContrastRatio(renderedForeground, renderedBackground);
  return {
    status: "resolved",
    ratio,
    displayRatio: Number(ratio.toFixed(2)),
    renderedForeground: colorToHex(renderedForeground),
    renderedBackground: colorToHex(renderedBackground),
    wcag: wcagResult(ratio),
  };
}

function unresolvedReason(...resolutions: ResolvedColorToken[]): string {
  return resolutions
    .filter(({ status }) => status === "unresolved")
    .map(({ token, error }) => error ?? `${token}을 해석하지 못했습니다.`)
    .join("; ");
}

function unresolvedCheck(input: {
  theme: ContrastTheme;
  foreground: ResolvedColorToken;
  background: ResolvedColorToken;
}): TokenContrastCheck {
  return {
    theme: input.theme,
    mode: `theme-${input.theme}`,
    foreground: input.foreground,
    background: input.background,
    status: "unresolved",
    reason: unresolvedReason(input.foreground, input.background),
  };
}

function resolvedCheck(input: {
  theme: ContrastTheme;
  foreground: ResolvedColorToken;
  background: ResolvedColorToken;
  backdrop?: ResolvedColorToken;
  calculation: ResolvedContrastCalculation;
}): TokenContrastCheck {
  return {
    theme: input.theme,
    mode: `theme-${input.theme}`,
    foreground: input.foreground,
    background: input.background,
    ...(input.backdrop ? { backdrop: input.backdrop } : {}),
    ...input.calculation,
  };
}

function isResolvedColor(
  resolution: ResolvedColorToken,
): resolution is ResolvedColorToken & { status: "resolved"; resolved: string } {
  return resolution.status === "resolved" && resolution.resolved !== undefined;
}

function needsBackdropCheck(input: {
  theme: ContrastTheme;
  foreground: ResolvedColorToken;
  background: ResolvedColorToken;
  backdrop?: ResolvedColorToken;
  reason: string;
}): TokenContrastCheck {
  return {
    theme: input.theme,
    mode: `theme-${input.theme}`,
    foreground: input.foreground,
    background: input.background,
    ...(input.backdrop ? { backdrop: input.backdrop } : {}),
    status: "needs-backdrop",
    reason: input.reason,
  };
}

function checkWithBackdrop(input: {
  catalog: RootageColorCatalog;
  request: TokenContrastRequest;
  theme: ContrastTheme;
  foreground: ResolvedColorToken & { status: "resolved"; resolved: string };
  background: ResolvedColorToken & { status: "resolved"; resolved: string };
  reason: string;
}): TokenContrastCheck {
  if (!input.request.backdrop) {
    return needsBackdropCheck({
      theme: input.theme,
      foreground: input.foreground,
      background: input.background,
      reason: input.reason,
    });
  }

  const backdrop = resolveColorToken(input.catalog, input.request.backdrop, input.theme);
  if (!isResolvedColor(backdrop)) {
    return {
      theme: input.theme,
      mode: `theme-${input.theme}`,
      foreground: input.foreground,
      background: input.background,
      backdrop,
      status: "unresolved",
      reason: unresolvedReason(backdrop),
    };
  }
  const calculation = calculateColorContrast(
    input.foreground.resolved,
    input.background.resolved,
    backdrop.resolved,
  );
  if (calculation.status === "needs-backdrop") {
    return needsBackdropCheck({
      theme: input.theme,
      foreground: input.foreground,
      background: input.background,
      backdrop,
      reason: calculation.reason,
    });
  }
  return resolvedCheck({
    theme: input.theme,
    foreground: input.foreground,
    background: input.background,
    backdrop,
    calculation,
  });
}

function makeContrastCheck(
  catalog: RootageColorCatalog,
  request: TokenContrastRequest,
  theme: ContrastTheme,
  foreground: ResolvedColorToken,
  backgroundInput: string,
): TokenContrastCheck {
  const background = resolveColorToken(catalog, backgroundInput, theme);
  if (!isResolvedColor(foreground) || !isResolvedColor(background)) {
    return unresolvedCheck({ theme, foreground, background });
  }

  const calculation = calculateColorContrast(foreground.resolved, background.resolved);
  if (calculation.status === "resolved") {
    return resolvedCheck({ theme, foreground, background, calculation });
  }
  return checkWithBackdrop({
    catalog,
    request,
    theme,
    foreground,
    background,
    reason: calculation.reason,
  });
}

function contrastChecks(
  catalog: RootageColorCatalog,
  request: TokenContrastRequest,
): TokenContrastCheck[] {
  return request.themes.flatMap((theme) => {
    const foreground = resolveColorToken(catalog, request.foreground, theme);
    return request.backgrounds.map((background) =>
      makeContrastCheck(catalog, request, theme, foreground, background),
    );
  });
}

function warningsFor(checks: readonly TokenContrastCheck[]): string[] {
  const needsBackdrop = checks.filter(({ status }) => status === "needs-backdrop").length;
  const unresolved = checks.filter(({ status }) => status === "unresolved").length;
  return uniqueSorted([
    ...(needsBackdrop > 0
      ? [`${needsBackdrop}개 조합은 반투명 배경 아래의 불투명한 backdrop이 필요합니다.`]
      : []),
    ...(unresolved > 0 ? [`${unresolved}개 조합에서 색상 토큰을 해석하지 못했습니다.`] : []),
  ]);
}

/** 현재 체크아웃의 Rootage 색상 토큰 조합에서 WCAG 2.x 대비를 계산합니다. */
export async function analyzeSeedTokenContrast(
  input: TokenContrastInput,
): Promise<TokenContrastResult> {
  const request = contrastRequest(input);
  const repositoryRoot = await findSeedRepositoryRoot();
  const catalog = await loadRootageColor(repositoryRoot);
  const checks = contrastChecks(catalog, request);
  const ratios = checks.flatMap(({ ratio }) => (ratio === undefined ? [] : [ratio]));
  return {
    status: checks.every(({ status }) => status === "resolved") ? "ok" : "partial",
    source: catalog.path,
    request,
    checks,
    ...(ratios.length > 0 ? { minimumRatio: Math.min(...ratios) } : {}),
    warnings: warningsFor(checks),
    readOnly: true,
  };
}

interface ContrastCliOptions {
  foreground?: string;
  backgrounds: string[];
  themes: ContrastTheme[];
  backdrop?: string;
}

type CliOptionSetter = (result: ContrastCliOptions, value: string) => void;

function setForeground(result: ContrastCliOptions, value: string): void {
  if (result.foreground) throw new Error("--foreground는 한 번만 지정할 수 있습니다.");
  result.foreground = value;
}

function addBackground(result: ContrastCliOptions, value: string): void {
  result.backgrounds.push(value);
}

function addTheme(result: ContrastCliOptions, value: string): void {
  result.themes.push(validateTheme(value));
}

function setBackdrop(result: ContrastCliOptions, value: string): void {
  if (result.backdrop) throw new Error("--backdrop은 한 번만 지정할 수 있습니다.");
  result.backdrop = value;
}

const CLI_OPTION_SETTERS: Record<string, CliOptionSetter> = {
  "--foreground": setForeground,
  "--background": addBackground,
  "--theme": addTheme,
  "--backdrop": setBackdrop,
};

function setCliOption(result: ContrastCliOptions, option: string, value: string): void {
  const setter = CLI_OPTION_SETTERS[option];
  if (!setter) throw new Error(`알 수 없는 옵션입니다: ${option}`);
  setter(result, value);
}

function parseCliPairs(args: string[]): ContrastCliOptions {
  const result: ContrastCliOptions = { backgrounds: [], themes: [] };
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!option || !value) throw new Error(`값이 필요합니다: ${option ?? "옵션"}`);
    setCliOption(result, option, value);
  }
  return result;
}

function validateCliOptions(result: ContrastCliOptions): asserts result is ContrastCliOptions & {
  foreground: string;
} {
  if (!result.foreground) throw new Error("--foreground가 필요합니다.");
  if (result.backgrounds.length === 0) throw new Error("--background가 하나 이상 필요합니다.");
}

function cliInput(result: ContrastCliOptions & { foreground: string }): TokenContrastInput {
  const input: TokenContrastInput = {
    foreground: result.foreground,
    backgrounds: result.backgrounds,
  };
  if (result.themes.length > 0) input.themes = result.themes;
  if (result.backdrop) input.backdrop = result.backdrop;
  return input;
}

function parseCli(args: string[]): TokenContrastInput {
  const result = parseCliPairs(args);
  try {
    validateCliOptions(result);
  } catch {
    throw new Error(
      "사용법: bun skills/seed-token-analysis/scripts/token-contrast.ts --foreground <token> --background <token> [--background <token>] [--theme light|dark] [--backdrop <token>]",
    );
  }
  return cliInput(result);
}

async function runCli(args: string[]): Promise<void> {
  try {
    process.stdout.write(
      `${JSON.stringify(await analyzeSeedTokenContrast(parseCli(args)), null, 2)}\n`,
    );
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (import.meta.main) await runCli(Bun.argv.slice(2));
