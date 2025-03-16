import { typographyMappings } from "@seed-design/migration-index/typography";
import { kebabCase } from "change-case";
import type { Transform } from "jscodeshift";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";
import { TokenMigrationReport } from "../../utils/migration-report.js";

/**
 * 타이포그래피 클래스명을 변환하는 함수
 * @param className 변환할 클래스명 (예: "caption1Bold")
 * @returns 변환된 클래스명 (예: "t3-bold")
 */
function transformTypographyClass(className: string): string {
  // 매핑 정보에서 찾기
  const mapping = typographyMappings.find((m) => {
    const tokenParts = m.previous.split(".");
    const lastPart = tokenParts[tokenParts.length - 1];
    return lastPart === className;
  });

  if (mapping) {
    // next 배열에 값이 있으면 첫 번째 값 사용
    if (mapping.next && mapping.next.length > 0) {
      return kebabCase(mapping.next[0]);
    }

    // next 배열이 비어있고 alternative 배열이 있으면 첫 번째 alternative 사용
    if (
      (!mapping.next || mapping.next.length === 0) &&
      mapping.alternative &&
      mapping.alternative.length > 0
    ) {
      return kebabCase(mapping.alternative[0]);
    }
  }

  // 매핑 정보에 없는 경우 원래 클래스명 반환
  return className;
}

/**
 * 복잡한 클래스명 처리 (예: [&>section_h2]:subtitle1Bold)
 */
function processComplexClassName(token: string): string {
  // 대괄호 안의 내용 처리 (예: [&>section_h2]:subtitle1Bold)
  if (token.startsWith("[") && token.includes("]:")) {
    const closingBracketIndex = token.indexOf("]:");
    const prefix = token.substring(0, closingBracketIndex + 2); // [&>section_h2]:
    const typographyToken = token.substring(closingBracketIndex + 2); // subtitle1Bold
    const transformedToken = transformTypographyClass(typographyToken);
    return prefix + transformedToken;
  }
  return token;
}

/**
 * 수정자(modifier)가 포함된 클래스명 처리 (예: hover:caption1Bold)
 */
function transformTypographyToken(token: string): string {
  // 복잡한 클래스명 처리 (예: [&>section_h2]:subtitle1Bold)
  if (token.startsWith("[") && token.includes("]:")) {
    return processComplexClassName(token);
  }

  // 일반 수정자 처리 (예: hover:caption1Bold)
  if (token.includes(":")) {
    const parts = token.split(":");
    // 마지막 요소가 실제 타이포그래피 토큰
    const typographyToken = parts.pop()!;
    const transformedToken = transformTypographyClass(typographyToken);
    return parts.concat(transformedToken).join(":");
  }

  return transformTypographyClass(token);
}

/**
 * 전체 Tailwind 클래스 문자열 처리: 공백으로 분리 후 각 토큰 변환
 */
function transformTailwindClasses(classStr: string): string {
  const classNames = classStr.split(" ");
  const newClassNames = classNames.map((cn) => transformTypographyToken(cn));
  return newClassNames.join(" ");
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { migrationReport } = inferredOptions;

  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReport | null = null;
  if (migrationReport) {
    reporterInstance = new TokenMigrationReport("replace-tailwind-typography");
    reporterInstance.startNewFile(file.path);
  }

  // StringLiteral 내 Tailwind 클래스 처리
  root.find(j.StringLiteral).forEach((path) => {
    const original = path.node.value;
    const transformed = transformTailwindClasses(original);

    if (original !== transformed) {
      if (reporterInstance) {
        reporterInstance.addResult({
          previousToken: original,
          nextToken: transformed,
          status: "success",
          line: path.node.loc?.start.line,
        });
      }
      path.node.value = transformed;
    }
  });

  // TemplateLiteral 내부 문자(quasis) 처리
  root.find(j.TemplateLiteral).forEach((path) => {
    path.node.quasis.forEach((elem) => {
      const original = elem.value.raw;
      const transformed = transformTailwindClasses(original);

      if (original !== transformed) {
        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: original,
            nextToken: transformed,
            status: "success",
            line: elem.loc?.start.line,
          });
        }
        elem.value.raw = transformed;
        elem.value.cooked = transformed;
      }
    });
  });

  // JSX 속성 내 문자열 처리 (className 속성)
  root.find(j.JSXAttribute, { name: { name: "className" } }).forEach((path) => {
    if (path.node.value?.type === "StringLiteral") {
      const original = path.node.value.value;
      const transformed = transformTailwindClasses(original);

      if (original !== transformed) {
        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: original,
            nextToken: transformed,
            status: "success",
            line: path.node.loc?.start.line,
          });
        }
        path.node.value.value = transformed;
      }
    } else if (
      path.node.value?.type === "JSXExpressionContainer" &&
      path.node.value.expression.type === "StringLiteral"
    ) {
      const original = path.node.value.expression.value;
      const transformed = transformTailwindClasses(original);

      if (original !== transformed) {
        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: original,
            nextToken: transformed,
            status: "success",
            line: path.node.loc?.start.line,
          });
        }
        path.node.value.expression.value = transformed;
      }
    } else if (
      path.node.value?.type === "JSXExpressionContainer" &&
      path.node.value.expression.type === "TemplateLiteral"
    ) {
      const templateLiteral = path.node.value.expression;
      templateLiteral.quasis.forEach((elem) => {
        const original = elem.value.raw;
        const transformed = transformTailwindClasses(original);

        if (original !== transformed) {
          if (reporterInstance) {
            reporterInstance.addResult({
              previousToken: original,
              nextToken: transformed,
              status: "success",
              line: elem.loc?.start.line,
            });
          }
          elem.value.raw = transformed;
          elem.value.cooked = transformed;
        }
      });
    }
  });

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource();
};

export default transform;
