import {
  colorMappings,
  scaleColorMappings,
  semanticColorMappings,
  staticColorMappings,
} from "@seed-design/migration-index/color";
import type { Transform } from "jscodeshift";
import { getParentPropertyName, processTernaryExpressions } from "../../utils/ast";
import {
  isBackgroundProperty,
  isStrokeProperty,
  isTextProperty,
} from "../../utils/color-properties";
import { createTransformLogger } from "../../utils/logger.js";

// 색상 속성 관련 상수는 이제 colorProperties 모듈에서 가져옵니다.

/**
 * kebabCaseToCamelCase 함수는 kebab-case 형식을 camelCase로 변환합니다.
 * 예: divider-1 -> divider1, paper-default -> paperDefault
 */
function kebabCaseToCamelCase(kebabCase: string): string {
  return kebabCase.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}

/**
 * camelCaseToKebabCase 함수는 camelCase 형식을 kebab-case로 변환합니다.
 * 예: divider1 -> divider-1, paperDefault -> paper-default
 */
function camelCaseToKebabCase(camelCase: string): string {
  // 대문자 앞에 - 추가하고 소문자로 변환
  let kebabCase = camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();

  // 숫자 앞에 - 추가 (divider1 -> divider-1)
  kebabCase = kebabCase.replace(/([a-z])(\d+)/g, "$1-$2");

  return kebabCase;
}

/**
 * normalizeSemanticName 함수는 Stitches에서 사용하는 시맨틱 컬러 이름을
 * migration-index에서 사용하는 정규화된 형식으로 변환합니다.
 */
function normalizeSemanticName(semanticName: string): string {
  // camelCase 형태의 시맨틱 이름을 kebab-case로 변환
  if (/[A-Z]/.test(semanticName) || /[a-z]\d+/.test(semanticName)) {
    return camelCaseToKebabCase(semanticName);
  }

  return semanticName;
}

/**
 * V2 스타일 색상 이름을 마이그레이션 인덱스의 이전 형식으로 변환합니다.
 * 예: $gray700 -> $scale.color.gray-700
 * 예: $white-static -> $static.color.static-white
 * 예: $onPrimaryOverlay50-semantic -> $semantic.color.on-primary-overlay-50
 * 예: $divider1-semantic -> $semantic.color.divider-1
 */
function normalizeOldColorName(oldColorValue: string): string {
  // $ 접두사 제거
  const colorName = oldColorValue.startsWith("$") ? oldColorValue.substring(1) : oldColorValue;

  // semantic 색상 처리 (예: $primary-semantic => $semantic.color.primary)
  if (colorName.endsWith("-semantic")) {
    // -semantic 접미사 제거
    const semanticName = colorName.replace(/-semantic$/, "");

    // 정규화된 시맨틱 이름으로 변환 (camelCase -> kebab-case)
    const normalizedName = normalizeSemanticName(semanticName);

    return `$semantic.color.${normalizedName}`;
  }

  // static 색상 처리 (예: $white-static -> $static.color.static-white)
  if (colorName.endsWith("-static")) {
    const staticName = colorName.replace(/-static$/, "");
    return `$static.color.static-${staticName}`;
  }

  // 일반 색상 처리 (gray700 -> gray-700, carrotAlpha50 -> carrot-alpha-50)
  let normalizedColorName = colorName;

  // camelCase가 포함된 경우 kebab-case로 변환 (carrotAlpha50 -> carrot-alpha-50)
  if (/[A-Z]/.test(colorName)) {
    normalizedColorName = camelCaseToKebabCase(colorName);
  } else {
    // 숫자 앞에 - 추가 (gray700 -> gray-700)
    normalizedColorName = colorName.replace(/([a-zA-Z]+)(\d+)/, "$1-$2");
  }

  return `$scale.color.${normalizedColorName}`;
}

