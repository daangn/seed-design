import { colorMappings } from "@seed-design/migration-index/color";
import { typographyMappings } from "@seed-design/migration-index/typography";
import type * as jscodeshift from "jscodeshift";
import { camelCaseToKebabCase } from "../../utils/case.js";
import { getTokenTypeForProperty } from "../../utils/color-properties.js";
import { createTransformLogger } from "../../utils/logger.js";

/**
 * kebab-case를 camelCase로 변환하는 함수
 * 예: primary-hover -> primaryHover, gray-600 -> gray600
 */
function kebabCaseToCamelCase(kebabCase: string): string {
  return kebabCase.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/**
 * 토큰 경로를 camelCase로 변환하는 함수
 * 예: bg.layer-floating -> bg.layerFloating
 * 카테고리(bg, fg, stroke) 뒤의 경로는 점(.)을 제거하고 camelCase로 변환
 */
function tokenPathToCamel(path: string): string {
  const parts = path.split(".");

  // 첫 번째 부분(카테고리)는 그대로 유지
  const category = parts[0];

  if (parts.length <= 1) {
    return category;
  }

  // 두 번째 이후 부분들을 모두 결합하여 camelCase로 변환
  const restParts = parts.slice(1);

  // 각 부분을 먼저 kebab에서 camel로 변환
  const camelParts = restParts.map((part) => kebabCaseToCamelCase(part));

  // 첫 번째 부분은 그대로 두고, 나머지 부분은 첫 글자를 대문자로 변환하여 결합
  const combinedRest = camelParts
    .map((part, index) => {
      if (index === 0) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");

  return `${category}.${combinedRest}`;
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

      // static 색상 직접 처리 (vars.color.staticXxx -> vars.color.palette.staticXxx)
      if (colorProperty.startsWith("static")) {
        // static 색상은 palette 카테고리로 변환
        j(path).replaceWith(
          j.memberExpression(
            j.memberExpression(
              j.memberExpression(j.identifier("vars"), j.identifier("color")),
              j.identifier("palette"),
            ),
            j.identifier(colorProperty),
          ),
        );
        return;
      }

      // 부모 컨텍스트 확인 (CSS property context)
      const parentPropertyName = findParentPropertyName(path);

      // color-properties.ts의 유틸 함수 활용하여 적절한 토큰 타입 결정
      const preferredTokenType = getTokenTypeForProperty(parentPropertyName);

      // 색상 속성을 kebab-case로 변환하여 매핑 검색에 사용
      const colorPropertyKebab = camelCaseToKebabCase(colorProperty);

      // 색상 매핑 검색에 사용할 토큰 ID 생성
      const semanticTokenId = `$semantic.color.${colorPropertyKebab}`;
      const scaleTokenId = `$scale.color.${colorPropertyKebab}`;

      // 매핑 검색 - 우선순위를 가진 검색
      let mapping = colorMappings.find((m) => m.previous === semanticTokenId);

      if (!mapping) {
        mapping = colorMappings.find((m) => m.previous === scaleTokenId);
      }

      if (mapping) {
        let chosenToken: string | null = null;
        let useAlternative = false;

        // 토큰 선택 로직
        if (mapping.next.length >= 1) {
          // 속성 타입에 따른 우선순위 매핑 선택
          let matchedTokens: string[] = [];

          // 각 타입에 따른 우선순위 결정 로직
          switch (preferredTokenType) {
            case "stroke":
              // 1. stroke 토큰 시도
              matchedTokens = mapping.next.filter((token) => token.includes("$color.stroke"));

              // 2. stroke 토큰 없으면 fg 토큰 시도
              if (matchedTokens.length === 0) {
                matchedTokens = mapping.next.filter((token) => token.includes("$color.fg"));
              }

              // 3. fg 토큰도 없으면 palette 토큰 시도
              if (matchedTokens.length === 0) {
                matchedTokens = mapping.next.filter((token) => token.includes("$color.palette"));
              }
              break;

            case "fg":
              // 1. fg 토큰 시도
              matchedTokens = mapping.next.filter((token) => token.includes("$color.fg"));

              // 2. fg 토큰 없으면 palette 토큰 시도
              if (matchedTokens.length === 0) {
                matchedTokens = mapping.next.filter((token) => token.includes("$color.palette"));
              }
              break;

            case "bg":
              // 1. bg 토큰 시도
              matchedTokens = mapping.next.filter((token) => token.includes("$color.bg"));

              // 2. bg 토큰 없으면 palette 토큰 시도
              if (matchedTokens.length === 0) {
                matchedTokens = mapping.next.filter((token) => token.includes("$color.palette"));
              }
              break;

            default:
              // 기본은 palette 토큰 시도
              matchedTokens = mapping.next.filter((token) => token.includes("$color.palette"));
              break;
          }

          // 일치하는 토큰이 있으면 첫 번째 선택
          if (matchedTokens.length > 0) {
            chosenToken = matchedTokens[0];
          } else {
            // 위 로직으로 매칭 실패한 경우 기본 palette 토큰 사용
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
          let altMatchedTokens: string[] = [];

          // 각 타입에 따른 우선순위 결정 로직
          switch (preferredTokenType) {
            case "stroke":
              // 1. stroke 토큰 시도
              altMatchedTokens = mapping.alternative.filter((token) =>
                token.includes("$color.stroke"),
              );

              // 2. stroke 토큰 없으면 fg 토큰 시도
              if (altMatchedTokens.length === 0) {
                altMatchedTokens = mapping.alternative.filter((token) =>
                  token.includes("$color.fg"),
                );
              }

              // 3. fg 토큰도 없으면 palette 토큰 시도
              if (altMatchedTokens.length === 0) {
                altMatchedTokens = mapping.alternative.filter((token) =>
                  token.includes("$color.palette"),
                );
              }
              break;

            case "fg":
              // 1. fg 토큰 시도
              altMatchedTokens = mapping.alternative.filter((token) => token.includes("$color.fg"));

              // 2. fg 토큰 없으면 palette 토큰 시도
              if (altMatchedTokens.length === 0) {
                altMatchedTokens = mapping.alternative.filter((token) =>
                  token.includes("$color.palette"),
                );
              }
              break;

            case "bg":
              // 1. bg 토큰 시도
              altMatchedTokens = mapping.alternative.filter((token) => token.includes("$color.bg"));

              // 2. bg 토큰 없으면 palette 토큰 시도
              if (altMatchedTokens.length === 0) {
                altMatchedTokens = mapping.alternative.filter((token) =>
                  token.includes("$color.palette"),
                );
              }
              break;

            default:
              // 기본은 palette 토큰 시도
              altMatchedTokens = mapping.alternative.filter((token) =>
                token.includes("$color.palette"),
              );
              break;
          }

          // 일치하는 토큰이 있으면 첫 번째 선택
          if (altMatchedTokens.length > 0) {
            chosenToken = altMatchedTokens[0];
          } else {
            // 위 로직으로 매칭 실패한 경우 기본 palette 토큰 사용
            const paletteAltTokens = mapping.alternative.filter((token) =>
              token.includes("$color.palette"),
            );
            chosenToken =
              paletteAltTokens.length > 0 ? paletteAltTokens[0] : mapping.alternative[0];
          }
        }

        if (chosenToken) {
          // $color. 제거하여 실제 토큰 경로만 추출 (예: $color.bg.overlay -> bg.overlay)
          const tokenPath = chosenToken.substring(7);

          // 토큰 경로를 camelCase로 변환 (예: layer-floating -> layerFloating)
          const camelTokenPath = tokenPathToCamel(tokenPath);

          // 토큰 경로를 . 기준으로 분리
          const parts = camelTokenPath.split(".");

          // 새 노드 생성 - 이제 항상 두 부분으로 나뉨 (category.rest)
          if (parts.length === 2) {
            // 예: palette.gray700, bg.layerFloating
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
      logger.logTransformResult(file.path, {
        previousToken: `Failed to find mapping for: ${colorProperty} (kebab: ${colorPropertyKebab})`,
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
  const parentNode = path.parent.node;

  // 템플릿 리터럴 내부의 표현식인 경우: borderLeft: `4px solid ${vars.color.accent}`
  if (parentNode.type === "TemplateExpression" || parentNode.type === "TemplateLiteral") {
    // 트리를 위로 올라가며 부모 속성을 찾음
    let templateParent = path.parent;
    while (
      templateParent &&
      templateParent.node.type !== "ObjectProperty" &&
      templateParent.node.type !== "AssignmentExpression" &&
      templateParent.node.type !== "JSXAttribute"
    ) {
      templateParent = templateParent.parent;

      // 안전장치: 너무 깊이 들어가지 않도록 확인
      if (!templateParent) break;
    }

    // 올바른 부모 노드를 찾았으면 해당 속성명 반환
    if (templateParent) {
      if (templateParent.node.type === "ObjectProperty") {
        if (templateParent.node.key.type === "Identifier") {
          return templateParent.node.key.name;
        }
        if (templateParent.node.key.type === "StringLiteral") {
          return templateParent.node.key.value;
        }
      }

      if (
        templateParent.node.type === "AssignmentExpression" &&
        templateParent.node.left.type === "Identifier"
      ) {
        return templateParent.node.left.name;
      }

      if (
        templateParent.node.type === "JSXAttribute" &&
        templateParent.node.name.type === "JSXIdentifier"
      ) {
        return templateParent.node.name.name;
      }
    }

    return undefined;
  }

  // 일반적인 JSX 속성 케이스: <div style={{ color: vars.color.gray600 }} />
  const parent = path.parent;
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
