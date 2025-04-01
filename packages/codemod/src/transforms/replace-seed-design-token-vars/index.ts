import { colorMappings } from "@seed-design/migration-index/color";
import { typographyMappings } from "@seed-design/migration-index/typography";
import type * as jscodeshift from "jscodeshift";
import { getTokenTypeForProperty, isFgProperty } from "../../utils/color-properties.js";
import { createTransformLogger } from "../../utils/logger.js";
import { buildMemberExpression, getMemberExpressionName } from "./ast-utils.js";
import { handleImports } from "./import-handler.js";
import {
  formatTypographyToken,
  fromKebabCaseWithNumbers,
  toKebabCaseWithNumbers,
} from "./token-utils.js";

const replaceVarsColorAndTypography: jscodeshift.Transform = (file, api) => {
  const logger = createTransformLogger("replace-color-design-token");

  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  const unresolvedIdentifiers = new Set<string>();
  // 변경된 color vars가 있는지 추적
  let hasChangedColorVars = false;
  // 변경된 typography가 있는지 추적
  let hasChangedTypography = false;
  // 남아있는 vars 타입 추적 (color, typography 외의 다른 타입)
  const remainingVarsTypes = new Set<string>();

  // 모든 vars 참조를 찾아서 처리 대상이 되는지 확인
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return memberName.startsWith("vars.");
    })
    .forEach((path) => {
      const memberName = getMemberExpressionName(path);
      // 처리 대상인지 확인
      const isColorToken =
        memberName.startsWith("vars.$scale.color.") ||
        memberName.startsWith("vars.$semantic.color.") ||
        memberName.startsWith("vars.$static.color.");

      const isTypographyToken = memberName.startsWith("vars.$semantic.typography.");

      // color나 typography가 아닌 vars 참조 추적
      if (memberName.startsWith("vars.") && !isColorToken && !isTypographyToken) {
        const parts = memberName.split(".");
        if (parts.length >= 2) {
          remainingVarsTypes.add(parts[1]); // vars.$scale 등의 타입 부분 저장
        }
      }
    });

  // Replace typography references - vars.$semantic.typography.* 패턴만 처리
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return memberName.startsWith("vars.$semantic.typography.");
    })
    .forEach((path) => {
      const memberName = getMemberExpressionName(path);
      // typography.mjs 매핑 형식으로 변환
      // vars.$semantic.typography.subtitle1Bold -> $semantic.typography.subtitle1Bold
      const tokenIdRaw = memberName.replace(/^vars\./, "");

      // 직접 typography.mjs에서 매핑 찾기
      const mapping = typographyMappings.find((m) => m.previous === tokenIdRaw);

      const line = path.node.loc?.start.line;

      if (mapping) {
        let chosenToken: string | null = null;
        let useAlternative = false;

        if (mapping.next.length === 1) {
          // next의 요소가 하나이면 바로 사용
          chosenToken = mapping.next[0];
        } else if (mapping.next.length > 1) {
          // next의 요소가 여러 개인 경우 첫 번째 것 사용
          chosenToken = mapping.next[0];
        } else if (
          mapping.next.length === 0 &&
          "alternative" in mapping &&
          Array.isArray(mapping.alternative) &&
          mapping.alternative?.length > 0
        ) {
          // next가 비어있고 alternative가 있는 경우 alternative 사용
          chosenToken = mapping.alternative[0];
          useAlternative = true;
        }

        if (chosenToken) {
          // Typography 변환 형식 생성
          const newName = formatTypographyToken(chosenToken);
          const newExpr = buildMemberExpression(j, newName);
          path.replace(newExpr);

          // 변경된 typography가 있음을 표시
          hasChangedTypography = true;

          // alternative를 사용한 경우는 warning으로 로깅
          if (useAlternative) {
            logger.logTransformResult(file.path, {
              previousToken: memberName,
              nextToken: newName,
              line,
              status: "warning",
              failureReason: "Using alternative mapping since next mapping is empty",
            });
          } else {
            logger.logTransformResult(file.path, {
              previousToken: memberName,
              nextToken: newName,
              line,
              status: "success",
            });
          }
          return;
        }
      }

      // 매핑을 찾지 못하거나 chosenToken이 null인 경우
      logger.logTransformResult(file.path, {
        previousToken: memberName,
        nextToken: null,
        line,
        status: "failure",
        failureReason: mapping
          ? "No mapping or alternative available"
          : "No mapping found for typography token",
      });
      unresolvedIdentifiers.add(memberName);
    });

  // Replace color references - 명확하게 세 가지 패턴만 처리
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const memberName = getMemberExpressionName(path);
      return (
        memberName.startsWith("vars.$scale.color.") ||
        memberName.startsWith("vars.$semantic.color.") ||
        memberName.startsWith("vars.$static.color.")
      );
    })
    .forEach((path) => {
      const memberName = getMemberExpressionName(path);

      // 부모 속성명 찾기 (CSS property context)
      const parentPropertyName = findParentPropertyName(path);
      let preferredTokenType = getTokenTypeForProperty(parentPropertyName);

      // 텍스트 관련 속성 강제 수정 (확실한 텍스트 속성만 fg로 매핑)
      const textProperties = [
        "color",
        "fill",
        "fillColor",
        "textColor",
        "textDecorationColor",
        "textEmphasisColor",
        "webkitTextFillColor",
        "caretColor",
        "markColor",
        "currentColor",
        "spellingErrorColor",
        "grammarErrorColor",
        "selectionColor",
        "stroke", // SVG에서 stroke는 fg로 처리하는 경우가 많음
      ];

      if (textProperties.includes(parentPropertyName || "")) {
        if (preferredTokenType !== "fg") {
          logger.logTransformResult(file.path, {
            previousToken: memberName,
            nextToken: null,
            line: path.node.loc?.start.line,
            status: "warning",
            failureReason: `Adjusting token type from ${preferredTokenType} to fg for property: ${parentPropertyName}`,
          });
          preferredTokenType = "fg";
        }
      }

      const tokenId = toKebabCaseWithNumbers(memberName);
      const mapping = colorMappings.find((m) => m.previous === tokenId);
      const line = path.node.loc?.start.line;

      if (mapping) {
        let chosenToken: string | null = null;
        let useAlternative = false;

        // 1. next 배열이 단 하나뿐이라면 해당 컬러 맵핑
        if (mapping.next.length === 1) {
          chosenToken = mapping.next[0];
        }
        // 2. 여러 토큰 중에서 선택해야 하는 경우
        else if (mapping.next.length > 1) {
          // 2-1. 속성 카테고리와 일치하는 토큰 맵핑 (bg or fg or stroke)
          const typeMatchedTokens = mapping.next.filter((token) => {
            if (preferredTokenType === "stroke" && token.includes("$color.stroke")) return true;
            if (preferredTokenType === "fg" && token.includes("$color.fg")) return true;
            if (preferredTokenType === "bg" && token.includes("$color.bg")) return true;
            return false;
          });

          if (typeMatchedTokens.length > 0) {
            // 카테고리 일치하는 토큰 중 첫 번째 선택
            chosenToken = typeMatchedTokens[0];
          }
          // 3. stroke가 next 맵핑에 없을 때 fg 컬러로 맵핑 시도
          else if (preferredTokenType === "stroke") {
            const fgTokens = mapping.next.filter((token) => token.includes("$color.fg"));
            if (fgTokens.length > 0) {
              chosenToken = fgTokens[0];
            }
          }

          // 여전히 토큰을 찾지 못했다면 palette 토큰 맵핑 시도
          if (!chosenToken) {
            const paletteTokens = mapping.next.filter((token) => token.includes("$color.palette"));
            if (paletteTokens.length > 0) {
              chosenToken = paletteTokens[0];
            } else {
              // 맵핑 실패 시 첫 번째 토큰 선택
              chosenToken = mapping.next[0];
            }
          }
        }

        // 4. next에서 찾지 못했다면 alternative에서 찾기
        if (
          !chosenToken &&
          "alternative" in mapping &&
          Array.isArray(mapping.alternative) &&
          mapping.alternative?.length > 0
        ) {
          // alternative 사용 표시
          useAlternative = true;

          // 4-1. alternative에서 카테고리 맵핑을 우선적으로 탐색
          const typeMatchedAltTokens = mapping.alternative.filter((token) => {
            if (preferredTokenType === "stroke" && token.includes("$color.stroke")) return true;
            if (preferredTokenType === "fg" && token.includes("$color.fg")) return true;
            if (preferredTokenType === "bg" && token.includes("$color.bg")) return true;
            return false;
          });

          if (typeMatchedAltTokens.length > 0) {
            // 카테고리 일치하는 대체 토큰 중 첫 번째 선택
            chosenToken = typeMatchedAltTokens[0];
          }
          // stroke가 alternative 맵핑에 없을 때 fg 대체 토큰 시도
          else if (preferredTokenType === "stroke") {
            const fgAltTokens = mapping.alternative.filter((token) => token.includes("$color.fg"));
            if (fgAltTokens.length > 0) {
              chosenToken = fgAltTokens[0];
            }
          }

          // 여전히 토큰을 찾지 못했다면 palette 대체 토큰 시도
          if (!chosenToken) {
            const altPaletteTokens = mapping.alternative.filter((token) =>
              token.includes("$color.palette"),
            );
            if (altPaletteTokens.length > 0) {
              chosenToken = altPaletteTokens[0];
            } else if (mapping.alternative.length > 0) {
              // 맵핑 실패 시 첫 번째 대체 토큰 선택
              chosenToken = mapping.alternative[0];
            }
          }
        }

        if (!chosenToken) {
          // chosenToken이 없는 경우: 매핑이 비었거나 적절한 매핑을 찾지 못함
          logger.logTransformResult(file.path, {
            previousToken: memberName,
            nextToken: null,
            line,
            status: "failure",
            failureReason: "No suitable mapping available for this context",
          });
          unresolvedIdentifiers.add(memberName);
          return;
        }

        const newName = fromKebabCaseWithNumbers(chosenToken);
        const newExpr = buildMemberExpression(j, newName);
        path.replace(newExpr);

        // 변경된 컬러 vars가 있음을 표시
        hasChangedColorVars = true;

        // 5. alternative를 사용한 경우는 warning으로 로깅
        if (useAlternative) {
          logger.logTransformResult(file.path, {
            previousToken: memberName,
            nextToken: newName,
            line,
            status: "warning",
            failureReason: `Using alternative mapping: ${preferredTokenType} context (${parentPropertyName || "unknown"})`,
          });
        } else {
          logger.logTransformResult(file.path, {
            previousToken: memberName,
            nextToken: newName,
            line,
            status: "success",
          });
        }
      } else {
        // 매핑을 찾지 못한 경우 legacyVars로 변경 (V3에서 지원되지 않는 컬러)
        logger.logTransformResult(file.path, {
          previousToken: memberName,
          nextToken: null,
          line,
          status: "failure",
          failureReason: "No mapping found for color token",
        });
        unresolvedIdentifiers.add(memberName);
      }
    });

  handleImports(
    j,
    root,
    unresolvedIdentifiers.size > 0,
    hasChangedColorVars,
    hasChangedTypography,
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

        logger.logTransformResult(file.path, {
          previousToken: memberName,
          nextToken: newName,
          line: path.node.loc?.start.line,
          status: "warning",
          failureReason: "Token mapped to legacyVars (unsupported in V3)",
        });
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

  logger.finishFile(file.path);

  return root.toSource({});
};

