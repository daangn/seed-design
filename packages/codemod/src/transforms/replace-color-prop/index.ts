import { colorMappings } from "@seed-design/migration-index/color";
import { camelCase } from "change-case";
import type { Transform } from "jscodeshift";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";
import { TokenMigrationReporter } from "../../utils/migration-reporter.js";

function normalizePreviousToken(previous: string): string {
  const stripped = previous
    .replace(/^\$(semantic|static|scale)\.color\./, "")
    .split(".")
    .join("-");
  return camelCase(stripped, { mergeAmbiguousCharacters: true });
}

function selectMappingToken(m: { next: string[]; alternative?: string[] }): string | null {
  // 1. next에서 fg semantic 찾기
  const fgTokenInNext = m.next.find((t) => t.startsWith("$color.fg"));
  if (fgTokenInNext) return fgTokenInNext;

  // 2. next에서 palette 토큰 찾기
  const paletteTokenInNext = m.next.find((t) => t.startsWith("$color.palette"));
  if (paletteTokenInNext) return paletteTokenInNext;

  // 3. alternative에서 palette 토큰 찾기
  if (m.alternative && m.alternative.length > 0) {
    const paletteTokenInAlternative = m.alternative.find((t) => t.startsWith("$color.palette"));
    if (paletteTokenInAlternative) return paletteTokenInAlternative;
  }

  return null;
}

function transformColorProp(value: string): string {
  // 이미 변환된 값은 건너뛰기
  if (value.includes(".")) return value;

  for (const mapping of colorMappings) {
    const normalizedPrevious = normalizePreviousToken(mapping.previous);

    if (normalizedPrevious === value) {
      const chosenToken = selectMappingToken(mapping);
      if (chosenToken) {
        // $color.palette.gray-200 -> palette.gray200
        // $color.fg.brand -> fg.brand
        return chosenToken
          .replace("$color.", "")
          .split(".")
          .map((part, index) =>
            index === 0 ? part : camelCase(part, { mergeAmbiguousCharacters: true }),
          )
          .join(".");
      }
    }
  }

  // mapping을 찾지 못한 경우 기본 palette 형식으로 변환
  return `palette.${value}`;
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { migrationReporter } = inferredOptions;
  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReporter | null = null;
  if (migrationReporter) {
    reporterInstance = new TokenMigrationReporter("replace-color-prop");
    reporterInstance.startNewFile(file.path);
  }

  // Text 컴포넌트의 color prop 찾기
  root
    .find(j.JSXElement)
    .filter((path) => {
      const elementName = path.node.openingElement.name;
      return elementName.type === "JSXIdentifier" && elementName.name === "Text";
    })
    .forEach((path) => {
      const openingElement = path.node.openingElement;
      const colorAttr = openingElement.attributes.find(
        (attr) => attr.type === "JSXAttribute" && attr.name.name === "color",
      );

      if (!colorAttr || colorAttr.type !== "JSXAttribute") return;

      if (colorAttr.value?.type === "StringLiteral") {
        // 일반 문자열 값 처리
        const originalValue = colorAttr.value.value;
        const transformedValue = transformColorProp(originalValue);

        if (originalValue !== transformedValue) {
          colorAttr.value.value = transformedValue;

          if (reporterInstance) {
            reporterInstance.addResult({
              previousToken: originalValue,
              nextToken: transformedValue,
              status: "success",
              line: colorAttr.loc?.start.line,
            });
          }
        }
      } else if (colorAttr.value?.type === "JSXExpressionContainer") {
        // 조건부 표현식 처리
        const expression = colorAttr.value.expression;
        if (expression.type === "ConditionalExpression") {
          // 조건부 표현식의 consequent(참일 때)와 alternate(거짓일 때) 모두 처리
          if (expression.consequent.type === "StringLiteral") {
            expression.consequent.value = transformColorProp(expression.consequent.value);
          }
          if (expression.alternate.type === "StringLiteral") {
            expression.alternate.value = transformColorProp(expression.alternate.value);
          }

          if (reporterInstance) {
            reporterInstance.addResult({
              previousToken: "conditional expression",
              nextToken: "transformed conditional expression",
              status: "success",
              line: colorAttr.loc?.start.line,
            });
          }
        }
      }
    });

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource();
};

export default transform;
