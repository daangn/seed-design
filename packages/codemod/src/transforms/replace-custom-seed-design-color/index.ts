import { colorMappings, type FoundationTokenMapping } from "@seed-design/migration-index";
import type { API, FileInfo, Options } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";
import { getTokenTypeForProperty } from "../../utils/color-properties.js";
import { getParentPropertyName } from "../../utils/ast.js";
import { camelCaseToKebabCase } from "../../utils/case.js";

// 로깅 설정
const logger = createTransformLogger("replace-custom-seed-design-color");

// 프로젝트별로 다양한 색상 속성 접두사를 허용
const TARGET_PREFIXES = ["color", "background", "backgroundColor"];

// 매핑 접두사 목록
const TOKEN_PREFIXES = ["$semantic.color.", "$scale.color.", "$static.color."];

// 세분화된 네임스페이스 객체 이름들
const NAMESPACE_OBJECTS = ["semantic", "scale", "static"];

///////////////////////////////////////////////////////////////////

export default function transformer(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 파일 변환 시작 로깅
  logger.startFile(file.path);

  // 변환 여부 추적
  let hasChanges = false;

  // 색상 매핑 정보를 가져옴
  const colorMap = colorMappings as FoundationTokenMapping[];

  // 단일 접두사 (color, background와 같은) 처리
  TARGET_PREFIXES.filter((prefix) => !prefix.includes(".")).forEach((prefix) => {
    // 일반 접근 처리 (color.carrot500)
    root
      .find(j.MemberExpression, {
        object: {
          type: "Identifier",
          name: prefix,
        },
      })
      .forEach((path) => {
        // 네임스페이스 객체인 경우 처리하지 않음 (color.scale, color.semantic 등)
        if (NAMESPACE_OBJECTS.includes(path.node.property.name)) {
          return;
        }

        const parentPropertyName = getParentPropertyName(path);
        processColorNode(j, path, file, colorMap, prefix, parentPropertyName);
        hasChanges = true;
      });

    // 세분화된 네임스페이스 접근 처리 (color.scale.gray100, color.static.white 등)
    NAMESPACE_OBJECTS.forEach((namespace) => {
      root
        .find(j.MemberExpression, {
          object: {
            type: "MemberExpression",
            object: {
              type: "Identifier",
              name: prefix,
            },
            property: {
              type: "Identifier",
              name: namespace,
            },
          },
        })
        .forEach((path) => {
          const parentPropertyName = getParentPropertyName(path);
          processNamespacedColorNode(
            j,
            path,
            file,
            colorMap,
            prefix,
            namespace,
            parentPropertyName,
          );
          hasChanges = true;
        });
    });
  });

  // 파일 변환 완료 로깅
  logger.finishFile(file.path);

  // 변경사항이 있는 경우에만 소스 반환
  return hasChanges ? root.toSource(options) : file.source;
}

