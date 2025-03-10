import type { Transform } from "jscodeshift";
import { typographyMappings } from "@seed-design/migration-index/typography";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";
import type { ASTPath, MemberExpression } from "jscodeshift";

/**
 * 멤버 표현식의 전체 경로를 문자열로 가져오는 함수
 */
function getMemberExpressionName(path: ASTPath<MemberExpression>): string {
  const parts: string[] = [];
  let current: MemberExpression | any = path.node;

  while (current.type === "MemberExpression") {
    if (current.property.type === "Identifier") {
      parts.unshift(current.property.name);
    }
    current = current.object;
  }

  if (current.type === "Identifier") {
    parts.unshift(current.name);
  }

  return parts.join(".");
}

/**
 * 이전 토큰에서 새 토큰으로 변환하는 함수
 * @param previousToken 이전 토큰 (예: "$semantic.typography.title2Regular")
 * @returns 새 토큰 (예: "t7Regular") 또는 null (매핑 없을 경우)
 */
function transformTypographyToken(previousToken: string): string | null {
  // 매핑 찾기
  const mapping = typographyMappings.find((m) => m.previous === previousToken);

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

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { reporter } = inferredOptions;
  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReporter | null = null;
  if (reporter) {
    reporterInstance = new TokenMigrationReporter("replace-typography-design-token");
    reporterInstance.startNewFile(file.path);
  }

  // 먼저 import 문 변경
  let hasTextRecipeImport = false;

  // 기존 import 문 확인 및 수정
  root.find(j.ImportDeclaration).forEach((path) => {
    const source = path.node.source.value;

    // @seed-design/design-token import 확인
    if (source === "@seed-design/design-token") {
      // classNames 가져오는지 확인
      const classNamesSpecifier = path.node.specifiers.find(
        (specifier) =>
          specifier.type === "ImportSpecifier" && specifier.imported.name === "classNames",
      );

      if (classNamesSpecifier) {
        // 이 import 문을 text recipe import로 대체
        path.node.source.value = "@seed-design/css/recipes/text";
        path.node.specifiers = [j.importSpecifier(j.identifier("text"))];
        hasTextRecipeImport = true;
      }
    } else if (source === "@seed-design/css/recipes/text") {
      // 이미 text recipe import가 있는 경우
      hasTextRecipeImport = true;
    }
  });

  // 필요한 import 문이 없으면 추가
  if (!hasTextRecipeImport) {
    const importDeclaration = j.importDeclaration(
      [j.importSpecifier(j.identifier("text"))],
      j.literal("@seed-design/css/recipes/text"),
    );

    // 파일 맨 위에 import 문 추가
    root.get().node.program.body.unshift(importDeclaration);
  }

  // classNames.$semantic.typography.* 패턴 찾기
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return memberName.startsWith("classNames.$semantic.typography.");
    })
    .forEach((path) => {
      // 전체 경로 (예: classNames.$semantic.typography.title2Regular)
      const memberName = getMemberExpressionName(path);
      const typographyToken = memberName.replace("classNames.", "");

      // 새 토큰으로 변환
      const newToken = transformTypographyToken(typographyToken);

      if (newToken) {
        // text({ textStyle: "newToken" }) 형식으로 변환
        const textCallExpr = j.callExpression(j.identifier("text"), [
          j.objectExpression([
            j.objectProperty(j.identifier("textStyle"), j.stringLiteral(newToken)),
          ]),
        ]);

        // 부모 노드 확인
        const parentPath = path.parent;

        if (parentPath.node.type === "JSXExpressionContainer") {
          // JSX 컨텍스트인 경우 (className={...})
          j(parentPath).replaceWith(j.jsxExpressionContainer(textCallExpr));
        } else if (
          parentPath.node.type === "Property" ||
          parentPath.node.type === "ObjectProperty"
        ) {
          // 객체 속성인 경우 (key: value)
          // 값만 교체하고 키는 유지
          parentPath.node.value = textCallExpr;
        } else {
          // 그 외의 경우 (변수 할당 등)
          j(parentPath).replaceWith(textCallExpr);
        }

        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: typographyToken,
            nextToken: `text({ textStyle: "${newToken}" })`,
            status: "success",
            line: path.node.loc?.start.line,
          });
        }
      } else {
        // 매핑이 없는 경우 리포터에 기록
        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: typographyToken,
            nextToken: "매핑 없음 - 수동 변경 필요",
            status: "failure",
            line: path.node.loc?.start.line,
          });
        }
      }
    });

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  // 포맷팅 옵션 설정
  const printOptions = {
    quote: "double" as const,
    trailingComma: false,
    wrapColumn: 80,
  };

  return root.toSource(printOptions);
};

export default transform;
