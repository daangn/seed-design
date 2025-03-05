import type * as jscodeshift from "jscodeshift";

export function handleImports(
  j: jscodeshift.JSCodeshift,
  root: jscodeshift.Collection,
  hasUnresolvedTokens: boolean,
  hasChangedVars: boolean,
  hasRemainingVarsTypes: boolean,
) {
  // 변경된 vars가 없으면 import를 수정하지 않음
  if (!hasChangedVars) {
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

  // 남아있는 vars 타입이 있거나 미해결 토큰이 있는 경우
  if (hasRemainingVarsTypes || hasUnresolvedTokens) {
    // 기존 import에서 vars를 legacyVars로 변경
    designTokenImports.forEach((path) => {
      // 주석 보존
      const importComments = path.node.comments || [];

      // 기존 specifiers 중 vars를 찾아서 legacyVars로 변경
      const varsSpecifiers = path.node.specifiers?.filter(
        (spec) => spec.type === "ImportSpecifier" && spec.imported.name === "vars",
      );

      // 다른 specifiers 유지
      const otherSpecifiers =
        path.node.specifiers?.filter(
          (spec) => !(spec.type === "ImportSpecifier" && spec.imported.name === "vars"),
        ) || [];

      // 새로운 specifiers 구성
      path.node.specifiers = [
        ...otherSpecifiers,
        // legacyVars 추가 (기존 vars가 있었다면)
        ...(varsSpecifiers?.length
          ? [j.importSpecifier(j.identifier("vars"), j.identifier("legacyVars"))]
          : []),
      ];

      // 주석 다시 설정
      path.node.comments = importComments;
    });

    // @seed-design/css/vars import 추가
    const cssVarsImport = root.find(j.ImportDeclaration, {
      source: { value: "@seed-design/css/vars" },
    });

    if (cssVarsImport.length === 0) {
      const varsImport = j.importDeclaration(
        [j.importSpecifier(j.identifier("vars"), j.identifier("vars"))],
        j.literal("@seed-design/css/vars"),
      );

      // 첫 번째 import 찾기
      const firstImport = root.find(j.ImportDeclaration).at(0);

      // 첫 번째 import 후에 추가
      if (firstImport.size() > 0) {
        firstImport.insertAfter(varsImport);
      } else {
        // 파일 상단에 추가
        root.get().node.program.body.unshift(varsImport);
      }
    }
  }
  // 모든 토큰이 변경 가능한 경우
  else {
    // design-token을 css/vars로 교체
    designTokenImports.forEach((path) => {
      // 주석 보존
      const importComments = path.node.comments || [];

      // 소스 변경
      path.node.source.value = "@seed-design/css/vars";

      // 주석 다시 설정
      path.node.comments = importComments;
    });
  }

  // 파일 상단 주석 복원
  if (fileComments.length > 0) {
    root.get().node.comments = fileComments;
  }
}