/**
 * 토큰 문자열을 V3 형식으로 변환합니다.
 * 예: $color.palette.gray-700 -> palette-gray-700
 * 예: $color.palette.static-white -> palette-static-white
 * 예: $color.bg.layer-default -> bg-layer-default
 */
function transformToken(token: string): string {
  // 이미 $ 형식인 경우 그대로 반환
  if (!token.startsWith("$color.")) {
    return token.startsWith("$") ? token.substring(1) : token;
  }

  // 토큰을 분해하여 새 형식으로 구성
  const parts = token.substring(7).split(".");

  if (parts.length >= 2) {
    const category = parts[0]; // palette, bg, fg, stroke 등
    const values = parts.slice(1).join(".");

    // $ 기호 없이 대시(-) 형식 유지
    return `${category}-${values}`;
  }

  // 기본 처리 (변환할 수 없는 경우)
  return token.startsWith("$") ? token.substring(1) : token;
}

/**
 * findSemanticMapping 함수는 주어진 시맨틱 이름에 대한 매핑을 찾습니다.
 * camelCase와 kebab-case 모두 지원합니다.
 */
function findSemanticMapping(semanticName: string) {
  // 정규화된 시맨틱 이름 (kebab-case)
  const normalizedName = normalizeSemanticName(semanticName);
  const semanticToken = `$semantic.color.${normalizedName}`;

  // 1. 정확히 일치하는 매핑 찾기
  let mapping = semanticColorMappings.find((m) => m.previous === semanticToken);

  // 2. 매핑을 찾지 못한 경우, 형식을 변환해서 다시 시도
  if (!mapping) {
    // camelCase <-> kebab-case 변환 시도
    const camelCaseName = kebabCaseToCamelCase(normalizedName);
    const alternativeToken = `$semantic.color.${camelCaseName}`;
    mapping = semanticColorMappings.find((m) => m.previous === alternativeToken);

    // 매핑에 있는 previous 값에서 $semantic.color. 제거하고 비교
    if (!mapping) {
      for (const m of semanticColorMappings) {
        const previousName = m.previous.replace("$semantic.color.", "");

        // 매핑의 이름과 정규화된 이름 또는 camelCase 이름이 일치하는지 확인
        if (
          previousName === normalizedName ||
          previousName === camelCaseName ||
          kebabCaseToCamelCase(previousName) === camelCaseName ||
          camelCaseToKebabCase(previousName) === normalizedName
        ) {
          mapping = m;
          break;
        }
      }
    }
  }

  return mapping;
}

/**
 * findStaticMapping 함수는 주어진 static 이름에 대한 매핑을 찾습니다.
 */
function findStaticMapping(staticName: string) {
  // camelCase에서 kebab-case로 변환 (예: blackAlpha200 -> black-alpha-200)
  let normalizedStaticName = staticName;
  if (/[A-Z]/.test(staticName)) {
    normalizedStaticName = camelCaseToKebabCase(staticName);
  }

  // 정규화된 static 이름
  const staticToken = `$static.color.static-${normalizedStaticName}`;

  // 정확히 일치하는 매핑 찾기
  let mapping = staticColorMappings.find((m) => m.previous === staticToken);

  // 매핑을 찾지 못한 경우, 다른 접근법 시도
  if (!mapping) {
    // previous 값에서 $static.color.static- 제거하고 비교
    for (const m of staticColorMappings) {
      const previousName = m.previous.replace("$static.color.static-", "");

      // 일반 비교
      if (previousName === normalizedStaticName || previousName === staticName) {
        mapping = m;
        break;
      }

      // kebab-case <-> camelCase 변환 시도
      const kebabCasePrevious = previousName;
      const camelCasePrevious = kebabCaseToCamelCase(previousName);

      if (kebabCasePrevious === normalizedStaticName || camelCasePrevious === staticName) {
        mapping = m;
        break;
      }
    }
  }

  return mapping;
}

// 토큰 매핑 결과 인터페이스 정의
interface TokenMappingResult {
  token: string;
  needsVerification?: boolean;
  description?: string;
}