// 세분화된 네임스페이스 색상 노드 처리 함수
function processNamespacedColorNode(
  j: API["jscodeshift"],
  path: any,
  file: FileInfo,
  colorMap: FoundationTokenMapping[],
  prefix: string,
  namespace: string,
  parentPropertyName?: string,
) {
  // 속성명 가져오기
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

  // 토큰 타입 결정 (background, color 등에 따라 다른 토큰 타입 사용)
  let tokenType: "bg" | "fg" | "stroke" | "palette";

  if (prefix === "backgroundColor") {
    // backgroundColor 속성은 항상 bg 토큰 사용
    tokenType = "bg";
  } else {
    // 다른 속성은 parentPropertyName에 따라 결정
    tokenType = parentPropertyName ? getTokenTypeForProperty(parentPropertyName) : "fg";
  }

  // 정규화된 토큰 이름 생성 (scale.gray100 -> scale-gray-100)
  const namespacePrefix = `$${namespace}.color.`;
  const normalizedPropertyName = camelCaseToKebabCase(propertyName);
  const fullTokenName = `${namespacePrefix}${normalizedPropertyName}`;

  // 매핑 후보 토큰 목록 생성
  const potentialTokens = [fullTokenName];

  // 매핑에서 해당 토큰 찾기
  const mapping = findColorMapping(colorMap, potentialTokens, normalizedPropertyName);

  if (mapping) {
    if (mapping.next && mapping.next.length > 0) {
      // 적절한 토큰 선택 (bg, fg, stroke, palette 중)
      const selectedToken = selectAppropriateToken(mapping.next, tokenType);

      if (selectedToken) {
        // 토큰을 적용
        applySelectedToken(
          j,
          path,
          file,
          `${namespace}.${propertyName}`,
          selectedToken,
          prefix,
          mapping.needsVerification,
        );
      } else if (mapping.alternative && mapping.alternative.length > 0) {
        // 대체 토큰이 있는 경우
        const alternativeToken = selectAppropriateToken(mapping.alternative, tokenType);

        if (alternativeToken) {
          // 대체 토큰을 적용
          applySelectedToken(
            j,
            path,
            file,
            `${namespace}.${propertyName}`,
            alternativeToken,
            prefix,
            true,
            "Using alternative token as primary is deprecated",
          );
        } else {
          // 적절한 대체 토큰이 없는 경우
          logFailure(
            file.path,
            `${namespace}.${propertyName}`,
            path.node.loc?.start.line || 0,
            "No suitable alternative token found",
          );
        }
      } else {
        // 매핑이 있지만 다음 토큰이 없는 경우 (deprecated)
        logFailure(
          file.path,
          `${namespace}.${propertyName}`,
          path.node.loc?.start.line || 0,
          "Token is deprecated with no direct replacement",
        );
      }
    } else {
      // next 배열이 비어있는 경우 (deprecated)
      logFailure(
        file.path,
        `${namespace}.${propertyName}`,
        path.node.loc?.start.line || 0,
        "Token is deprecated with no direct replacement",
      );
    }
  } else {
    // Alpha와 같은 특수 토큰을 위한 처리
    if (
      propertyName.includes("Alpha") ||
      propertyName.toLowerCase().includes("alpha") ||
      namespace === "static"
    ) {
      // static.blackAlpha500, static.whiteAlpha200 등의 처리
      if (propertyName.includes("Alpha") || propertyName.toLowerCase().includes("alpha")) {
        // static.blackAlpha500 -> palette.staticBlackAlpha500
        const staticTokenName = `static-${propertyName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        const potentialStaticTokens = [`$static.color.${staticTokenName}`];

        const staticMapping = findColorMapping(colorMap, potentialStaticTokens, staticTokenName);

        if (staticMapping?.next && staticMapping.next.length > 0) {
          const selectedToken = selectAppropriateToken(staticMapping.next, tokenType);
          if (selectedToken) {
            applySelectedToken(
              j,
              path,
              file,
              `${namespace}.${propertyName}`,
              selectedToken,
              prefix,
              staticMapping.needsVerification,
            );
            return;
          }
        }

        // prefix에 따라 적절한 토큰 선택
        if (prefix === "backgroundColor") {
          applySelectedToken(
            j,
            path,
            file,
            `${namespace}.${propertyName}`,
            "$color.bg.default",
            prefix,
            false,
          );
        } else {
          applySelectedToken(
            j,
            path,
            file,
            `${namespace}.${propertyName}`,
            "$color.fg.default",
            prefix,
            false,
          );
        }
        return;
      }

      // static.white, static.black 등의 처리
      const staticTokenName = `static-${camelCaseToKebabCase(propertyName)}`;
      const potentialStaticTokens = [`$static.color.${staticTokenName}`];

      const staticMapping = findColorMapping(colorMap, potentialStaticTokens, staticTokenName);

      if (staticMapping?.next && staticMapping.next.length > 0) {
        const selectedToken = selectAppropriateToken(staticMapping.next, tokenType);
        if (selectedToken) {
          applySelectedToken(
            j,
            path,
            file,
            `${namespace}.${propertyName}`,
            selectedToken,
            prefix,
            staticMapping.needsVerification,
          );
          return;
        }
      }
    }

    // 매핑이 없는 경우
    logFailure(
      file.path,
      `${namespace}.${propertyName}`,
      path.node.loc?.start.line || 0,
      "No mapping found in the color tokens",
    );
  }
}

// 색상 노드 처리 함수
function processColorNode(
  j: API["jscodeshift"],
  path: any,
  file: FileInfo,
  colorMap: FoundationTokenMapping[],
  prefix: string,
  parentPropertyName?: string,
) {
  // 속성명 가져오기
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

  // 토큰 타입 결정 (background, color 등에 따라 다른 토큰 타입 사용)
  let tokenType: "bg" | "fg" | "stroke" | "palette";

  if (prefix === "backgroundColor") {
    // backgroundColor 속성은 항상 bg 토큰 사용
    tokenType = "bg";
  } else {
    // 다른 속성은 parentPropertyName에 따라 결정
    tokenType = parentPropertyName ? getTokenTypeForProperty(parentPropertyName) : "fg";
  }

  // 입력된 propertyName을 정규화하여 매핑에서 찾을 수 있도록 변환
  const normalizedPropertyName = camelCaseToKebabCase(propertyName);

  // 매핑 후보 토큰 목록 생성
  const potentialTokens = [
    normalizedPropertyName,
    ...TOKEN_PREFIXES.map((tokenPrefix) => `${tokenPrefix}${normalizedPropertyName}`),
  ];

  // 매핑에서 해당 토큰 찾기
  const mapping = findColorMapping(colorMap, potentialTokens, normalizedPropertyName);

  if (mapping) {
    if (mapping.next && mapping.next.length > 0) {
      // 적절한 토큰 선택 (bg, fg, stroke, palette 중)
      const selectedToken = selectAppropriateToken(mapping.next, tokenType);

      if (selectedToken) {
        // 토큰을 적용
        applySelectedToken(
          j,
          path,
          file,
          propertyName,
          selectedToken,
          prefix,
          mapping.needsVerification,
        );
      } else if (mapping.alternative && mapping.alternative.length > 0) {
        // 대체 토큰이 있는 경우
        const alternativeToken = selectAppropriateToken(mapping.alternative, tokenType);

        if (alternativeToken) {
          // 대체 토큰을 적용
          applySelectedToken(
            j,
            path,
            file,
            propertyName,
            alternativeToken,
            prefix,
            true,
            "Using alternative token as primary is deprecated",
          );
        } else {
          // 적절한 대체 토큰이 없는 경우
          logFailure(
            file.path,
            propertyName,
            path.node.loc?.start.line || 0,
            "No suitable alternative token found",
          );
        }
      } else {
        // 매핑이 있지만 다음 토큰이 없는 경우 (deprecated)
        logFailure(
          file.path,
          propertyName,
          path.node.loc?.start.line || 0,
          "Token is deprecated with no direct replacement",
        );
      }
    } else {
      // next 배열이 비어있는 경우 (deprecated)
      logFailure(
        file.path,
        propertyName,
        path.node.loc?.start.line || 0,
        "Token is deprecated with no direct replacement",
      );
    }
  } else {
    // Alpha와 같은 특수 토큰을 위한 처리
    if (
      propertyName.includes("Alpha") ||
      propertyName.toLowerCase().includes("alpha") ||
      propertyName.toLowerCase().includes("static")
    ) {
      // Gray-Alpha-200 처리
      if (propertyName.includes("Alpha") || propertyName.toLowerCase().includes("alpha")) {
        // prefix에 따라 적절한 토큰 선택
        if (prefix === "backgroundColor") {
          applySelectedToken(j, path, file, propertyName, "$color.bg.default", prefix, false);
        } else {
          applySelectedToken(j, path, file, propertyName, "$color.fg.default", prefix, false);
        }
        return;
      }

      // static-black-alpha 처리 (다른 특수 케이스)
      const specialToken = camelCaseToKebabCase(propertyName);

      // 정규식으로 매핑을 찾을 수 없는 static 토큰 처리
      for (const mapping of colorMap) {
        // static-black-alpha 등의 패턴 찾기
        if (mapping.previous.includes("static") && specialToken.includes("static")) {
          // prefix에 따라 적절한 토큰 타입 선택
          if (prefix === "backgroundColor") {
            // bg 토큰 찾기
            const bgToken = mapping.next.find((token) => token.includes("$color.bg"));
            if (bgToken) {
              applySelectedToken(j, path, file, propertyName, bgToken, prefix, true);
            } else {
              applySelectedToken(
                j,
                path,
                file,
                propertyName,
                mapping.next[0] || "$color.bg.default",
                prefix,
                true,
              );
            }
          } else {
            // fg 토큰 찾기
            const fgToken = mapping.next.find((token) => token.includes("$color.fg"));
            if (fgToken) {
              applySelectedToken(j, path, file, propertyName, fgToken, prefix, true);
            } else {
              applySelectedToken(
                j,
                path,
                file,
                propertyName,
                mapping.next[0] || "$color.fg.default",
                prefix,
                true,
              );
            }
          }
          return;
        }
      }
    }

    // 매핑이 없는 경우
    logFailure(
      file.path,
      propertyName,
      path.node.loc?.start.line || 0,
      "No mapping found in the color tokens",
    );
  }
}

/**
 * 색상 매핑을 찾는 함수
 */
function findColorMapping(
  colorMap: FoundationTokenMapping[],
  potentialTokens: string[],
  normalizedPropertyName: string,
): FoundationTokenMapping | undefined {
  // 정확한 매핑 찾기
  let mapping = colorMap.find((m) => potentialTokens.includes(m.previous));

  // 정확한 매핑이 없는 경우 Alpha와 같은 특수 케이스 처리
  if (
    !mapping &&
    (normalizedPropertyName.includes("alpha") || normalizedPropertyName.includes("-alpha"))
  ) {
    // gray-alpha-200 형식으로 찾기
    const specialCase = normalizedPropertyName.replace(/([a-zA-Z]+)-?alpha/, "$1-alpha");

    mapping = colorMap.find(
      (m) =>
        m.previous === specialCase ||
        TOKEN_PREFIXES.some((prefix) => m.previous === `${prefix}${specialCase}`),
    );
  }

  return mapping;
}

/**
 * kebab-case를 camelCase로 변환하는 함수
 */
function kebabToCamelCase(kebabString: string): string {
  return kebabString.replace(/-([a-z0-9])/g, (_, group) => group.toUpperCase());
}

/**
 * 선택된 토큰을 적용하는 함수
 */
function applySelectedToken(
  j: API["jscodeshift"],
  path: any,
  file: FileInfo,
  propertyName: string,
  selectedToken: string,
  prefix: string,
  needsVerification = false,
  warningReason = "Needs manual verification",
): void {
  // property를 직접 수정하지 않고, 객체 구조로 변경
  const parts = selectedToken.split(".");

  // $color.palette.gray-200 => palette.gray200
  if (parts.length >= 3) {
    const category = parts[1]; // palette, bg, fg, stroke

    // kebab-case를 camelCase로 변환 (gray-200 => gray200)
    const value = kebabToCamelCase(parts[2]);

    // 객체 접근 방식 변경: color.palette, color.fg, backgroundColor.bg, backgroundColor.palette
    // 객체 이름 (color 또는 background)은 유지
    const objectName = prefix; // color 또는 background/backgroundColor

    // 새로운 멤버 표현식 생성 (color.palette 또는 color.fg 등)
    const categoryAccess = j.memberExpression(j.identifier(objectName), j.identifier(category));

    // 새로운 property 적용
    path.node.object = categoryAccess;
    path.node.property = j.identifier(value);

    // 성공 로깅
    logger.logTransformResult(file.path, {
      previousToken: propertyName,
      nextToken: `${objectName}.${category}.${value}`,
      line: path.node.loc?.start.line || 0,
      status: "success",
    });

    // 검증 필요한 경우 경고 로그 추가
    if (needsVerification) {
      logger.logTransformResult(file.path, {
        previousToken: propertyName,
        nextToken: `${objectName}.${category}.${value}`,
        line: path.node.loc?.start.line || 0,
        status: "warning",
        failureReason: warningReason,
      });
    }
  } else {
    // 정상적인 형식이 아니면 실패 로깅
    logger.logTransformResult(file.path, {
      previousToken: propertyName,
      nextToken: selectedToken,
      line: path.node.loc?.start.line || 0,
      status: "failure",
      failureReason: "Invalid token format",
    });
  }
}

/**
 * 실패 로깅
 */
function logFailure(filePath: string, propertyName: string, line: number, reason: string): void {
  logger.logTransformResult(filePath, {
    previousToken: propertyName,
    nextToken: null,
    line: line,
    status: "failure",
    failureReason: reason,
  });
}

/**
 * 속성 타입에 맞는 토큰을 선택하는 함수
 */
function selectAppropriateToken(
  tokens: string[],
  tokenType: "bg" | "fg" | "stroke" | "palette",
): string | null {
  // 1. 속성 타입에 맞는 토큰을 우선적으로 사용
  if (tokenType === "bg") {
    // bg 속성에는 bg 토큰 우선 사용
    const bgToken = tokens.find((token) => token.includes("$color.bg"));
    if (bgToken) return bgToken;
  } else {
    // bg가 아닌 다른 속성에는 fg 토큰 우선 사용
    const fgToken = tokens.find((token) => token.includes("$color.fg"));
    if (fgToken) return fgToken;
  }

  // 2. 각 타입별 우선순위에 따라 토큰 찾기
  if (tokenType === "stroke") {
    // stroke 토큰 사용
    const strokeToken = tokens.find((token) => token.includes("$color.stroke"));
    if (strokeToken) return strokeToken;
  }

  // 3. fg 토큰 시도 (모든 타입에 대한 대체)
  if (tokenType !== "bg") {
    // bg 타입이 아닌 경우에만 fg 토큰 시도
    const fgToken = tokens.find((token) => token.includes("$color.fg"));
    if (fgToken) return fgToken;
  }

  // 4. bg 토큰 시도 (모든 타입에 대한 대체)
  if (tokenType === "bg") {
    // bg 타입인 경우에만 bg 토큰 시도
    const bgToken = tokens.find((token) => token.includes("$color.bg"));
    if (bgToken) return bgToken;
  }

  // 5. palette 토큰 시도 (모든 타입의 기본 대체)
  const paletteToken = tokens.find((token) => token.includes("$color.palette"));
  if (paletteToken) return paletteToken;

  // 6. 어떤 것도 찾지 못했으면 첫 번째 토큰 반환 (or null)
  return tokens[0] || null;
}
