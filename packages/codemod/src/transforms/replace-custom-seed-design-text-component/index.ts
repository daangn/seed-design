import { colorMappings } from "@seed-design/migration-index";
import { typographyMappings } from "@seed-design/migration-index/typography";
import type { Transform } from "jscodeshift";
import { getTokenTypeForProperty } from "../../utils/color-properties.js";
import { createTransformLogger } from "../../utils/logger.js";

// Typography 속성명 목록 - variant 뿐만 아니라 다양한 속성 지원
const TYPOGRAPHY_PROPS = ["variant", "typography", "textStyle", "typographyVariant"];

// Color 속성명 목록 - color 뿐만 아니라 다양한 속성 지원
const COLOR_PROPS = ["color", "textColor", "fontColor"];

/**
 * Typography 값을 textStyle 값으로 변환하는 함수
 * @param value 이전 typography 값 (예: "title2Bold", "$semantic.bodyL1Regular")
 * @returns 새 textStyle 값 (예: "t7Bold", "articleBody") 또는 null (매핑 없을 경우)
 */
function transformTypographyValue(value: string): string | null {
  // $semantic., $scale. 등의 접두사 제거
  const cleanValue = value.replace(/^\$(semantic|scale|static)\./, "");

  // 매핑 찾기 - 여러 패턴으로 시도
  let mapping = typographyMappings.find((m) => {
    const tokenParts = m.previous.split(".");
    const lastPart = tokenParts[tokenParts.length - 1];
    return lastPart === cleanValue || lastPart === value || m.previous === value;
  });

  // 직접 매칭이 안되면 $semantic.typography. 접두사를 붙여서 시도
  if (!mapping) {
    const semanticToken = `$semantic.typography.${cleanValue}`;
    mapping = typographyMappings.find((m) => m.previous === semanticToken);
  }

  if (!mapping) return null;

  // next 배열에 요소가 있으면 첫 번째 요소 사용
  if (mapping.next && mapping.next.length > 0) {
    return mapping.next[0];
  }

  // next 배열이 비어있고 alternative 배열이 있으면 첫 번째 alternative 사용
  if (
    (!mapping.next || mapping.next.length === 0) &&
    mapping.alternative &&
    mapping.alternative.length > 0
  ) {
    return mapping.alternative[0];
  }

  // 둘 다 없으면 null 반환
  return null;
}

/**
 * Color 값을 적절한 색상 토큰으로 변환하는 함수
 * @param value 이전 color 값 (예: "$scale.gray700", "$palette-gray-700")
 * @param propertyName 속성명 (색상 타입 결정용)
 * @returns 새 color 값 (예: "palette.gray700") 또는 null (매핑 없을 경우)
 */
function transformColorValue(value: string, propertyName?: string): string | null {
  // 이미 변환된 형태인지 확인 (palette.*, bg.*, fg.*, stroke.*)
  if (/^(palette|bg|fg|stroke)\.[a-zA-Z0-9]+/.test(value)) {
    return value;
  }

  // $로 시작하지 않으면 변환하지 않음
  if (!value.startsWith("$")) {
    return value; // 기존 값 유지
  }

  // $semantic., $scale., $static. 형태를 정규화하고 kebab-case로 변환
  let normalizedValue = value;
  if (value.startsWith("$scale.")) {
    const colorPart = value.replace("$scale.", "");
    // camelCase를 kebab-case로 변환 (gray600 -> gray-600)
    const kebabCase = colorPart
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([a-zA-Z])(\d+)/g, "$1-$2")
      .toLowerCase();
    normalizedValue = `$scale.color.${kebabCase}`;
  } else if (value.startsWith("$semantic.")) {
    const colorPart = value.replace("$semantic.", "");
    const kebabCase = colorPart
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([a-zA-Z])(\d+)/g, "$1-$2")
      .toLowerCase();
    normalizedValue = `$semantic.color.${kebabCase}`;
  } else if (value.startsWith("$static.")) {
    const colorPart = value.replace("$static.", "");
    const kebabCase = colorPart
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([a-zA-Z])(\d+)/g, "$1-$2")
      .toLowerCase();
    normalizedValue = `$static.color.${kebabCase}`;
  }

  // 매핑에서 찾기
  const mapping = colorMappings.find((m) => m.previous === normalizedValue);

  if (!mapping || !mapping.next || mapping.next.length === 0) {
    return value; // 매핑이 없으면 기존 값 유지
  }

  // 속성에 따라 적절한 토큰 타입 결정
  const tokenType = propertyName ? getTokenTypeForProperty(propertyName) : "fg";

  // 적절한 토큰 선택
  let selectedToken = mapping.next.find((token) => token.includes(`$color.${tokenType}.`));

  // 선호 타입이 없으면 다른 타입 시도
  if (!selectedToken) {
    selectedToken =
      mapping.next.find((token) => token.includes("$color.fg.")) ||
      mapping.next.find((token) => token.includes("$color.palette.")) ||
      mapping.next[0];
  }

  if (!selectedToken) {
    return value; // 선택된 토큰이 없으면 기존 값 유지
  }

  // $color.palette.gray-700 -> palette.gray700 형태로 변환
  const parts = selectedToken.split(".");
  if (parts.length >= 3 && parts[0] === "$color") {
    const category = parts[1]; // palette, bg, fg, stroke
    const colorName = parts.slice(2).join(".").replace(/-/g, ""); // gray-700 -> gray700
    return `${category}.${colorName}`;
  }

  return value; // 기본값 유지
}

