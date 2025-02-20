import type { Transform } from "jscodeshift";
import { colorMappings } from "@seed-design/migration-index/color";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";
import { camelCase, kebabCase } from "change-case";

function normalizePreviousToken(previous: string): string {
  const stripped = previous
    .replace(/^\$(semantic|static|scale)\.color\./, "")
    .split(".")
    .join("-");
  return camelCase(stripped, { mergeAmbiguousCharacters: true });
}

function transformColorProp(value: string): string {
  // 이미 palette- 형식이면 변환하지 않음
  if (value.startsWith("palette-")) return value;

  // semantic color mapping에서 매칭 시도
  for (const mapping of colorMappings) {
    const normalizedPrevious = normalizePreviousToken(mapping.previous);
    if (normalizedPrevious === value) {
      // palette 토큰 우선 선택
      const paletteToken = mapping.next.find((token) => token.startsWith("$color.palette"));
      if (paletteToken) {
        return `palette-${kebabCase(paletteToken.replace("$color.palette.", ""))}`;
      }

      // alternative에서 palette 토큰 검색
      if (mapping.alternative) {
        const altPaletteToken = mapping.alternative.find((token) =>
          token.startsWith("$color.palette"),
        );
        if (altPaletteToken) {
          return `palette-${kebabCase(altPaletteToken.replace("$color.palette.", ""))}`;
        }
      }
    }
  }

  // 직접 매핑: camelCase를 kebab-case로 변환
  // 예: gray100 -> palette-gray-100
  const matches = value.match(/^([a-z]+)(\d+)$/);
  if (matches) {
    const [, color, number] = matches;
    return `palette-${color}-${number}`;
  }

  // static 색상 매핑: camelCase를 kebab-case로 변환
  // 예: staticBlack -> palette-static-black
  if (value.startsWith("static")) {
    return `palette-${kebabCase(value)}`;
  }

  return value;
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { reporter } = inferredOptions;
  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReporter | null = null;
  if (reporter) {
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

      if (
        colorAttr &&
        colorAttr.type === "JSXAttribute" &&
        colorAttr.value?.type === "StringLiteral"
      ) {
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
      }
    });

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource();
};

export default transform;
