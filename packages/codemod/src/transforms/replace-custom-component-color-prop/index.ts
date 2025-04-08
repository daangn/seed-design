import { colorMappings } from "@seed-design/migration-index/color";
import { camelCase } from "change-case";
import type { Transform } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";
import { getTokenTypeForProperty } from "../../utils/color-properties.js";

const TRANSFORM_NAME = "replace-custom-component-color-prop";

/**
 * 지원하는 Box 컴포넌트 목록
 * Box를 확장한 컴포넌트들도 포함합니다.
 */
const BOX_COMPONENTS = ["Box", "Stack", "HStack", "VStack"];

/**
 * 컬러 속성이 있는 React 컴포넌트의 속성 목록
 */
const COLOR_PROPS = ["color", "defaultColor", "activeColor"];

/**
 * Box 컴포넌트의 컬러 속성 목록
 */
const BOX_COLOR_PROPS = {
  bg: "background", // background 속성에 해당하므로 bg 토큰으로 변환
  bc: "borderColor", // border 속성에 해당하므로 stroke 토큰으로 변환
};

function normalizePreviousToken(previous: string): string {
  const stripped = previous
    .replace(/^\$(semantic|static|scale)\.color\./, "")
    .split(".")
    .join("-");
  return camelCase(stripped, { mergeAmbiguousCharacters: true });
}

/**
 * 컬러 토큰의 컨텍스트에 따라 적절한 토큰 타입을 선택합니다.
 *
 * @param mapping 색상 매핑 정보
 * @param propertyName CSS 속성 이름 (background, borderColor 등)
 * @returns 선택된 토큰 값
 */
function selectMappingToken(
  mapping: { next: string[]; alternative?: string[] },
  propertyName?: string,
): string | null {
  const tokenType = getTokenTypeForProperty(propertyName);

  // 1. 속성에 맞는 semantic 토큰 찾기
  const semanticToken = mapping.next.find((t) => t.startsWith(`$color.${tokenType}`));
  if (semanticToken) return semanticToken;

  // 2. next에서 palette 토큰 찾기
  const paletteTokenInNext = mapping.next.find((t) => t.startsWith("$color.palette"));
  if (paletteTokenInNext) return paletteTokenInNext;

  // 3. alternative에서 palette 토큰 찾기
  if (mapping.alternative && mapping.alternative.length > 0) {
    const paletteTokenInAlternative = mapping.alternative.find((t) =>
      t.startsWith("$color.palette"),
    );
    if (paletteTokenInAlternative) return paletteTokenInAlternative;
  }

  return null;
}

/**
 * 색상 값을 V3 토큰 형식으로 변환합니다.
 *
 * @param value 원본 색상 값
 * @param propertyName CSS 속성 이름
 * @returns 변환된 색상 값
 */
