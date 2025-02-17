import { colorMappings } from "@seed-design/migration-index/color";
import type { FoundationTokenMapping } from "@seed-design/migration-index";
import { camelCase } from "change-case";

export type ColorPrefix =
  | "text"
  | "bg"
  | "stroke"
  | "fill"
  | "accent"
  | "caret"
  | "decoration"
  | "border"
  | "shadow"
  | "inset-shadow"
  | "ring"
  | "inset-ring";

// 상수로 prefix 매핑 정의
const PREFIX_MAP: Record<ColorPrefix, string> = {
  bg: "$color.bg",
  text: "$color.fg",
  stroke: "$color.stroke",
  fill: "$color.bg",
  accent: "$color.palette",
  caret: "$color.palette",
  decoration: "$color.palette",
  border: "$color.stroke",
  shadow: "$color.palette",
  "inset-shadow": "$color.palette",
  ring: "$color.stroke",
  "inset-ring": "$color.stroke",
};

// next 토큰 선택: 매핑된 토큰 (fg, bg, stroke, palette) 중 첫 번째 매칭 토큰 반환, 없으면 palette fallback
function selectNextToken(prefix: ColorPrefix, tokens: string[]): string[] {
  const prefixValue = PREFIX_MAP[prefix];
  const foundToken = tokens.find((token) => token.startsWith(prefixValue));
  if (foundToken) return [foundToken];

  // fallback: tokens에서 palette 토큰 존재 여부 확인
  const paletteToken = tokens.find((token) => token.startsWith("$color.palette"));
  if (paletteToken) return [paletteToken];

  return tokens.length ? [tokens[0]] : [];
}

// 이전 토큰 정규화: 불필요 접두사 제거 후 CamelCase 변환
function normalizePreviousToken(previous: string): string {
  const stripped = previous
    .replace(/^\$(semantic|static|scale)\.color\./, "")
    .split(".")
    .join("-");
  return camelCase(stripped, { mergeAmbiguousCharacters: true });
}

// next 토큰 변환: 해당 접두사 제거 후 prefix 추가
function transformNextToken(prefix: ColorPrefix, token: string): string {
  const transformations: [string, string][] = [
    ["$color.palette.", `${prefix}-`],
    ["$color.stroke.", `${prefix}-`],
    ["$color.bg.", `${prefix}-`],
    ["$color.fg.", `${prefix}-`],
  ];
  for (const [source, replacement] of transformations) {
    if (token.startsWith(source)) return token.replace(source, replacement);
  }
  return token;
}

// 기본 색상 매핑 생성
function createColorMappings(prefix: ColorPrefix): FoundationTokenMapping[] {
  return colorMappings.map((mapping) => ({
    previous: `${prefix}-${normalizePreviousToken(mapping.previous)}`,
    next: selectNextToken(prefix, mapping.next).map((token) => transformNextToken(prefix, token)),
  }));
}

// 상태 매핑 생성: hover, focus, active 등의 상태 prefix 부여
function createStateColorMappings(
  state: string,
  mappings: FoundationTokenMapping[],
): FoundationTokenMapping[] {
  return mappings.map((mapping) => ({
    previous: `${state}:${mapping.previous}`,
    next: mapping.next.map((token) => `${state}:${token}`),
  }));
}

// 텍스트 및 배경 색상 매핑 생성
export const textColorMappings = createColorMappings("text");
export const bgColorMappings = createColorMappings("bg");

// 상태별 매핑 생성
const states = ["hover", "focus", "active"] as const;
export const stateTextColorMappings = states.flatMap((state) =>
  createStateColorMappings(state, textColorMappings),
);
export const stateBgColorMappings = states.flatMap((state) =>
  createStateColorMappings(state, bgColorMappings),
);

// 모든 매핑 합치기
export const allColorMappings = [
  ...textColorMappings,
  ...bgColorMappings,
  ...stateTextColorMappings,
  ...stateBgColorMappings,
];