/**
 * import 문을 처리하는 함수
 */
function handleImports(j: any, root: any, hasTransformedComponents: boolean) {
  // 변환된 컴포넌트가 없으면 import를 수정하지 않음
  if (!hasTransformedComponents) {
    return;
  }

  // 기존 Text 컴포넌트 import 찾기
  const textImports = root.find(j.ImportDeclaration, {
    source: { value: "components/Base/Text" },
  });

  // Text import가 없으면 처리하지 않음
  if (textImports.length === 0) {
    return;
  }

  // 파일 상단 주석 보존
  const fileComments = root.get().node.comments || [];

  // 기존 import를 @seed-design/react로 교체
  textImports.forEach((path: any) => {
    // 주석 보존
    const importComments = path.node.comments || [];

    // Text를 default import로 가져오는지 확인
    const defaultSpecifier = path.node.specifiers.find(
      (specifier: any) => specifier.type === "ImportDefaultSpecifier",
    );

    if (defaultSpecifier) {
      // 이 import 문을 @seed-design/react import로 대체
      path.node.source.value = "@seed-design/react";
      path.node.specifiers = [j.importSpecifier(j.identifier("Text"))];
    }

    // 주석 다시 설정
    path.node.comments = importComments;
  });

  // 파일 상단 주석 복원
  if (fileComments.length > 0) {
    root.get().node.comments = fileComments;
  }
}

/**
 * Typography 속성을 처리하는 함수
 */
function processTypographyAttribute(
  j: any,
  openingElement: any,
  attr: any,
  propName: string,
  file: any,
  logger: any,
) {
  if (attr.value?.type === "StringLiteral") {
    const value = attr.value.value;
    const transformedValue = transformTypographyValue(value);

    if (transformedValue) {
      // 기존 속성 제거
      openingElement.attributes = openingElement.attributes.filter(
        (a) => !(a.type === "JSXAttribute" && a.name.name === propName),
      );

      // textStyle 속성 추가
      openingElement.attributes.push(
        j.jsxAttribute(j.jsxIdentifier("textStyle"), j.stringLiteral(transformedValue)),
      );

      logger.logTransformResult(file.path, {
        previousToken: `${propName}="${value}"`,
        nextToken: `textStyle="${transformedValue}"`,
        status: "success",
        line: attr.loc?.start.line,
      });
    }
  } else if (attr.value?.type === "JSXExpressionContainer") {
    const expression = attr.value.expression;

    if (expression.type === "StringLiteral") {
      const value = expression.value;
      const transformedValue = transformTypographyValue(value);

      if (transformedValue) {
        // 기존 속성 제거
        openingElement.attributes = openingElement.attributes.filter(
          (a) => !(a.type === "JSXAttribute" && a.name.name === propName),
        );

        // textStyle 속성 추가
        openingElement.attributes.push(
          j.jsxAttribute(j.jsxIdentifier("textStyle"), j.stringLiteral(transformedValue)),
        );
      }
    } else if (expression.type === "ConditionalExpression") {
      const transformedExpression = transformTypographyConditionalExpression(j, expression);

      // 기존 속성 제거
      openingElement.attributes = openingElement.attributes.filter(
        (a) => !(a.type === "JSXAttribute" && a.name.name === propName),
      );

      // textStyle 속성 추가
      openingElement.attributes.push(
        j.jsxAttribute(
          j.jsxIdentifier("textStyle"),
          j.jsxExpressionContainer(transformedExpression),
        ),
      );
    }
  }
}

/**
 * Color 속성을 처리하는 함수
 */
