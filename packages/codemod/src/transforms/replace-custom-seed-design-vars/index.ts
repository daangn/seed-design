import { colorMappings } from "@seed-design/migration-index/color";
import { typographyMappings } from "@seed-design/migration-index/typography";
import type * as jscodeshift from "jscodeshift";
import {
  COLOR_BACKGROUND_PROPERTIES,
  COLOR_STROKE_PROPERTIES,
  COLOR_TEXT_PROPERTIES,
  getTokenTypeForProperty,
} from "../../utils/color-properties.js";
import { createTransformLogger } from "../../utils/logger.js";

// 하이픈(-) 제거 유틸리티 함수
function removeHyphens(str: string): string {
  return str.replace(/-/g, "");
}

// 하이픈(-) 추가 유틸리티 함수 - gray600 -> gray-600
function addHyphens(str: string): string {
  return str.replace(/([a-zA-Z]+)(\d+)/g, "$1-$2");
}

const replaceCustomSeedDesignVars: jscodeshift.Transform = (file, api) => {
  const logger = createTransformLogger("replace-custom-seed-design-vars");
  const j = api.jscodeshift;
  const root = j(file.source);

  logger.startFile(file.path);

  // @seed-design/design-token 패키지를 직접 사용하는 경우는 변환하지 않음
  if (
    root
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === "@seed-design/design-token")
      .size() > 0
  ) {
    logger.finishFile(file.path);
    return root.toSource();
  }

  // 1. Typography 변환: vars.typography.caption1Regular -> vars.typography.t3Regular
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const object = path.node.object;
      const property = path.node.property;

      return (
        object.type === "MemberExpression" &&
        object.object.type === "Identifier" &&
        object.object.name === "vars" &&
        object.property.type === "Identifier" &&
        object.property.name === "typography" &&
        property.type === "Identifier"
      );
    })
    .forEach((path) => {
      // typescript 타입 강제 변환
      const property = path.node.property as jscodeshift.Identifier;
      const typographyStyle = property.name;
      const line = path.node.loc?.start.line;

      // typography.mjs 매핑 형식으로 변환: caption1Regular -> $semantic.typography.caption1Regular
      const tokenIdRaw = `$semantic.typography.${typographyStyle}`;

      // 직접 typography.mjs에서 매핑 찾기
      const mapping = typographyMappings.find((m) => m.previous === tokenIdRaw);

      if (mapping) {
        let chosenToken: string | null = null;
        let useAlternative = false;

        if (mapping.next.length >= 1) {
          // next의 요소가 있으면 첫 번째 것 사용
          chosenToken = mapping.next[0];
        } else if (
          "alternative" in mapping &&
          Array.isArray(mapping.alternative) &&
          mapping.alternative?.length > 0
        ) {
          // next가 비어있고 alternative가 있는 경우 alternative 사용
          chosenToken = mapping.alternative[0];
          useAlternative = true;
        }

        if (chosenToken) {
          // Typography 타입은 변환 시 $semantic. 등의 프리픽스 없이 토큰 이름만 사용
          property.name = chosenToken;

          // alternative를 사용한 경우는 warning으로 로깅
          if (useAlternative) {
            logger.logTransformResult(file.path, {
              previousToken: tokenIdRaw,
              nextToken: chosenToken,
              line,
              status: "warning",
              failureReason: "Using alternative mapping since next mapping is empty",
            });
          } else {
            logger.logTransformResult(file.path, {
              previousToken: tokenIdRaw,
              nextToken: chosenToken,
              line,
              status: "success",
            });
          }
          return;
        }
      }

      // 매핑을 찾지 못하거나 chosenToken이 null인 경우
      logger.logTransformResult(file.path, {
        previousToken: tokenIdRaw,
        nextToken: null,
        line,
        status: "failure",
        failureReason: mapping
          ? "No mapping or alternative available"
          : "No mapping found for typography token",
      });
    });

  // 2. Color 변환: vars.color.gray600 -> vars.color.palette.gray700
  root
    .find(j.MemberExpression)
    .filter((path) => {
      const object = path.node.object;

      return (
        object.type === "MemberExpression" &&
        object.object.type === "Identifier" &&
        object.object.name === "vars" &&
        object.property.type === "Identifier" &&
        object.property.name === "color"
      );
    })
    .forEach((path) => {
      // typescript 타입 강제 변환
      const property = path.node.property as jscodeshift.Identifier;
      const colorProperty = property.name;
      const line = path.node.loc?.start.line;

      // 부모 컨텍스트 확인 (CSS property context)
      const parentPropertyName = findParentPropertyName(path);
      let preferredTokenType = getTokenTypeForProperty(parentPropertyName);

      // 특정 속성에 대한 명시적 토큰 타입 지정
      if (parentPropertyName) {
        if (COLOR_TEXT_PROPERTIES.includes(parentPropertyName)) {
          preferredTokenType = "fg";
        } else if (COLOR_BACKGROUND_PROPERTIES.includes(parentPropertyName)) {
          preferredTokenType = "bg";
        } else if (COLOR_STROKE_PROPERTIES.includes(parentPropertyName)) {
          preferredTokenType = "stroke";
        }
      }

      // 색상 매핑 검색에 사용할 토큰 ID 생성
      const semanticTokenId = `$semantic.color.${colorProperty}`;

      // scale 컬러 토큰은 하이픈(-) 형태로 변환해야 합니다 (예: gray600 -> gray-600)
      const colorWithDash = addHyphens(colorProperty);
      const scaleTokenId = `$scale.color.${colorWithDash}`;

      // 매핑 검색 - 우선순위를 가진 검색
      let mapping = colorMappings.find((m) => m.previous === semanticTokenId);

      if (!mapping) {
        mapping = colorMappings.find((m) => m.previous === scaleTokenId);
      }

      // 특정 케이스 디버깅 로그
      if (!mapping && /([a-zA-Z]+)(\d+)/.test(colorProperty)) {
        logger.logTransformResult(file.path, {
          previousToken: `Original: ${colorProperty}, Searched semantic: ${semanticTokenId}, Searched scale: ${scaleTokenId}`,
          nextToken: null,
          line,
          status: "warning",
          failureReason: "Debug - No mapping found for color token with numeric suffix",
        });
      }

      if (mapping) {
        let chosenToken: string | null = null;
        let useAlternative = false;

        // 토큰 선택 로직
        if (mapping.next.length >= 1) {
          // 속성 타입에 따른 우선순위 매핑 선택
          const typeMatchedTokens = mapping.next.filter((token) => {
            if (preferredTokenType === "stroke" && token.includes("$color.stroke")) return true;
            if (preferredTokenType === "fg" && token.includes("$color.fg")) return true;
            if (preferredTokenType === "bg" && token.includes("$color.bg")) return true;
            return false;
          });

          if (typeMatchedTokens.length > 0) {
            // 타입이 일치하는 토큰 중 첫 번째 선택
            chosenToken = typeMatchedTokens[0];
          } else if (preferredTokenType === "stroke") {
            // stroke 타입이 필요하지만 없는 경우 fg 토큰으로 대체
            const fgTokens = mapping.next.filter((token) => token.includes("$color.fg"));
            if (fgTokens.length > 0) {
              chosenToken = fgTokens[0];
            }
          }

          // 타입 매칭에 실패한 경우 palette 토큰을 우선으로 선택하거나 첫 번째 토큰 사용
          if (!chosenToken) {
            const paletteTokens = mapping.next.filter((token) => token.includes("$color.palette"));
            chosenToken = paletteTokens.length > 0 ? paletteTokens[0] : mapping.next[0];
          }
        }
        // next에 매핑이 없는 경우 alternative 사용
        else if (
          "alternative" in mapping &&
          Array.isArray(mapping.alternative) &&
          mapping.alternative?.length > 0
        ) {
          useAlternative = true;

          // alternative에서도 타입 매칭 시도
          const typeMatchedAltTokens = mapping.alternative.filter((token) => {
            if (preferredTokenType === "stroke" && token.includes("$color.stroke")) return true;
            if (preferredTokenType === "fg" && token.includes("$color.fg")) return true;
            if (preferredTokenType === "bg" && token.includes("$color.bg")) return true;
            return false;
          });

          if (typeMatchedAltTokens.length > 0) {
            chosenToken = typeMatchedAltTokens[0];
          } else if (preferredTokenType === "stroke") {
            // stroke 타입이 필요하지만 alternative에 없는 경우 fg 토큰으로 대체
            const fgAltTokens = mapping.alternative.filter((token) => token.includes("$color.fg"));
            if (fgAltTokens.length > 0) {
              chosenToken = fgAltTokens[0];
            }
          }

          // 타입 매칭에 실패한 경우 palette 토큰을 우선으로 선택하거나 첫 번째 토큰 사용
          if (!chosenToken) {
            const paletteAltTokens = mapping.alternative.filter((token) =>
              token.includes("$color.palette"),
            );
            chosenToken =
              paletteAltTokens.length > 0 ? paletteAltTokens[0] : mapping.alternative[0];
          }
        }

        if (chosenToken) {
          // 새 노드를 생성하여 기존 노드 대체
          // 컬러 토큰 형식: $color.palette.gray700 -> palette.gray700
          // 형식 변환: $color.xxx.yyy -> xxx.yyy
          const newNodePath = chosenToken.substring(7); // $color. 제거
          const parts = newNodePath.split(".");

          // 하이픈(-) 제거 - 예: palette.gray-900 -> palette.gray900
          for (let i = 0; i < parts.length; i++) {
            if (parts[i].includes("-")) {
              parts[i] = removeHyphens(parts[i]);
            }
          }

          // 새 노드 생성
          if (parts.length === 2) {
            // 간단한 컬러 토큰 (palette.gray700)
            j(path).replaceWith(
              j.memberExpression(
                j.memberExpression(
                  j.memberExpression(j.identifier("vars"), j.identifier("color")),
                  j.identifier(parts[0]),
                ),
                j.identifier(parts[1]),
              ),
            );
          } else if (parts.length === 1) {
            // 단일 세그먼트 (예: gray700)
            j(path).replaceWith(
              j.memberExpression(
                j.memberExpression(j.identifier("vars"), j.identifier("color")),
                j.identifier(parts[0]),
              ),
            );
          }

          // 로그 기록
          if (useAlternative) {
            logger.logTransformResult(file.path, {
              previousToken: mapping.previous,
              nextToken: chosenToken,
              line,
              status: "warning",
              failureReason: `Using alternative mapping: ${preferredTokenType} context (${parentPropertyName || "unknown"})`,
            });
          } else {
            logger.logTransformResult(file.path, {
              previousToken: mapping.previous,
              nextToken: chosenToken,
              line,
              status: "success",
            });
          }
          return;
        }
      }

      // 매핑을 찾지 못하거나 chosenToken이 null인 경우
      const searchedTokenIds = [semanticTokenId];
      // scale 토큰 ID가 다르면 추가
      if (colorProperty !== colorWithDash) {
        searchedTokenIds.push(scaleTokenId);
      }

      logger.logTransformResult(file.path, {
        previousToken: searchedTokenIds.join(", "),
        nextToken: null,
        line,
        status: "failure",
        failureReason: mapping
          ? "No mapping or alternative available"
          : "No mapping found for color token",
      });
    });

  logger.finishFile(file.path);
  return root.toSource();
};

// 부모 속성명 찾기 (CSS property context)
function findParentPropertyName(
  path: jscodeshift.ASTPath<jscodeshift.MemberExpression>,
): string | undefined {
  // 부모 객체 속성 체크
  const parent = path.parent;

  // 일반적인 JSX 속성 케이스: <div style={{ color: vars.color.gray600 }} />
  if (parent.node.type === "ObjectProperty" && parent.node.key.type === "Identifier") {
    return parent.node.key.name;
  }

  // 객체 안에 중첩된 케이스
  if (parent.node.type === "AssignmentExpression" && parent.node.left.type === "Identifier") {
    return parent.node.left.name;
  }

  // stitches나 다른 CSS-in-JS 라이브러리에서의 일반적인 패턴
  if (
    parent.node.type === "ObjectProperty" &&
    (parent.node.key.type === "StringLiteral" || parent.node.key.type === "Identifier")
  ) {
    return parent.node.key.type === "StringLiteral" ? parent.node.key.value : parent.node.key.name;
  }

  // JSX 속성인 경우 추가
  if (parent.node.type === "JSXAttribute" && parent.node.name.type === "JSXIdentifier") {
    return parent.node.name.name;
  }

  return undefined;
}

export default replaceCustomSeedDesignVars;
