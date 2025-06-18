import type * as jscodeshift from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

// 알파 컬러 매핑 정의 (연쇄 변환 방지를 위해 큰 번호부터 작은 번호 순서로)
const alphaColorMappings = [
  {
    from: "staticBlackAlpha500",
    to: "staticBlackAlpha700",
    cssFrom: "static-black-alpha-500",
    cssTo: "static-black-alpha-700",
  },
  {
    from: "staticBlackAlpha200",
    to: "staticBlackAlpha500",
    cssFrom: "static-black-alpha-200",
    cssTo: "static-black-alpha-500",
  },
  {
    from: "staticBlackAlpha50",
    to: "staticBlackAlpha200",
    cssFrom: "static-black-alpha-50",
    cssTo: "static-black-alpha-200",
  },
  {
    from: "staticWhiteAlpha200",
    to: "staticWhiteAlpha300",
    cssFrom: "static-white-alpha-200",
    cssTo: "static-white-alpha-300",
  },
];

/**
 * 멤버 표현식의 전체 이름을 가져오는 유틸리티 함수
 */
function getMemberExpressionName(path: jscodeshift.ASTPath<jscodeshift.MemberExpression>): string {
  const parts: string[] = [];
  let current: any = path.node;

  while (current) {
    if (current.type === "MemberExpression") {
      if (current.property.type === "Identifier") {
        parts.unshift(current.property.name);
      }
      current = current.object;
    } else if (current.type === "Identifier") {
      parts.unshift(current.name);
      break;
    } else {
      break;
    }
  }

  return parts.join(".");
}

/**
 * 멤버 표현식을 빌드하는 유틸리티 함수
 */
function buildMemberExpression(
  j: jscodeshift.JSCodeshift,
  name: string,
): jscodeshift.MemberExpression {
  const parts = name.split(".");
  let expr: jscodeshift.MemberExpression | jscodeshift.Identifier = j.identifier(parts[0]);

  for (let i = 1; i < parts.length; i++) {
    expr = j.memberExpression(expr, j.identifier(parts[i]));
  }

  return expr as jscodeshift.MemberExpression;
}

/**
 * JavaScript/TypeScript 파일을 처리하는 메인 transform
 */
const replaceAlphaColor: jscodeshift.Transform = (file, api) => {
  // CSS 파일은 별도로 처리하므로 건너뛰기
  if (file.path?.endsWith(".css")) {
    return processCssFile(file.source, file.path);
  }

  const logger = createTransformLogger("replace-alpha-color");
  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  let hasChanges = false;

  // vars.$color.palette.staticBlackAlpha50 등의 패턴을 찾아서 변경
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return memberName.startsWith("vars.$color.palette.static") && memberName.includes("Alpha");
    })
    .forEach((path) => {
      const memberName = getMemberExpressionName(path);
      const line = path.node.loc?.start.line;

      // 토큰명에서 마지막 부분 추출 (예: vars.$color.palette.staticBlackAlpha50 -> staticBlackAlpha50)
      const tokenName = memberName.split(".").pop();

      if (tokenName) {
        // 매핑 테이블에서 해당하는 변환 찾기
        for (const mapping of alphaColorMappings) {
          if (tokenName === mapping.from) {
            const newName = `vars.$color.palette.${mapping.to}`;
            const newExpr = buildMemberExpression(j, newName);
            path.replace(newExpr);
            hasChanges = true;

            logger.logTransformResult(file.path, {
              previousToken: memberName,
              nextToken: newName,
              line,
              status: "success",
            });
            break; // 매칭되면 루프 종료
          }
        }
      }
    });

  logger.finishFile(file.path);

  if (!hasChanges) {
    return null; // 변경사항이 없으면 null 반환
  }

  return root.toSource();
};

/**
 * 단일 CSS 파일을 처리하는 함수
 */
function processCssFile(source: string, filePath: string): string {
  try {
    let result = source;

    // 각 매핑에 대해 순차적으로 문자열 치환 (연쇄 변환 방지)
    for (const mapping of alphaColorMappings) {
      const cssVarFrom = `var(--seed-color-palette-${mapping.cssFrom})`;
      const cssVarTo = `var(--seed-color-palette-${mapping.cssTo})`;

      // 전역 치환 수행
      result = result.replace(
        new RegExp(cssVarFrom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        cssVarTo,
      );
    }

    return result;
  } catch (error) {
    console.error(`Error processing CSS file ${filePath}:`, error);
    return source; // 에러 발생 시 원본 소스 반환
  }
}

export default replaceAlphaColor;
