import type { Transform } from "jscodeshift";
import { typographyMappings } from "@seed-design/migration-index/typography";
import { TokenMigrationReport } from "../../utils/migration-report.js";
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

/**
 * import 문을 처리하는 함수
 */
function handleImports(j: any, root: any, hasTransformedTokens: boolean) {
  // 변환된 토큰이 없으면 import를 수정하지 않음
  if (!hasTransformedTokens) {
    return;
  }

  // design-token import 찾기
  const designTokenImports = root.find(j.ImportDeclaration, {
    source: { value: "@seed-design/design-token" },
  });

  // design-token import가 없으면 처리하지 않음
  if (designTokenImports.length === 0) {
    return;
  }

  // 파일 상단 주석 보존
  const fileComments = root.get().node.comments || [];

  // design-token을 css/recipes/text로 교체
  designTokenImports.forEach((path: any) => {
    // 주석 보존
    const importComments = path.node.comments || [];

    // classNames 가져오는지 확인
    const classNamesSpecifier = path.node.specifiers.find(
      (specifier: any) =>
        specifier.type === "ImportSpecifier" && specifier.imported.name === "classNames",
    );

    if (classNamesSpecifier) {
      // 이 import 문을 text recipe import로 대체
      path.node.source.value = "@seed-design/css/recipes/text";
      path.node.specifiers = [j.importSpecifier(j.identifier("text"))];
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
 * 변환 후 text 함수가 사용되지 않는 경우 import를 제거하는 함수
 */
function cleanupUnusedImports(j: any, root: any) {
  // text 함수 사용 여부 확인
  const textUsages = root.find(j.CallExpression, {
    callee: {
      type: "Identifier",
      name: "text",
    },
  });

  // text 함수가 사용되지 않는 경우 import 제거
  if (textUsages.length === 0) {
    // 파일 상단 주석 보존
    const fileComments = root.get().node.comments || [];

    // text import 찾기
    const textImports = root.find(j.ImportDeclaration, {
      source: { value: "@seed-design/css/recipes/text" },
    });

    // import 주석 보존
    let importComments: any[] = [];
    textImports.forEach((path: any) => {
      if (path.node.comments && path.node.comments.length > 0) {
        importComments = [...importComments, ...path.node.comments];
      }
    });

    // import 제거
    textImports.remove();

    // 주석 복원
    if (importComments.length > 0) {
      // 첫 번째 import 찾기
      const firstImport = root.find(j.ImportDeclaration).at(0);
      if (firstImport.size() > 0) {
        // 첫 번째 import에 주석 추가
        firstImport.get().node.comments = [
          ...(firstImport.get().node.comments || []),
          ...importComments,
        ];
      } else {
        // 파일 상단에 주석 추가
        root.get().node.comments = [...fileComments, ...importComments];
      }
    }
  }
}

/**
 * 문자열 코드를 파싱하여 AST 노드로 변환
 */
function parseExpression(j: any, code: string) {
  // 문자열 코드를 파싱하여 AST 생성
  const ast = j(`${code}`);

  // 첫 번째 표현식 반환
  return ast.find(j.ExpressionStatement).get().node.expression;
}

const transform: Transform = (file, api, options) => {
  const inferredOptions = options as z.infer<typeof transformOptionsSchema>;
  const { migrationReport } = inferredOptions;
  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReport | null = null;
  if (migrationReport) {
    reporterInstance = new TokenMigrationReport("replace-typography-design-token");
    reporterInstance.startNewFile(file.path);
  }

  // 변환된 토큰이 있는지 추적
  let hasTransformedTokens = false;

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
        // 문자열로 표현식 생성 후 파싱
        const textCallCode = `text({ textStyle: "${newToken}" })`;
        const textCallExpr = parseExpression(j, textCallCode);

        // 부모 노드 확인
        const parentPath = path.parent;

        if (parentPath.node.type === "JSXExpressionContainer") {
          // JSX 컨텍스트인 경우 (className={...})
          const jsxExpr = j.jsxExpressionContainer(textCallExpr);
          j(parentPath).replaceWith(jsxExpr);
        } else if (
          parentPath.node.type === "Property" ||
          parentPath.node.type === "ObjectProperty"
        ) {
          // 객체 속성인 경우 (key: value)
          // 값만 교체하고 키는 유지
          parentPath.node.value = textCallExpr;
        } else if (parentPath.node.type === "ConditionalExpression") {
          // 삼항 연산자인 경우 (condition ? classNames.$semantic.typography.* : something)
          if (parentPath.node.consequent === path.node) {
            // 참일 때 결과인 경우
            parentPath.node.consequent = textCallExpr;
          } else if (parentPath.node.alternate === path.node) {
            // 거짓일 때 결과인 경우
            parentPath.node.alternate = textCallExpr;
          }
        } else if (parentPath.node.type === "ReturnStatement") {
          // 함수 반환값인 경우 (return classNames.$semantic.typography.*)
          parentPath.node.argument = textCallExpr;
        } else if (
          parentPath.node.type === "ArrowFunctionExpression" &&
          parentPath.node.body === path.node
        ) {
          // 화살표 함수 본문인 경우 (() => classNames.$semantic.typography.*)
          parentPath.node.body = textCallExpr;
        } else if (parentPath.node.type === "VariableDeclarator") {
          // 변수 선언인 경우 (const varName = classNames.$semantic.typography.*)
          // 변수명은 유지하고 값만 교체
          parentPath.node.init = textCallExpr;
        } else {
          // 그 외의 경우 (변수 할당 등)
          j(parentPath).replaceWith(textCallExpr);
        }

        // 변환된 토큰이 있음을 표시
        hasTransformedTokens = true;

        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: typographyToken,
            nextToken: textCallCode,
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

  // import 처리
  handleImports(j, root, hasTransformedTokens);

  // 변환 후 text 함수가 사용되지 않는 경우 import 제거
  cleanupUnusedImports(j, root);

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  // 포맷팅 옵션 설정
  const printOptions = {
    quote: "double" as const,
    trailingComma: false,
    wrapColumn: 1000, // 매우 큰 값으로 설정하여 줄바꿈 방지
    tabWidth: 2,
    reuseWhitespace: true,
  };

  return root.toSource(printOptions);
};

export default transform;
