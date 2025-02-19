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
    reporterInstance = new TokenMigrationReporter("replace-vars-color");
    reporterInstance.startNewFile(file.path);
  }

  const unresolvedIdentifiers = new Set<string>();

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

  // Handle imports first
  handleImports(j, root, unresolvedIdentifiers.size > 0);

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

  if (reporterInstance) {
    reporterInstance.finishFile();
    reporterInstance.writeReport();
  }

  return root.toSource();
};

export default replaceVarsColor;
