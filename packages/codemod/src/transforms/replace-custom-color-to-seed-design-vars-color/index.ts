import { colorMappings, type FoundationTokenMapping } from "@seed-design/migration-index";
import type { API, FileInfo, Options } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";
import { camelCaseToKebabCase } from "../../utils/case.js";
import { getTokenTypeForProperty } from "../../utils/color-properties.js";

// 로깅 설정
const logger = createTransformLogger("replace-custom-color-to-seed-design-vars-color");

// 프로젝트별로 다양한 컬러 접두사를 허용
const TARGET_PREFIXES = ["color", "f.color", "c", "bg"];


///////////////////////////////////////////////////////////////////

export default function transformer(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 파일 변환 시작 로깅
  logger.startFile(file.path);

  // 변환 여부 추적
  let hasChanges = false;

  // 컬러 매핑 정보를 가져옴
  const colorMap = colorMappings as FoundationTokenMapping[];

  // 복합 접두사 (f.color와 같은) 처리
  TARGET_PREFIXES.filter((prefix) => prefix.includes(".")).forEach((prefix) => {
    const parts = prefix.split(".");
    const objectName = parts[0];
    const propertyName = parts[1];

    root
      .find(j.MemberExpression, {
        object: {
          type: "MemberExpression",
          object: {
            type: "Identifier",
            name: objectName,
          },
          property: {
            type: "Identifier",
            name: propertyName,
          },
        },
      })
      .forEach((path) => {
        // f.color -> color로 변경
        if (
          path.node.object.type === "MemberExpression" &&
          path.node.object.property.type === "Identifier"
        ) {
          path.node.object.property.name = "color";
        }
        processColorNode(j, path, file, colorMap, prefix);
        hasChanges = true;
      });
  });

  // 단일 접두사 (color, c와 같은) 처리
  TARGET_PREFIXES.filter((prefix) => !prefix.includes(".")).forEach((prefix) => {
    root
      .find(j.MemberExpression, {
        object: {
          type: "Identifier",
          name: prefix,
        },
      })
      .forEach((path) => {
        // color는 그대로 유지
        processColorNode(j, path, file, colorMap, prefix);
        hasChanges = true;
      });
  });

  // 파일 변환 완료 로깅
  logger.finishFile(file.path);

  // 변경사항이 있는 경우에만 소스 반환
  return hasChanges ? root.toSource(options) : file.source;
}

// 적절한 토큰 선택 함수
function selectAppropriateToken(
  tokens: string[],
  preferredType: "bg" | "fg" | "stroke" | "palette",
): string | null {
  // 1. 선호하는 타입의 토큰을 우선 선택
  if (preferredType !== "palette") {
    const preferredToken = tokens.find((token) => token.includes(`$color.${preferredType}`));
    if (preferredToken) return preferredToken;
  }

  // 2. 선호 타입이 없는 경우 palette 토큰 시도 (alternative에서 가져올 수 있음)
  const paletteToken = tokens.find((token) => token.includes("$color.palette"));
  if (paletteToken) return paletteToken;

  // 3. 타입별 대안 토큰 시도
  if (preferredType === "fg") {
    const strokeToken = tokens.find((token) => token.includes("$color.stroke"));
    if (strokeToken) return strokeToken;
  }

  if (preferredType === "stroke") {
    const fgToken = tokens.find((token) => token.includes("$color.fg"));
    if (fgToken) return fgToken;
  }

  // 4. 일반적인 fallback 순서: fg > stroke > bg
  const fgToken = tokens.find((token) => token.includes("$color.fg"));
  if (fgToken) return fgToken;

  const strokeToken = tokens.find((token) => token.includes("$color.stroke"));
  if (strokeToken) return strokeToken;

  const bgToken = tokens.find((token) => token.includes("$color.bg"));
  if (bgToken) return bgToken;

  // 5. 첫 번째 토큰 반환
  return tokens[0] || null;
}

