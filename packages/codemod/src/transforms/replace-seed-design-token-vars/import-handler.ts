import type * as jscodeshift from "jscodeshift";

export function handleImports(
  j: jscodeshift.JSCodeshift,
  root: jscodeshift.Collection,
  hasUnresolvedTokens: boolean,
  hasChangedVars: boolean,
  hasChangedTypography: boolean,
  hasRemainingVarsTypes: boolean,
) {
  // 변경사항이 없으면 import를 수정하지 않음
  if (!hasChangedVars && !hasChangedTypography) {
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

  // 미해결 토큰이 있거나 남아있는 vars 타입이 있는 경우 (legacyVars가 필요한 경우)
  const needsLegacyVars = hasUnresolvedTokens || hasRemainingVarsTypes;

  // 컬러 토큰 변경 여부
  const hasChangedColorVars = hasChangedVars && !hasChangedTypography;

  // 타이포그래피 토큰만 변경된 경우
  const hasChangedTypographyOnly = !hasChangedColorVars && hasChangedTypography;

  // 1. legacyVars가 필요한 경우 (@seed-design/design-token 유지 필요)
  if (needsLegacyVars) {
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

    // 2. 컬러 토큰이 변경된 경우 (@seed-design/css/vars 추가)
    if (hasChangedVars) {
      addCssVarsImport(j, root);
    }

    // 3. 타이포그래피 토큰이 변경된 경우 (@seed-design/css/vars/component/typography 추가)
    if (hasChangedTypography) {
      addTypographyImport(j, root);
    }
  }
  // legacyVars가 필요없는 경우 (모든 토큰이 변경 가능한 경우)
  else {
    // 타이포그래피만 변경된 경우
    if (hasChangedTypographyOnly) {
      // design-token import를 @seed-design/css/vars/component/typography로 변경
      designTokenImports.forEach((path) => {
        // 주석 보존
        const importComments = path.node.comments || [];

        // 소스 변경
        path.node.source.value = "@seed-design/css/vars/component/typography";

        // 로컬 이름 변경 (vars -> typoVars)
        const varsSpecifiers = path.node.specifiers?.filter(
          (spec) => spec.type === "ImportSpecifier" && spec.imported.name === "vars",
        );

        if (varsSpecifiers?.length) {
          varsSpecifiers.forEach((spec) => {
            if (spec.type === "ImportSpecifier") {
              spec.local = j.identifier("typoVars");
            }
          });
        }

        // 주석 다시 설정
        path.node.comments = importComments;
      });
    }
    // 컬러만 변경되었거나 둘 다 변경된 경우
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

      // 타이포그래피도 변경된 경우 typography import 추가
      if (hasChangedTypography) {
        addTypographyImport(j, root);
      }
    }
  }

  // 파일 상단 주석 복원
  if (fileComments.length > 0) {
    root.get().node.comments = fileComments;
  }
}

// @seed-design/css/vars import 추가 헬퍼 함수
function addCssVarsImport(j: jscodeshift.JSCodeshift, root: jscodeshift.Collection) {
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

// @seed-design/css/vars/component/typography import 추가 헬퍼 함수
function addTypographyImport(j: jscodeshift.JSCodeshift, root: jscodeshift.Collection) {
  const typographyImport = root.find(j.ImportDeclaration, {
    source: { value: "@seed-design/css/vars/component/typography" },
  });

  if (typographyImport.length === 0) {
    const typoVarsImport = j.importDeclaration(
      [j.importSpecifier(j.identifier("vars"), j.identifier("typoVars"))],
      j.literal("@seed-design/css/vars/component/typography"),
    );

    // @seed-design/css/vars import 찾기
    const cssVarsImport = root.find(j.ImportDeclaration, {
      source: { value: "@seed-design/css/vars" },
    });

    // @seed-design/css/vars import 후에 추가
    if (cssVarsImport.size() > 0) {
      cssVarsImport.at(0).insertAfter(typoVarsImport);
    } else {
      // 첫 번째 import 찾기
      const firstImport = root.find(j.ImportDeclaration).at(0);

      // 첫 번째 import 후에 추가
      if (firstImport.size() > 0) {
        firstImport.insertAfter(typoVarsImport);
      } else {
        // 파일 상단에 추가
        root.get().node.program.body.unshift(typoVarsImport);
      }
    }
  }
}
