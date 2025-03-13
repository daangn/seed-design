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
  m: { next: string[]; alternative?: string[]; description?: string },
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

// TodoInfo 타입 정의
interface TodoInfo {
  description: string;
  token: string;
}

// 단일 유틸리티 토큰에 대해 즉시 처리 (간소화 버전)
// border 관련 토큰과 일반 토큰을 모두 처리합니다.
function transformUtilityTokenSimple(token: string, todosToAdd: Set<TodoInfo>): string {
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

        // next와 alternative가 모두 없고 description이 있는 경우
        if (
          (!m.next || m.next.length === 0) &&
          (!m.alternative || m.alternative.length === 0) &&
          m.description
        ) {
          // TODO 정보 추가
          todosToAdd.add({ description: m.description, token: baseToken });
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

        // next와 alternative가 모두 없고 description이 있는 경우
        if (
          (!m.next || m.next.length === 0) &&
          (!m.alternative || m.alternative.length === 0) &&
          m.description
        ) {
          // TODO 정보 추가
          todosToAdd.add({ description: m.description, token });
        }
      }
    }
  }
  return token;
}

// modifier가 포함된 토큰(ex: hover:bg-blue500, after:border-t-gray200) 처리
function transformTailwindColorTokenSimple(token: string, todosToAdd: Set<TodoInfo>): string {
  if (token.includes(":")) {
    const parts = token.split(":");
    // 마지막 요소가 실제 색상 토큰
    const utilityToken = parts.pop()!;
    const transformedUtility = transformUtilityTokenSimple(utilityToken, todosToAdd);
    return parts.concat(transformedUtility).join(":");
  }
  return transformUtilityTokenSimple(token, todosToAdd);
}

// 전체 Tailwind 클래스 문자열 처리: 공백으로 분리 후 각 토큰 변환
function transformTailwindClassesSimple(classStr: string, todosToAdd: Set<TodoInfo>): string {
  const classNames = classStr.split(" ");
  const newClassNames = classNames.map((cn) => transformTailwindColorTokenSimple(cn, todosToAdd));
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

  // JSX 요소의 className 속성 처리
  root.find(j.JSXAttribute, { name: { name: "className" } }).forEach((path) => {
    const attributeValue = path.node.value;
    if (!attributeValue) return;

    // TODO 정보를 저장할 Set
    const todosToAdd = new Set<TodoInfo>();

    // StringLiteral 처리
    if (attributeValue.type === "StringLiteral") {
      const original = attributeValue.value;
      const transformed = transformTailwindClassesSimple(original, todosToAdd);

      if (original !== transformed && reporterInstance) {
        reporterInstance.addResult({
          previousToken: original,
          nextToken: transformed,
          status: "success",
          line: attributeValue.loc?.start.line,
        });
      }
      attributeValue.value = transformed;
    }

    // JSXExpressionContainer 내부의 StringLiteral 처리
    else if (
      attributeValue.type === "JSXExpressionContainer" &&
      attributeValue.expression.type === "StringLiteral"
    ) {
      const original = attributeValue.expression.value;
      const transformed = transformTailwindClassesSimple(original, todosToAdd);

      if (original !== transformed && reporterInstance) {
        reporterInstance.addResult({
          previousToken: original,
          nextToken: transformed,
          status: "success",
          line: attributeValue.expression.loc?.start.line,
        });
      }
      attributeValue.expression.value = transformed;
    }

    // TemplateLiteral 처리
    else if (
      attributeValue.type === "JSXExpressionContainer" &&
      attributeValue.expression.type === "TemplateLiteral"
    ) {
      const templateLiteral = attributeValue.expression;
      templateLiteral.quasis.forEach((elem) => {
        const original = elem.value.raw;
        const transformed = transformTailwindClassesSimple(original, todosToAdd);

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
    }

    // TODO 주석 추가
    if (todosToAdd.size > 0 && reporterInstance) {
      for (const todoInfo of todosToAdd) {
        reporterInstance.addResult({
          previousToken: todoInfo.token,
          nextToken: todoInfo.token,
          status: "warning",
          failureReason: todoInfo.description,
          line: path.node.loc?.start.line,
        });
      }
    }
  });

  // StringLiteral 내 Tailwind 클래스 처리 (JSX 요소 외부)
  root.find(j.StringLiteral).forEach((path) => {
    // JSXAttribute 내부의 StringLiteral은 건너뛰기
    if (
      path.parent.node.type === "JSXAttribute" ||
      (path.parent.node.type === "JSXExpressionContainer" &&
        path.parent.parent.node.type === "JSXAttribute")
    ) {
      return;
    }

    // TODO 정보를 저장할 Set
    const todosToAdd = new Set<TodoInfo>();

    const original = path.node.value;
    const transformed = transformTailwindClassesSimple(original, todosToAdd);

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

  // TemplateLiteral 내부 문자(quasis) 처리 (JSX 요소 외부)
  root.find(j.TemplateLiteral).forEach((path) => {
    // JSXAttribute 내부의 TemplateLiteral은 건너뛰기
    if (
      path.parent.node.type === "JSXExpressionContainer" &&
      path.parent.parent.node.type === "JSXAttribute"
    ) {
      return;
    }

    path.node.quasis.forEach((elem) => {
      // TODO 정보를 저장할 Set
      const todosToAdd = new Set<TodoInfo>();

      const original = elem.value.raw;
      const transformed = transformTailwindClassesSimple(original, todosToAdd);

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