/**
 * 색상 값을 V3 형식으로 변환합니다.
 * property를 기반으로 bg/fg 선택을 결정합니다.
 */
function getTokenMapping(oldColorValue: string, propertyName?: string): TokenMappingResult | null {
  // -semantic 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-semantic")) {
    const semanticName = oldColorValue.replace(/-semantic$/g, "");
    const mapping = findSemanticMapping(semanticName);

    if (mapping) {
      const token = selectAndTransformToken(mapping, propertyName);
      return {
        token,
        needsVerification: mapping.needsVerification,
        description: mapping.description,
      };
    }
    return null;
  }

  // -static 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-static")) {
    const staticName = oldColorValue.replace(/-static$/g, "");
    const mapping = findStaticMapping(staticName);

    if (mapping) {
      const token = selectAndTransformToken(mapping, propertyName);
      return {
        token,
        needsVerification: mapping.needsVerification,
        description: mapping.description,
      };
    }
    return null;
  }

  // 일반 색상 토큰 (예: gray700)
  const previousToken = normalizeOldColorName(oldColorValue);

  // scale 색상 처리
  if (previousToken.startsWith("$scale.color.")) {
    const scaleColor = previousToken.replace("$scale.color.", "");
    const mapping = scaleColorMappings.find((m) => m.previous === `$scale.color.${scaleColor}`);

    if (mapping) {
      const token = selectAndTransformToken(mapping, propertyName);
      return {
        token,
        needsVerification: mapping.needsVerification,
        description: mapping.description,
      };
    }
  }

  // 다른 색상은 전체 colorMappings에서 찾기
  const mapping = colorMappings.find((m) => m.previous === previousToken);
  if (mapping) {
    const token = selectAndTransformToken(mapping, propertyName);
    return {
      token,
      needsVerification: mapping.needsVerification,
      description: mapping.description,
    };
  }

  return null;
}

/**
 * 매핑에서 적절한 토큰을 선택하고 변환합니다.
 * bg/fg 선택은 속성 이름에 따라 결정됩니다.
 */
function selectAndTransformToken(mapping: any, propertyName?: string): string | null {
  let chosenToken: string | null = null;

  // next가 비어있으면 원래 토큰을 그대로 반환 (변환하지 않음)
  if (mapping.next.length === 0) {
    // V3에서 지원되지 않는 색상은 원래 값 그대로 유지
    return null;
  }

  if (mapping.next.length === 1) {
    // next의 요소가 하나이면 바로 사용
    chosenToken = mapping.next[0];
  } else if (mapping.next.length > 1) {
    // 각 토큰 타입별로 분류
    const bgTokens = mapping.next.filter((token: string) => token.includes("$color.bg"));
    const fgTokens = mapping.next.filter((token: string) => token.includes("$color.fg"));
    const strokeTokens = mapping.next.filter((token: string) => token.includes("$color.stroke"));
    const paletteTokens = mapping.next.filter((token: string) => token.includes("$color.palette"));
    const otherTokens = mapping.next.filter(
      (token: string) =>
        !token.includes("$color.bg") &&
        !token.includes("$color.fg") &&
        !token.includes("$color.stroke") &&
        !token.includes("$color.palette"),
    );

    // 속성에 따라 분류
    const isBgProperty = isBackgroundProperty(propertyName);
    const isTextProp = isTextProperty(propertyName);
    const isStrokeProp = isStrokeProperty(propertyName);

    // semanticColors나 명확한 용도가 없는 속성은 palette 토큰 우선 사용
    const isGenericSemanticColor = !propertyName || (!isBgProperty && !isTextProp && !isStrokeProp);

    // 토큰 선택 로직
    if (isGenericSemanticColor && paletteTokens.length > 0) {
      // semanticColors 같은 일반적인 색상 정의에는 palette 토큰 우선 사용
      chosenToken = paletteTokens[0];
    } else if (isBgProperty && bgTokens.length > 0) {
      // 배경 속성이고 bg 토큰이 있으면 사용
      chosenToken = bgTokens[0];
    } else if (
      (isTextProp || propertyName === "fill" || propertyName === "fillColor") &&
      fgTokens.length > 0
    ) {
      // 텍스트/fill 속성이고 fg 토큰이 있으면 사용
      chosenToken = fgTokens[0];
    } else if ((isStrokeProp || propertyName === "stroke") && strokeTokens.length > 0) {
      // stroke 속성이고 stroke 토큰이 있으면 사용
      chosenToken = strokeTokens[0];
    } else if (paletteTokens.length > 0) {
      // 속성에 맞는 토큰이 없으면 palette 토큰 사용 (우선)
      chosenToken = paletteTokens[0];
    } else if (otherTokens.length > 0) {
      // palette 토큰도 없으면 기타 토큰 사용
      chosenToken = otherTokens[0];
    } else {
      // 모든 필터링이 실패하면 첫 번째 토큰 사용
      chosenToken = mapping.next[0];
    }
  }

  // 매핑된 토큰이 없고 alternative가 있는 경우 alternative에서 찾기
  if (
    !chosenToken &&
    "alternative" in mapping &&
    Array.isArray(mapping.alternative) &&
    mapping.alternative.length > 0
  ) {
    // alternative에서 palette 컬러 검색을 항상 우선함
    const alternativePaletteTokens = mapping.alternative.filter((token: string) =>
      token.includes("$color.palette"),
    );
    if (alternativePaletteTokens.length > 0) {
      chosenToken = alternativePaletteTokens[0];
    } else {
      // 팔레트 컬러가 없으면 첫 번째 대안 사용
      chosenToken = mapping.alternative[0];
    }
  }

  // 매핑을 찾지 못한 경우 null 반환
  if (!chosenToken) {
    return null;
  }

  // 선택된 토큰을 Stitches 형식으로 변환
  return transformToken(chosenToken);
}

