import type { Transform } from "jscodeshift";
import { typographyMappings } from "@seed-design/migration-index/typography";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";

/**
 * variant 값을 textStyle 값으로 변환하는 함수
 * @param variant 이전 variant 값 (예: "title2Bold")
 * @returns 새 textStyle 값 (예: "t7Bold") 또는 null (매핑 없을 경우)
 */
function transformVariantToTextStyle(variant: string): string | null {
  // 매핑 찾기 (variant 값은 토큰 이름의 마지막 부분과 일치)
  const mapping = typographyMappings.find((m) => {
    const tokenParts = m.previous.split(".");
    const lastPart = tokenParts[tokenParts.length - 1];
    return lastPart === variant;
  });

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
 * 조건부 표현식(삼항 연산자)을 처리하는 함수
 */
function transformConditionalExpression(j: any, expression: any): any {
  // 조건부 표현식의 참 결과(consequent)와 거짓 결과(alternate) 모두 처리
  if (expression.consequent.type === "StringLiteral") {
    const originalValue = expression.consequent.value;
    const transformedValue = transformVariantToTextStyle(originalValue);
    if (transformedValue) {
      expression.consequent.value = transformedValue;
    }
  }

  if (expression.alternate.type === "StringLiteral") {
    const originalValue = expression.alternate.value;
    const transformedValue = transformVariantToTextStyle(originalValue);
    if (transformedValue) {
      expression.alternate.value = transformedValue;
    }
  }

  // 중첩된 조건부 표현식 처리
  if (expression.consequent.type === "ConditionalExpression") {
    transformConditionalExpression(j, expression.consequent);
  }

  if (expression.alternate.type === "ConditionalExpression") {
    transformConditionalExpression(j, expression.alternate);
  }

  return expression;
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { reporter } = inferredOptions;
  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReporter | null = null;
  if (reporter) {
    reporterInstance = new TokenMigrationReporter("replace-text-component");
    reporterInstance.startNewFile(file.path);
  }

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

      // variant 속성 찾기
      const variantAttr = openingElement.attributes.find(
        (attr) => attr.type === "JSXAttribute" && attr.name.name === "variant",
      );

      if (variantAttr && variantAttr.type === "JSXAttribute") {
        // variant 속성 값 처리
        if (variantAttr.value?.type === "StringLiteral") {
          // 문자열 리터럴인 경우
          const variantValue = variantAttr.value.value;
          const textStyleValue = transformVariantToTextStyle(variantValue);

          if (textStyleValue) {
            // variant 속성 제거
            openingElement.attributes = openingElement.attributes.filter(
              (attr) => !(attr.type === "JSXAttribute" && attr.name.name === "variant"),
            );

            // textStyle 속성 추가
            openingElement.attributes.push(
              j.jsxAttribute(j.jsxIdentifier("textStyle"), j.stringLiteral(textStyleValue)),
            );

            // 변환된 컴포넌트가 있음을 표시
            hasTransformedComponents = true;

            if (reporterInstance) {
              reporterInstance.addResult({
                previousToken: `variant="${variantValue}"`,
                nextToken: `textStyle="${textStyleValue}"`,
                status: "success",
                line: variantAttr.loc?.start.line,
              });
            }
          }
        } else if (variantAttr.value?.type === "JSXExpressionContainer") {
          // JSX 표현식 컨테이너인 경우
          const expression = variantAttr.value.expression;

          if (expression.type === "StringLiteral") {
            // 컨테이너 내 문자열 리터럴인 경우
            const variantValue = expression.value;
            const textStyleValue = transformVariantToTextStyle(variantValue);

            if (textStyleValue) {
              // variant 속성 제거
              openingElement.attributes = openingElement.attributes.filter(
                (attr) => !(attr.type === "JSXAttribute" && attr.name.name === "variant"),
              );

              // textStyle 속성 추가
              openingElement.attributes.push(
                j.jsxAttribute(j.jsxIdentifier("textStyle"), j.stringLiteral(textStyleValue)),
              );

              // 변환된 컴포넌트가 있음을 표시
              hasTransformedComponents = true;
            }
          } else if (expression.type === "ConditionalExpression") {
            // 조건부 표현식(삼항 연산자)인 경우
            const transformedExpression = transformConditionalExpression(j, expression);

            // variant 속성 제거
            openingElement.attributes = openingElement.attributes.filter(
              (attr) => !(attr.type === "JSXAttribute" && attr.name.name === "variant"),
            );

            // textStyle 속성 추가
            openingElement.attributes.push(
              j.jsxAttribute(
                j.jsxIdentifier("textStyle"),
                j.jsxExpressionContainer(transformedExpression),
              ),
            );

            // 변환된 컴포넌트가 있음을 표시
            hasTransformedComponents = true;

            if (reporterInstance) {
              reporterInstance.addResult({
                previousToken: "variant={조건부 표현식}",
                nextToken: "textStyle={조건부 표현식}",
                status: "success",
                line: variantAttr.loc?.start.line,
              });
            }
          }
        }
      }
    });

  // import 처리
  handleImports(j, root, hasTransformedComponents);

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  // 포맷팅 옵션 설정
  const printOptions = {
    quote: "double" as const,
    objectCurlySpacing: true,
  };

  return root.toSource(printOptions);
};

export default transform;
