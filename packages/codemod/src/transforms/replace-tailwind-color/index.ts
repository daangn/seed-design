import type { Transform } from "jscodeshift";
import { colorMappings } from "@seed-design/migration-index/color";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";
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

// 이전 토큰 정규화: 불필요 접두사 제거 후 camelCase 변환
function normalizePreviousToken(previous: string): string {
  const stripped = previous
    .replace(/^\$(semantic|static|scale)\.color\./, "")
    .split(".")
    .join("-");
  return camelCase(stripped, { mergeAmbiguousCharacters: true });
}

// next 토큰 변환: 해당 접두사에 맞는 문자로 치환
function transformNextToken(prefix: ColorPrefix, token: string): string {
  const transformations: [string, string][] = [
    ["$color.palette.", `${prefix}-palette-`],
    ["$color.stroke.", `${prefix}-stroke-`],
    ["$color.bg.", `${prefix}-bg-`],
    ["$color.fg.", `${prefix}-fg-`],
  ];
  for (const [source, replacement] of transformations) {
    if (token.startsWith(source)) return token.replace(source, replacement);
  }
  return token;
}

// 접두사에 대응하는 기준값. (선택 우선 순위에 활용)
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

// mapping의 next 및 alternative 토큰들 중 palette 토큰 우선 선택
function selectMappingToken(
  prefix: ColorPrefix,
  m: { next: string[]; alternative?: string[] },
): string | null {
  const tokenWithPrefix = m.next.find((t) => t.startsWith(PREFIX_MAP[prefix]));
  if (tokenWithPrefix) return tokenWithPrefix;

  const paletteTokenInNext = m.next.find((t) => t.startsWith("$color.palette"));
  if (paletteTokenInNext) return paletteTokenInNext;

  if (m.alternative && m.alternative.length > 0) {
    const paletteTokenInAlternative = m.alternative.find((t) => t.startsWith("$color.palette"));
    if (paletteTokenInAlternative) return paletteTokenInAlternative;
  }

  return null;
}
// 단일 유틸리티 토큰에 대해 즉시 처리 (간소화 버전)
// border 관련 토큰과 일반 토큰을 모두 처리합니다.
function transformUtilityTokenSimple(token: string): string {
  // Border 관련 토큰 처리 (예: border-t-gray200)
  const borderRegex = /^(border(?:-[trblxys]+)?)-(.+)$/;
  let match = token.match(borderRegex);
  if (match) {
    const directionPrefix = match[1]; // 예: "border-t"
    const rawColor = match[2]; // 예: "gray200" 또는 "gray-200"
    const baseToken = `border-${rawColor}`;
    for (const m of colorMappings) {
      const candidate = `border-${normalizePreviousToken(m.previous)}`;
      if (candidate === baseToken) {
        const chosenToken = selectMappingToken("border", m);
        if (chosenToken) {
          const newColorToken = transformNextToken("border", chosenToken);
          // border의 경우 기존 direction을 유지한 채 색상 부분만 변경
          return `${directionPrefix}-${newColorToken.replace(/^border-/, "")}`;
        }
      }
    }
    return token;
  }

  // 일반 유틸리티 토큰 처리 (예: text-primary, bg-blue500 등)
  const regex = /^([a-z]+)-(.+)$/;
  match = token.match(regex);
  if (match) {
    const prefix = match[1] as ColorPrefix;
    for (const m of colorMappings) {
      // migration index의 previous를 정규화하여 `${prefix}-${normalized}`로 구성
      const candidate = `${prefix}-${normalizePreviousToken(m.previous)}`;

      if (candidate === token) {
        const chosenToken = selectMappingToken(prefix, m);
        if (chosenToken) return transformNextToken(prefix, chosenToken);
      }
    }
  }
  return token;
}

// modifier가 포함된 토큰(ex: hover:bg-blue500, after:border-t-gray200) 처리
function transformTailwindColorTokenSimple(token: string): string {
  if (token.includes(":")) {
    const parts = token.split(":");
    // 마지막 요소가 실제 색상 토큰
    const utilityToken = parts.pop()!;
    const transformedUtility = transformUtilityTokenSimple(utilityToken);
    return parts.concat(transformedUtility).join(":");
  }
  return transformUtilityTokenSimple(token);
}

// 전체 Tailwind 클래스 문자열 처리: 공백으로 분리 후 각 토큰 변환
function transformTailwindClassesSimple(classStr: string): string {
  const classNames = classStr.split(" ");
  const newClassNames = classNames.map((cn) => transformTailwindColorTokenSimple(cn));
  return newClassNames.join(" ");
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { reporter } = inferredOptions;

  const j = api.jscodeshift;
  const root = j(file.source);
  let reporterInstance: TokenMigrationReporter | null = null;
  if (reporter) {
    reporterInstance = new TokenMigrationReporter("replace-tailwind-color");
    reporterInstance.startNewFile(file.path);
  }

  // StringLiteral 내 Tailwind 클래스 처리
  root.find(j.StringLiteral).forEach((path) => {
    const original = path.node.value;
    const transformed = transformTailwindClassesSimple(original);
    if (original !== transformed && reporterInstance) {
      reporterInstance.addResult({
        previousToken: original,
        nextToken: transformed,
        status: "success",
        line: path.node.loc?.start.line,
      });
    }
    path.node.value = transformed;
  });

  // TemplateLiteral 내부 문자(quasis) 처리
  root.find(j.TemplateLiteral).forEach((path) => {
    path.node.quasis.forEach((elem) => {
      const original = elem.value.raw;
      const transformed = transformTailwindClassesSimple(original);
      if (original !== transformed && reporterInstance) {
        reporterInstance.addResult({
          previousToken: original,
          nextToken: transformed,
          status: "success",
          line: elem.loc?.start.line,
        });
      }
      elem.value.raw = transformed;
      elem.value.cooked = transformed;
    });
  });

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource();
};

export default transform;