/**
 * Stitches 테마 색상을 처리하는 함수
 */
function processThemeColor(
  j: any,
  path: any,
  _logger: any, // 사용되지 않는 매개변수 (현재 사용하지 않지만 API 일관성을 위해 유지)
  filePath: string,
  processedPaths: Set<string>,
  transformationLog: Map<
    string,
    {
      previous: string;
      next: string;
      line: number;
      needsVerification?: boolean;
      description?: string;
    }
  >,
) {
  // 이미 처리한 경로는 건너뛰기
  const pathIdentifier = path.node.loc?.start.line + ":" + path.node.loc?.start.column;
  if (processedPaths.has(pathIdentifier)) {
    return;
  }

  processedPaths.add(pathIdentifier);

  // 부모 속성 이름 가져오기 (색상 토큰 매핑에 사용)
  const parentPropertyName = getParentPropertyName(path);

  // theme.colors['primary-semantic'] 처럼 직접 속성에 접근하는 방식
  if (
    path.node?.property &&
    (path.node.property.type === "StringLiteral" || path.node.property.type === "Literal")
  ) {
    const colorValue = path.node.property.value;

    // 적절한 토큰으로 변환
    const mappingResult = getTokenMapping(colorValue, parentPropertyName);

    if (mappingResult?.token) {
      // 변환된 토큰 (V3 형식)
      const transformedToken = transformToken(mappingResult.token);

      // 로그 엔트리 생성
      const logEntry = {
        previous: colorValue,
        next: transformedToken,
        line: path.node.loc?.start.line,
        needsVerification: mappingResult.needsVerification,
        description: mappingResult.description,
      };

      // 로그 엔트리 저장
      const logKey = `${filePath}:${path.node.loc?.start.line}:${path.node.loc?.start.column}`;
      transformationLog.set(logKey, logEntry);

      // StringLiteral 노드 대체
      path.node.property = j.stringLiteral(transformedToken);
    }
  }
  // theme.colors.primary 처럼 dot notation으로 속성에 접근하는 방식
  else if (path.node?.property && path.node.property.type === "Identifier") {
    const colorValue = path.node.property.name;

    // 적절한 토큰으로 변환
    const mappingResult = getTokenMapping(colorValue, parentPropertyName);

    if (mappingResult?.token) {
      // 변환된 토큰 (V3 형식)
      const transformedToken = transformToken(mappingResult.token);

      // 로그 엔트리 생성
      const logEntry = {
        previous: colorValue,
        next: transformedToken,
        line: path.node.loc?.start.line,
        needsVerification: mappingResult.needsVerification,
        description: mappingResult.description,
      };

      // 로그 엔트리 저장
      const logKey = `${filePath}:${path.node.loc?.start.line}:${path.node.loc?.start.column}`;
      transformationLog.set(logKey, logEntry);

      // ObjectProperty, array bracket notation으로 변경
      // 예: theme.colors.primary -> theme.colors["<transformedToken>"]
      path.replace(
        j.memberExpression(
          j.memberExpression(j.identifier("theme"), j.identifier("colors"), false),
          j.stringLiteral(transformedToken),
          true,
        ),
      );
    }
  }
}