function transformColorValue(value: string, propertyName?: string): string {
  // 이미 변환된 값은 건너뛰기
  if (value.includes(".")) return value;

  for (const mapping of colorMappings) {
    const normalizedPrevious = normalizePreviousToken(mapping.previous);

    if (normalizedPrevious === value) {
      const chosenToken = selectMappingToken(mapping, propertyName);
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

const transform: Transform = (file, api) => {
  const logger = createTransformLogger(TRANSFORM_NAME);
  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  // 1. Text 컴포넌트의 color prop 찾기
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
        const transformedValue = transformColorValue(originalValue, "color");

        if (originalValue !== transformedValue) {
          colorAttr.value.value = transformedValue;

          logger.logTransformResult(file.path, {
            previousToken: originalValue,
            nextToken: transformedValue,
            status: "success",
            line: colorAttr.loc?.start.line,
          });
        }
      } else if (colorAttr.value?.type === "JSXExpressionContainer") {
        // 조건부 표현식 처리
        const expression = colorAttr.value.expression;
        if (expression.type === "ConditionalExpression") {
          // 조건부 표현식의 consequent(참일 때)와 alternate(거짓일 때) 모두 처리
          if (expression.consequent.type === "StringLiteral") {
            const originalValue = expression.consequent.value;
            const transformedValue = transformColorValue(originalValue, "color");
            expression.consequent.value = transformedValue;
          }
          if (expression.alternate.type === "StringLiteral") {
            const originalValue = expression.alternate.value;
            const transformedValue = transformColorValue(originalValue, "color");
            expression.alternate.value = transformedValue;
          }

          logger.logTransformResult(file.path, {
            previousToken: "conditional expression",
            nextToken: "transformed conditional expression",
            status: "success",
            line: colorAttr.loc?.start.line,
          });
        } else if (expression.type === "StringLiteral") {
          // 중괄호로 감싸진 문자열 처리 (예: color={"gray100"})
          const originalValue = expression.value;
          const transformedValue = transformColorValue(originalValue, "color");

          if (originalValue !== transformedValue) {
            expression.value = transformedValue;

            logger.logTransformResult(file.path, {
              previousToken: originalValue,
              nextToken: transformedValue,
              status: "success",
              line: colorAttr.loc?.start.line,
            });
          }
        }
      }
    });

  // 2. Box 컴포넌트의 bg, bc 속성 변환
  root
    .find(j.JSXElement)
    .filter((path) => {
      const elementName = path.node.openingElement.name;
      return elementName.type === "JSXIdentifier" && BOX_COMPONENTS.includes(elementName.name);
    })
    .forEach((path) => {
      const openingElement = path.node.openingElement;

      // bg, bc 속성 찾기
      Object.entries(BOX_COLOR_PROPS).forEach(([propName, cssProperty]) => {
        const colorAttr = openingElement.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name.name === propName,
        );

        if (!colorAttr || colorAttr.type !== "JSXAttribute") return;

        // 문자열 리터럴 처리
        if (colorAttr.value?.type === "StringLiteral") {
          const originalValue = colorAttr.value.value;
          const transformedValue = transformColorValue(originalValue, cssProperty);

          if (originalValue !== transformedValue) {
            colorAttr.value.value = transformedValue;

            logger.logTransformResult(file.path, {
              previousToken: originalValue,
              nextToken: transformedValue,
              status: "success",
              line: colorAttr.loc?.start.line,
            });
          }
        }
        // JSX 표현식 컨테이너 처리 (중괄호로 감싼 표현식)
        else if (colorAttr.value?.type === "JSXExpressionContainer") {
          const expression = colorAttr.value.expression;

          // 문자열 리터럴 처리
          if (expression.type === "StringLiteral") {
            const originalValue = expression.value;
            const transformedValue = transformColorValue(originalValue, cssProperty);

            if (originalValue !== transformedValue) {
              expression.value = transformedValue;

              logger.logTransformResult(file.path, {
                previousToken: originalValue,
                nextToken: transformedValue,
                status: "success",
                line: colorAttr.loc?.start.line,
              });
            }
          }
          // 삼항 연산자 처리
          else if (expression.type === "ConditionalExpression") {
            // 조건부 표현식의 consequent(참일 때)와 alternate(거짓일 때) 모두 처리
            if (expression.consequent.type === "StringLiteral") {
              const originalValue = expression.consequent.value;
              const transformedValue = transformColorValue(originalValue, cssProperty);
              expression.consequent.value = transformedValue;
            }

            if (expression.alternate.type === "StringLiteral") {
              const originalValue = expression.alternate.value;
              const transformedValue = transformColorValue(originalValue, cssProperty);
              expression.alternate.value = transformedValue;
            }

            logger.logTransformResult(file.path, {
              previousToken: "conditional expression",
              nextToken: "transformed conditional expression",
              status: "success",
              line: colorAttr.loc?.start.line,
            });
          }
        }
      });
    });

  // 3. 일반 컴포넌트의 color, defaultColor, activeColor 속성 변환
  root.find(j.JSXElement).forEach((path) => {
    const openingElement = path.node.openingElement;

    // Text, Box 제외한 나머지 컴포넌트의 color 관련 속성 찾기
    COLOR_PROPS.forEach((propName) => {
      const colorAttr = openingElement.attributes.find(
        (attr) => attr.type === "JSXAttribute" && attr.name.name === propName,
      );

      if (!colorAttr || colorAttr.type !== "JSXAttribute") return;

      // Text 컴포넌트는 이미 처리했으므로 건너뛰기
      if (openingElement.name.type === "JSXIdentifier" && openingElement.name.name === "Text")
        return;

      // 문자열 리터럴 처리
      if (colorAttr.value?.type === "StringLiteral") {
        const originalValue = colorAttr.value.value;
        const transformedValue = transformColorValue(originalValue, "color");

        if (originalValue !== transformedValue) {
          colorAttr.value.value = transformedValue;

          logger.logTransformResult(file.path, {
            previousToken: originalValue,
            nextToken: transformedValue,
            status: "success",
            line: colorAttr.loc?.start.line,
          });
        }
      }
      // JSX 표현식 컨테이너 처리 (중괄호로 감싼 표현식)
      else if (colorAttr.value?.type === "JSXExpressionContainer") {
        const expression = colorAttr.value.expression;

        // 문자열 리터럴 처리
        if (expression.type === "StringLiteral") {
          const originalValue = expression.value;
          const transformedValue = transformColorValue(originalValue, "color");

          if (originalValue !== transformedValue) {
            expression.value = transformedValue;

            logger.logTransformResult(file.path, {
              previousToken: originalValue,
              nextToken: transformedValue,
              status: "success",
              line: colorAttr.loc?.start.line,
            });
          }
        }
        // 삼항 연산자 처리
        else if (expression.type === "ConditionalExpression") {
          // 조건부 표현식의 consequent(참일 때)와 alternate(거짓일 때) 모두 처리
          if (expression.consequent.type === "StringLiteral") {
            const originalValue = expression.consequent.value;
            const transformedValue = transformColorValue(originalValue, "color");
            expression.consequent.value = transformedValue;
          }

          if (expression.alternate.type === "StringLiteral") {
            const originalValue = expression.alternate.value;
            const transformedValue = transformColorValue(originalValue, "color");
            expression.alternate.value = transformedValue;
          }

          logger.logTransformResult(file.path, {
            previousToken: "conditional expression",
            nextToken: "transformed conditional expression",
            status: "success",
            line: colorAttr.loc?.start.line,
          });
        }
      }
    });
  });

  // 4. getSeedColor 함수 호출 변환
  root
    .find(j.CallExpression, {
      callee: {
        type: "Identifier",
        name: "getSeedColor",
      },
    })
    .forEach((path) => {
      const args = path.node.arguments;
      if (args.length === 0) return;

      const firstArg = args[0];
      if (firstArg.type === "StringLiteral") {
        const originalValue = firstArg.value;
        // getSeedColor 함수가 사용되는 컨텍스트에 따라 속성을 유추
        let propertyName: string | undefined;

        // 부모 노드를 확인하여 속성 이름 유추
        let parent = path.parent;
        while (
          parent &&
          parent.node.type !== "JSXAttribute" &&
          parent.node.type !== "ObjectProperty"
        ) {
          parent = parent.parent;
        }

        if (
          parent &&
          (parent.node.type === "JSXAttribute" || parent.node.type === "ObjectProperty")
        ) {
          const name =
            parent.node.type === "JSXAttribute"
              ? parent.node.name.name
              : parent.node.key.type === "Identifier"
                ? parent.node.key.name
                : undefined;

          // 속성 이름에 따라 적절한 CSS 속성 매핑
          if (name === "color" || name === "textColor") {
            propertyName = "color";
          } else if (name === "backgroundColor" || name === "background" || name === "bg") {
            propertyName = "backgroundColor";
          } else if (name === "borderColor" || name === "border" || name === "bc") {
            propertyName = "borderColor";
          }
        }

        const transformedValue = transformColorValue(originalValue, propertyName);

        if (originalValue !== transformedValue) {
          firstArg.value = transformedValue;

          logger.logTransformResult(file.path, {
            previousToken: originalValue,
            nextToken: transformedValue,
            status: "success",
            line: firstArg.loc?.start.line,
          });
        }
      }
    });

  logger.finishFile(file.path);

  return root.toSource();
};

export default transform;
