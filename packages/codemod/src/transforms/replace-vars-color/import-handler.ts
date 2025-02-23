import type * as jscodeshift from "jscodeshift";

export function handleImports(
  j: jscodeshift.JSCodeshift,
  root: jscodeshift.Collection,
  hasUnresolvedTokens: boolean,
) {
  if (hasUnresolvedTokens) {
    // design-token import의 vars를 legacyVars로 변경
    root
      .find(j.ImportDeclaration, {
        source: { value: "@seed-design/design-token" },
      })
      .forEach((path) => {
        path.node.specifiers = [
          j.importSpecifier(j.identifier("vars"), j.identifier("legacyVars")),
        ];
      });

    // @seed-design/css/vars import 추가
    const varsImport = j.importDeclaration(
      [j.importSpecifier(j.identifier("vars"), j.identifier("vars"))],
      j.literal("@seed-design/css/vars"),
    );
    root.find(j.ImportDeclaration).at(0).insertAfter(varsImport);
  } else {
    // 모든 토큰이 변경 가능한 경우 design-token을 vars로 교체
    root
      .find(j.ImportDeclaration, {
        source: { value: "@seed-design/design-token" },
      })
      .forEach((path) => {
        path.node.source.value = "@seed-design/css/vars";
      });
  }
}