// 컬러 노드 처리 함수
function processColorNode(
  j: API["jscodeshift"],
  path: any,
  file: FileInfo,
  colorMap: FoundationTokenMapping[],
  objectName?: string,
) {
  // 속성명 가져오기 (dot notation과 bracket notation 모두 지원)
  const propertyName = path.node.property.name || path.node.property.value;

  if (!propertyName) {
    logger.logTransformResult(file.path, {
      previousToken: "Cannot determine property name",
      nextToken: null,
      line: path.node.loc?.start.line || 0,
      status: "failure",
      failureReason: "Property name not found",
    });
    return;
  }

  // CSS 속성 컨텍스트 파악
  const cssProperty = findParentPropertyName(path);
  const tokenType = getTokenTypeForProperty(cssProperty);

  // 매핑에서 해당 토큰 찾기
  // camelCase를 kebab-case로 변환하여 매핑 시도
  const kebabPropertyName = camelCaseToKebabCase(propertyName);

  const searchKeys = [propertyName, kebabPropertyName];

  // $semantic.* 패턴 처리
  if (propertyName.startsWith("$semantic.")) {
    const tokenPart = propertyName.replace("$semantic.", "");
    const kebabTokenPart = camelCaseToKebabCase(tokenPart);
    searchKeys.push(`$semantic.color.${kebabTokenPart}`);
    if (!propertyName.startsWith("$semantic.color.")) {
      searchKeys.push(propertyName.replace("$semantic.", "$semantic.color."));
    }
  }

  // $scale.* 패턴 처리
  if (propertyName.startsWith("$scale.")) {
    const tokenPart = propertyName.replace("$scale.", "");
    const kebabTokenPart = camelCaseToKebabCase(tokenPart);
    searchKeys.push(`$scale.color.${kebabTokenPart}`);
    if (!propertyName.startsWith("$scale.color.")) {
      searchKeys.push(propertyName.replace("$scale.", "$scale.color."));
    }
  }

  // $static.* 패턴 처리
  if (propertyName.startsWith("$static.")) {
    const tokenPart = propertyName.replace("$static.", "");
    const kebabTokenPart = camelCaseToKebabCase(tokenPart);
    searchKeys.push(`$static.color.${kebabTokenPart}`);
    if (!propertyName.startsWith("$static.color.")) {
      searchKeys.push(propertyName.replace("$static.", "$static.color."));
    }
  }

  // prefix 없이 오는 경우 각 prefix를 붙여서 시도
  if (!propertyName.startsWith("$")) {
    const kebabToken = camelCaseToKebabCase(propertyName);
    searchKeys.push(`$semantic.color.${kebabToken}`);
    searchKeys.push(`$scale.color.${kebabToken}`);
    searchKeys.push(`$static.color.${kebabToken}`);
  }

  const mapping = colorMap.find((m) => searchKeys.includes(m.previous));

  if (mapping) {
    if (mapping.next.length > 0) {
      // CSS 속성에 맞는 적절한 토큰 선택
      const selectedToken = selectAppropriateToken(mapping.next, tokenType);

      if (selectedToken) {
        // $color.* 형태를 dot notation으로 변환
        const transformedToken = transformTokenToDotNotation(selectedToken);

        // 속성명 변경 (bracket notation을 dot notation으로 변환)
        applyTransformedToken(j, path, transformedToken, objectName);

        // 성공 로깅
        logger.logTransformResult(file.path, {
          previousToken: propertyName,
          nextToken: transformedToken,
          line: path.node.loc?.start.line || 0,
          status: "success",
        });

        // 검증 필요한 경우 경고 로그 추가
        if (mapping.needsVerification) {
          logger.logTransformResult(file.path, {
            previousToken: propertyName,
            nextToken: transformedToken,
            line: path.node.loc?.start.line || 0,
            status: "warning",
            failureReason: "Needs manual verification",
          });
        }
      } else {
        // 적절한 토큰을 찾지 못한 경우
        logger.logTransformResult(file.path, {
          previousToken: propertyName,
          nextToken: null,
          line: path.node.loc?.start.line || 0,
          status: "failure",
          failureReason: "No suitable token found for property context",
        });
      }
    } else if (mapping.alternative && mapping.alternative.length > 0) {
      // 대체 토큰이 있는 경우
      const selectedToken = selectAppropriateToken(mapping.alternative, tokenType);

      if (selectedToken) {
        const transformedToken = transformTokenToDotNotation(selectedToken);

        // 속성명 변경 (bracket notation을 dot notation으로 변환)
        applyTransformedToken(j, path, transformedToken, objectName);

        // 성공 로깅 (대체 토큰 사용)
        logger.logTransformResult(file.path, {
          previousToken: propertyName,
          nextToken: transformedToken,
          line: path.node.loc?.start.line || 0,
          status: "warning",
          failureReason: "Using alternative token as primary is deprecated",
        });
      } else {
        // 적절한 대체 토큰을 찾지 못한 경우
        logger.logTransformResult(file.path, {
          previousToken: propertyName,
          nextToken: null,
          line: path.node.loc?.start.line || 0,
          status: "failure",
          failureReason: "No suitable alternative token found for property context",
        });
      }
    } else {
      // 매핑이 있지만 다음 토큰이 없는 경우 (deprecated)
      logger.logTransformResult(file.path, {
        previousToken: propertyName,
        nextToken: null,
        line: path.node.loc?.start.line || 0,
        status: "failure",
        failureReason: "Token is deprecated with no direct replacement",
      });
    }
  } else {
    // 매핑을 찾지 못한 경우 - bracket notation을 그냥 제거하고 dot notation으로 변경
    // 이는 기존 코드의 호환성을 위한 처리
    logger.logTransformResult(file.path, {
      previousToken: propertyName,
      nextToken: null,
      line: path.node.loc?.start.line || 0,
      status: "failure",
      failureReason: "No mapping found for token",
    });
  }
}

// 변환된 토큰을 AST에 적용하는 함수
function applyTransformedToken(
  j: API["jscodeshift"],
  path: any,
  transformedToken: string,
  objectName?: string,
) {
  // $color.palette.gray00 -> palette.gray00 형태로 분해
  const parts = transformedToken.split(".");

  if (parts.length >= 3 && parts[0] === "$color") {
    const category = parts[1]; // palette, bg, fg, stroke
    const value = parts.slice(2).join("."); // gray00 또는 복합값

    // bg 객체는 그대로 유지, color는 bracket notation으로 변환
    if (objectName === "bg") {
      // bg['palette.gray00'] 형태로 변환
      const tokenPath = `${category}.${value}`;
      path.node.computed = true;
      path.node.object = j.identifier("bg");
      path.node.property = j.literal(tokenPath);
    } else {
      // color['palette.gray00'] 형태로 변환
      const tokenPath = `${category}.${value}`;
      path.node.computed = true;
      path.node.object = j.identifier("color");
      path.node.property = j.literal(tokenPath);
    }
  }
}

// $color.palette.gray-00 -> $color.palette.gray00 형태로 변환하고 camelCase로 변환
function transformTokenToDotNotation(token: string): string {
  if (!token.startsWith("$color.")) {
    return token;
  }

  // $color.* -> $color.*로 변환하면서 하이픈을 제거하고 camelCase로 변환
  return token
    .replace(/-(\w)/g, (_, letter) => letter.toUpperCase()) // kebab-case to camelCase
    .replace(/(\d+)/g, "$1"); // 숫자는 그대로 유지
}

// 부모 속성명 찾기 (CSS property context)
function findParentPropertyName(path: any): string | undefined {
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
