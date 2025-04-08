import { typographyMappings } from "@seed-design/migration-index/typography";
import type {
  API,
  ASTPath,
  ConditionalExpression,
  FileInfo,
  JSCodeshift,
  JSXAttribute,
  JSXElement,
  JSXOpeningElement,
  Transform,
} from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

const TRANSFORM_NAME = "replace-custom-component-typography-prop";

/**
 * 타이포그래피 속성을 사용하는 컴포넌트 목록
 * 확장 가능성을 위해 배열로 관리합니다.
 */
const TYPOGRAPHY_COMPONENTS = ["Text"] as const;

/**
 * 타이포그래피 관련 속성 목록
 * 다양한 타이포그래피 속성을 확장 가능하도록 배열로 관리합니다.
 */
const TYPOGRAPHY_PROPS = ["variant"] as const;

/**
 * 타이포그래피 속성 매핑
 * 각 속성이 변환되어야 하는 대상 속성명을 지정합니다.
 */
const PROPS_MAPPING: Record<(typeof TYPOGRAPHY_PROPS)[number], string> = {
  variant: "textStyle", // variant -> textStyle
};

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
 * 조건부 표현식(삼항 연산자)을 처리하는 함수
 */
function transformConditionalExpression(
  j: JSCodeshift,
  expression: ConditionalExpression,
): ConditionalExpression {
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

/**
 * JSX 속성을 처리하는 함수
 *
 * @param j jscodeshift API
 * @param openingElement JSX 요소의 opening 태그
 * @param propName 처리할 속성명 (예: "variant")
 * @param targetPropName 변환 대상 속성명 (예: "textStyle")
 * @param logger 로깅을 위한 로거 객체
 * @param filePath 파일 경로
 * @returns 변환 여부
 */
function processTypographyProp(
  j: JSCodeshift,
  openingElement: JSXOpeningElement,
  propName: string,
  targetPropName: string,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
): boolean {
  // 타겟 속성 찾기
  const propAttr = openingElement.attributes.find(
    (attr): attr is JSXAttribute => attr.type === "JSXAttribute" && attr.name.name === propName,
  );

  if (!propAttr) return false;

  // 속성 값 처리
  if (propAttr.value?.type === "StringLiteral") {
    // 문자열 리터럴인 경우
    const propValue = propAttr.value.value;
    const textStyleValue = transformVariantToTextStyle(propValue);

    if (textStyleValue) {
      // 기존 속성 제거
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => !(attr.type === "JSXAttribute" && attr.name.name === propName),
      );

      // 이미 targetPropName 속성이 있는지 확인
      const existingTargetProp = openingElement.attributes.find(
        (attr): attr is JSXAttribute =>
          attr.type === "JSXAttribute" && attr.name.name === targetPropName,
      );

      // 중복 속성 방지
      if (!existingTargetProp) {
        // textStyle 속성 추가
        openingElement.attributes.push(
          j.jsxAttribute(j.jsxIdentifier(targetPropName), j.stringLiteral(textStyleValue)),
        );
      }

      logger.logTransformResult(filePath, {
        previousToken: `${propName}="${propValue}"`,
        nextToken: `${targetPropName}="${textStyleValue}"`,
        status: "success",
        line: propAttr.loc?.start?.line,
      });

      return true;
    }
  } else if (propAttr.value?.type === "JSXExpressionContainer") {
    // JSX 표현식 컨테이너인 경우
    const expressionContainer = propAttr.value;
    const expression = expressionContainer.expression;

    if (expression.type === "StringLiteral") {
      // 컨테이너 내 문자열 리터럴인 경우 (예: variant={"title1"})
      const propValue = expression.value;
      const textStyleValue = transformVariantToTextStyle(propValue);

      if (textStyleValue) {
        // 기존 속성 제거
        openingElement.attributes = openingElement.attributes.filter(
          (attr) => !(attr.type === "JSXAttribute" && attr.name.name === propName),
        );

        // 이미 targetPropName 속성이 있는지 확인
        const existingTargetProp = openingElement.attributes.find(
          (attr): attr is JSXAttribute =>
            attr.type === "JSXAttribute" && attr.name.name === targetPropName,
        );

        // 중복 속성 방지
        if (!existingTargetProp) {
          // textStyle 속성 추가
          openingElement.attributes.push(
            j.jsxAttribute(j.jsxIdentifier(targetPropName), j.stringLiteral(textStyleValue)),
          );
        }

        logger.logTransformResult(filePath, {
          previousToken: `${propName}={"${propValue}"}`,
          nextToken: `${targetPropName}="${textStyleValue}"`,
          status: "success",
          line: propAttr.loc?.start?.line,
        });

        return true;
      }
    } else if (expression.type === "ConditionalExpression") {
      // 조건부 표현식(삼항 연산자)인 경우 (예: variant={isTitle ? "title1" : "body"})
      const transformedExpression = transformConditionalExpression(j, expression);

      // 기존 속성 제거
      openingElement.attributes = openingElement.attributes.filter(
        (attr) => !(attr.type === "JSXAttribute" && attr.name.name === propName),
      );

      // 이미 targetPropName 속성이 있는지 확인
      const existingTargetProp = openingElement.attributes.find(
        (attr): attr is JSXAttribute =>
          attr.type === "JSXAttribute" && attr.name.name === targetPropName,
      );

      // 중복 속성 방지
      if (!existingTargetProp) {
        // textStyle 속성 추가
        openingElement.attributes.push(
          j.jsxAttribute(
            j.jsxIdentifier(targetPropName),
            j.jsxExpressionContainer(transformedExpression),
          ),
        );
      }

      logger.logTransformResult(filePath, {
        previousToken: `${propName}={조건부 표현식}`,
        nextToken: `${targetPropName}={조건부 표현식}`,
        status: "success",
        line: propAttr.loc?.start?.line,
      });

      return true;
    }
  }

  return false;
}

const transform: Transform = (file: FileInfo, api: API) => {
  const logger = createTransformLogger(TRANSFORM_NAME);
  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  // 지원하는 컴포넌트들 찾기
  root
    .find(j.JSXElement)
    .filter((path: ASTPath<JSXElement>) => {
      const elementName = path.node.openingElement.name;
      if (elementName.type !== "JSXIdentifier") return false;
      return TYPOGRAPHY_COMPONENTS.includes(
        elementName.name as (typeof TYPOGRAPHY_COMPONENTS)[number],
      );
    })
    .forEach((path: ASTPath<JSXElement>) => {
      const openingElement = path.node.openingElement;

      // 지원하는 모든 타이포그래피 속성 처리
      TYPOGRAPHY_PROPS.forEach((propName) => {
        const targetPropName = PROPS_MAPPING[propName];
        processTypographyProp(j, openingElement, propName, targetPropName, logger, file.path);
      });
    });

  logger.finishFile(file.path);

  // 포맷팅 옵션 설정
  const printOptions = {
    quote: "auto" as const,
    objectCurlySpacing: true,
  };

  return root.toSource(printOptions);
};

export default transform;