function processColorAttribute(
  j: any,
  openingElement: any,
  attr: any,
  propName: string,
  file: any,
  logger: any,
) {
  if (attr.value?.type === "StringLiteral") {
    const value = attr.value.value;
    const transformedValue = transformColorValue(value, propName);

    if (transformedValue && transformedValue !== value) {
      attr.value.value = transformedValue;

      logger.logTransformResult(file.path, {
        previousToken: `${propName}="${value}"`,
        nextToken: `${propName}="${transformedValue}"`,
        status: "success",
        line: attr.loc?.start.line,
      });
    }
  } else if (attr.value?.type === "JSXExpressionContainer") {
    const expression = attr.value.expression;

    if (expression.type === "StringLiteral") {
      const value = expression.value;
      const transformedValue = transformColorValue(value, propName);

      if (transformedValue && transformedValue !== value) {
        expression.value = transformedValue;
      }
    } else if (expression.type === "ConditionalExpression") {
      transformColorConditionalExpression(j, expression, propName);
    }
  }
}

/**
 * Typography 조건부 표현식(삼항 연산자)을 처리하는 함수
 */
function transformTypographyConditionalExpression(j: any, expression: any): any {
  if (expression.consequent.type === "StringLiteral") {
    const originalValue = expression.consequent.value;
    const transformedValue = transformTypographyValue(originalValue);
    if (transformedValue) {
      expression.consequent.value = transformedValue;
    }
  }

  if (expression.alternate.type === "StringLiteral") {
    const originalValue = expression.alternate.value;
    const transformedValue = transformTypographyValue(originalValue);
    if (transformedValue) {
      expression.alternate.value = transformedValue;
    }
  }

  if (expression.consequent.type === "ConditionalExpression") {
    transformTypographyConditionalExpression(j, expression.consequent);
  }

  if (expression.alternate.type === "ConditionalExpression") {
    transformTypographyConditionalExpression(j, expression.alternate);
  }

  return expression;
}

/**
 * Color 조건부 표현식(삼항 연산자)을 처리하는 함수
 */
function transformColorConditionalExpression(j: any, expression: any, propName: string): any {
  if (expression.consequent.type === "StringLiteral") {
    const originalValue = expression.consequent.value;
    const transformedValue = transformColorValue(originalValue, propName);
    if (transformedValue) {
      expression.consequent.value = transformedValue;
    }
  }

  if (expression.alternate.type === "StringLiteral") {
    const originalValue = expression.alternate.value;
    const transformedValue = transformColorValue(originalValue, propName);
    if (transformedValue) {
      expression.alternate.value = transformedValue;
    }
  }

  if (expression.consequent.type === "ConditionalExpression") {
    transformColorConditionalExpression(j, expression.consequent, propName);
  }

  if (expression.alternate.type === "ConditionalExpression") {
    transformColorConditionalExpression(j, expression.alternate, propName);
  }

  return expression;
}

const transform: Transform = (file, api) => {
  const logger = createTransformLogger("replace-custom-seed-design-text-component");
  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  // 변환된 컴포넌트가 있는지 추적
  let hasTransformedComponents = false;

  // Text 컴포넌트 찾기
  root
    .find(j.JSXElement)
    .filter((path) => {
      const elementName = path.node.openingElement.name;
      return elementName.type === "JSXIdentifier" && elementName.name === "Text";
    })
    .forEach((path) => {
      const openingElement = path.node.openingElement;

      // Typography 속성들 처리
      TYPOGRAPHY_PROPS.forEach((propName) => {
        const typographyAttr = openingElement.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name.name === propName,
        );

        if (typographyAttr && typographyAttr.type === "JSXAttribute") {
          processTypographyAttribute(j, openingElement, typographyAttr, propName, file, logger);
          hasTransformedComponents = true;
        }
      });

      // Color 속성들 처리
      COLOR_PROPS.forEach((propName) => {
        const colorAttr = openingElement.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name.name === propName,
        );

        if (colorAttr && colorAttr.type === "JSXAttribute") {
          processColorAttribute(j, openingElement, colorAttr, propName, file, logger);
          hasTransformedComponents = true;
        }
      });

      // 기존 variant 속성 처리는 TYPOGRAPHY_PROPS에서 이미 처리됨
    });

  // import 처리
  handleImports(j, root, hasTransformedComponents);

  logger.finishFile(file.path);

  // 포맷팅 옵션 설정
  const printOptions = {
    quote: "auto" as const,
    objectCurlySpacing: true,
    reuseWhitespace: true,
    lineTerminator: "\n",
  };

  return root.toSource(printOptions);
};

export default transform;