/**
 * 메인 transform 함수
 */
const transform: Transform = (file, api) => {
  const logger = createTransformLogger("replace-stitches-theme-color");
  const j = api.jscodeshift;
  const root = j(file.source);

  // 이미 처리한 경로 추적을 위한 Set
  const processedPaths = new Set<string>();

  // 변환 내역 추적을 위한 Map
  const transformationLog = new Map<
    string,
    {
      previous: string;
      next: string;
      line: number;
      needsVerification?: boolean;
      description?: string;
    }
  >();

  logger.startFile(file.path);

  // theme.colors 접근 패턴 찾기
  root
    .find(j.MemberExpression, {
      object: {
        type: "MemberExpression",
        object: {
          name: "theme",
        },
        property: {
          name: "colors",
        },
      },
    })
    .forEach((path) => {
      processThemeColor(j, path, logger, file.path, processedPaths, transformationLog);
    });

  // 삼항 연산자(ConditionalExpression) 내의 theme.colors 접근 패턴 찾기
  root.find(j.ConditionalExpression).forEach((ternaryPath) => {
    // 새로운 유틸리티 함수를 사용하여 중첩된 삼항 연산자 처리
    processTernaryExpressions(
      j,
      ternaryPath,
      {
        type: j.MemberExpression,
        filter: {
          object: {
            type: "MemberExpression",
            object: {
              name: "theme",
            },
            property: {
              name: "colors",
            },
          },
        },
      },
      (path, _context) => {
        // 컨텍스트 매개변수는 현재 사용하지 않음, 나중에 확장 가능성을 위해 유지
        // 부모 속성 이름을 삼항 연산자 컨텍스트에서 가져온 값으로 덮어쓰기
        // 중첩된 삼항 연산자에서는 최상위 부모 속성 이름을 사용
        processThemeColor(j, path, logger, file.path, processedPaths, transformationLog);
      },
      {
        processNestedTernaries: true, // 중첩된 삼항 연산자도 처리
      },
    );
  });

  // 템플릿 리터럴 내의 theme.colors 접근 패턴 찾기
  root
    .find(j.TemplateLiteral)
    .find(j.MemberExpression, {
      object: {
        type: "MemberExpression",
        object: {
          name: "theme",
        },
        property: {
          name: "colors",
        },
      },
    })
    .forEach((path) => {
      processThemeColor(j, path, logger, file.path, processedPaths, transformationLog);
    });

  // 변환 결과 로깅
  for (const [_, transformation] of transformationLog.entries()) {
    logger.logTransformResult(file.path, {
      previousToken: transformation.previous,
      nextToken: transformation.next,
      status: "success",
      line: transformation.line,
      needsVerification: transformation.needsVerification,
      description: transformation.description,
    });
  }

  logger.finishFile(file.path);

  return root.toSource();
};

export default transform;