/**
 * 멤버 표현식이 사용되는 CSS 속성 이름을 찾는 함수
 * 예: style={{ color: vars.$scale.color.gray500 }} -> 'color'
 */
function findParentPropertyName(
  path: jscodeshift.ASTPath<jscodeshift.MemberExpression>,
): string | undefined {
  let propertyName: string | undefined;

  // 현재 경로에서 상위로 올라가며 속성명 찾기
  let currentPath: jscodeshift.ASTPath = path;

  // 노드가 직접 logging이 필요한 경우 주석 해제하여 디버깅
  // console.log("Starting node:", path.node.type);

  // JSXAttribute, Property, AssignmentExpression 유형 탐색 (최대 5단계 상위까지)
  for (let i = 0; i < 5; i++) {
    if (!currentPath.parent) break;

    currentPath = currentPath.parent;
    // console.log(`Parent level ${i + 1}:`, currentPath.node.type);

    if (currentPath.node.type === "JSXAttribute") {
      // JSX 속성인 경우: <div color={vars.$scale.color.gray500} />
      propertyName = currentPath.node.name.name as string;
      break;
    }

    if (currentPath.node.type === "Property") {
      // 객체 속성인 경우: { color: vars.$scale.color.gray500 }
      const node = currentPath.node;

      if (node.key.type === "Identifier") {
        propertyName = node.key.name;
        break;
      }

      if (node.key.type === "Literal" && typeof node.key.value === "string") {
        propertyName = node.key.value;
        break;
      }

      // StringLiteral 타입의 키 처리 (예: { "color": vars.$color })
      if (node.key.type === "StringLiteral" && typeof node.key.value === "string") {
        propertyName = node.key.value;
        break;
      }

      // 다른 타입의 키에 대한 처리
      if ("name" in node.key && typeof node.key.name === "string") {
        propertyName = node.key.name;
        break;
      }

      if ("value" in node.key && typeof node.key.value === "string") {
        propertyName = node.key.value;
        break;
      }
    }

    if (currentPath.node.type === "AssignmentExpression") {
      // 할당 표현식인 경우: element.style.color = vars.$scale.color.gray500
      if (
        currentPath.node.left.type === "MemberExpression" &&
        currentPath.node.left.property.type === "Identifier"
      ) {
        propertyName = currentPath.node.left.property.name;
        break;
      }

      // 다른 타입의 속성 이름도 처리
      if (
        currentPath.node.left.type === "MemberExpression" &&
        "name" in currentPath.node.left.property &&
        typeof currentPath.node.left.property.name === "string"
      ) {
        propertyName = currentPath.node.left.property.name;
        break;
      }
    }

    // 변수 할당 시 변수명이 속성명을 암시하는 경우 확인
    if (
      currentPath.node.type === "VariableDeclarator" &&
      currentPath.node.id.type === "Identifier"
    ) {
      const varName = currentPath.node.id.name.toLowerCase();
      if (varName.includes("fill") || varName === "color") {
        propertyName = "color";
        break;
      }
    }

    // ObjectExpression 내부에서 프로퍼티 확인
    if (currentPath.node.type === "ObjectExpression") {
      // 객체 내의 다른 속성들을 통해 문맥 파악
      const properties = currentPath.node.properties;
      for (const prop of properties) {
        if (prop.type === "Property" && prop.key.type === "Identifier") {
          // 텍스트 관련 속성이 존재하는 객체인지 확인
          if (
            prop.key.name === "color" ||
            prop.key.name === "textColor" ||
            prop.key.name === "fill"
          ) {
            // 문맥상 스타일 객체로 판단하고 처리
            propertyName = "color"; // 기본값으로 설정
            break;
          }
        }
      }
      if (propertyName) break;
    }
  }

  // 최상위 레벨에서 사용되는 color 속성 처리
  if (!propertyName && path.parent?.node.type === "ExpressionStatement") {
    propertyName = "color";
  }

  // 여전히 속성 이름을 찾지 못했다면, 값의 이름과 위치로 추측
  if (!propertyName) {
    const memberName = getMemberExpressionName(path);
    if (memberName.includes("color") || memberName.includes("Color")) {
      propertyName = "color";
    } else if (memberName.includes("background") || memberName.includes("Background")) {
      propertyName = "backgroundColor";
    } else if (memberName.includes("border") || memberName.includes("Border")) {
      propertyName = "borderColor";
    }
  }

  return propertyName;
}

export default replaceVarsColorAndTypography;
