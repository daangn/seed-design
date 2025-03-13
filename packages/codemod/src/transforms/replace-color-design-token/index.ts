import type * as jscodeshift from "jscodeshift";
import { colorMappings } from "@seed-design/migration-index/color";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import { handleImports } from "./import-handler.js";
import { getMemberExpressionName, buildMemberExpression } from "./ast-utils.js";
import { fromKebabCaseWithNumbers, toKebabCaseWithNumbers } from "./token-utils.js";
import type { z } from "zod";
import type { transformOptionsSchema } from "../../schema.js";

const replaceVarsColor: jscodeshift.Transform = (file, api, options) => {
  const inferedOptions = options as z.infer<typeof transformOptionsSchema>;
  const { reporter } = inferedOptions;
  const j = api.jscodeshift;
  const root = j(file.source);

  let reporterInstance: TokenMigrationReporter | null = null;
  if (reporter) {
    reporterInstance = new TokenMigrationReporter("replace-color-design-token");
    reporterInstance.startNewFile(file.path);
  }

  const unresolvedIdentifiers = new Set<string>();
  // 변경된 vars가 있는지 추적
  let hasChangedVars = false;
  // 남아있는 vars 타입 추적 (color 외의 다른 타입)
  const remainingVarsTypes = new Set<string>();

  // 먼저 모든 vars 참조를 찾아서 color 외의 타입을 식별
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return memberName.startsWith("vars.");
    })
    .forEach((path) => {
      const memberName = getMemberExpressionName(path);
      // vars.color로 시작하지 않는 vars 참조 추적
      if (memberName.startsWith("vars.") && !memberName.includes("color")) {
        const parts = memberName.split(".");
        if (parts.length >= 2) {
          remainingVarsTypes.add(parts[1]); // vars.typography 등의 타입 부분 저장
        }
      }
    });

  // Replace color references
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return memberName.startsWith("vars.");
    })
    .forEach((path) => {
      const memberName = getMemberExpressionName(path);
      const tokenId = toKebabCaseWithNumbers(memberName);
      const mapping = colorMappings.find((m) => m.previous === tokenId);
      const line = path.node.loc?.start.line;

      if (mapping) {
        let chosenToken: string | null = null;

        if (mapping.next.length === 1) {
          // next의 요소가 하나이면 바로 사용
          chosenToken = mapping.next[0];
        } else if (mapping.next.length > 1) {
          // next의 요소가 여러 개인 경우 palette 컬러를 우선 검색
          const paletteTokens = mapping.next.filter((token) => token.includes("$color.palette"));
          if (paletteTokens.length > 0) {
            chosenToken = paletteTokens[0];
          } else if (
            "alternative" in mapping &&
            Array.isArray(mapping.alternative) &&
            mapping.alternative.length > 0
          ) {
            // alternative에서 palette 컬러 검색
            const alternativePaletteTokens = mapping.alternative.filter((token) =>
              token.includes("$color.palette"),
            );
            if (alternativePaletteTokens.length > 0) {
              chosenToken = alternativePaletteTokens[0];
            }
          }
        }

        if (!chosenToken) {
          // chosenToken이 없는 경우: 매핑이 비었거나 palette 매핑을 찾지 못함
          if (reporterInstance) {
            reporterInstance.addResult({
              previousToken: memberName,
              nextToken: null,
              line,
              status: "failure",
              failureReason:
                mapping.next.length === 0 ? "No mapping available" : "No palette mapping found",
            });
          }
          unresolvedIdentifiers.add(memberName);
          return;
        }

        const newName = fromKebabCaseWithNumbers(chosenToken);
        const newExpr = buildMemberExpression(j, newName);
        path.replace(newExpr);

        // 변경된 vars가 있음을 표시
        hasChangedVars = true;

        if (reporterInstance) {
          reporterInstance.addResult({
            previousToken: memberName,
            nextToken: newName,
            line,
            status: "success",
          });
        }
      }
    });

  handleImports(
    j,
    root,
    unresolvedIdentifiers.size > 0,
    hasChangedVars,
    remainingVarsTypes.size > 0,
  );

  // Then update unresolved references to use legacyVars
  if (unresolvedIdentifiers.size > 0) {
    root
      .find(j.MemberExpression)
      .filter((path) => {
        const memberName = getMemberExpressionName(path);
        return unresolvedIdentifiers.has(memberName);
      })
      .forEach((path) => {
        const memberName = getMemberExpressionName(path);
        const newName = memberName.replace(/^vars\./, "legacyVars.");
        const newExpr = buildMemberExpression(j, newName);
        path.replace(newExpr);
      });
  }

  // legacyVars 사용 여부 확인 - 변환 후 코드에서 legacyVars가 사용되는지 확인
  const legacyVarsUsages = root.find(j.Identifier, { name: "legacyVars" });

  // legacyVars가 import에서만 사용되는 경우(length가 1) design-token import 제거
  if (legacyVarsUsages.length === 1) {
    // 파일 상단 주석 보존
    const fileComments = root.get().node.comments || [];

    // design-token import 찾기
    const designTokenImports = root.find(j.ImportDeclaration, {
      source: { value: "@seed-design/design-token" },
    });

    // import 주석 보존
    let importComments: any[] = [];
    designTokenImports.forEach((path) => {
      if (path.node.comments && path.node.comments.length > 0) {
        importComments = [...importComments, ...path.node.comments];
      }
    });

    // import 제거
    designTokenImports.remove();

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

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource({});
};

export default replaceVarsColor;
