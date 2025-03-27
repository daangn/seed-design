import {
  colorMappings,
  semanticColorMappings,
  staticColorMappings,
  scaleColorMappings,
} from "@seed-design/migration-index/color";
import type { Transform } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

// 색상 속성 관련 상수
const COLOR_BACKGROUND_PROPERTIES = [
  "background",
  "backgroundColor",
  "backgroundImage",
  "fill",
  "fillColor",
  "stroke",
];

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

  // 일반 색상 처리 (gray700 -> gray-700)
  const colorWithDash = colorName.replace(/([a-zA-Z]+)(\d+)/, "$1-$2");
  return `$scale.color.${colorWithDash}`;
}

/**
 * 토큰 문자열을 V3 형식으로 변환합니다.
 * 예: $color.palette.gray-700 -> $palette-gray-700
 * 예: $color.palette.static-white -> $palette-static-white
 * 예: $color.bg.layer-default -> $bg-layer-default
 */
function transformToken(token: string): string {
  // 이미 $ 형식인 경우 그대로 반환
  if (!token.startsWith("$color.")) {
    return token;
  }

  // 토큰을 분해하여 새 형식으로 구성
  const parts = token.substring(7).split(".");

  if (parts.length >= 2) {
    const category = parts[0]; // palette, bg, fg, stroke 등
    const values = parts.slice(1).join(".");

    // 대시(-) 형식 유지
    return `$${category}-${values}`;
  }

  // 기본 처리 (변환할 수 없는 경우)
  return token;
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
  // 정규화된 static 이름
  const staticToken = `$static.color.static-${staticName}`;

  // 정확히 일치하는 매핑 찾기
  let mapping = staticColorMappings.find((m) => m.previous === staticToken);

  // 매핑을 찾지 못한 경우, 다른 접근법 시도
  if (!mapping) {
    // previous 값에서 $static.color.static- 제거하고 비교
    for (const m of staticColorMappings) {
      const previousName = m.previous.replace("$static.color.static-", "");

      if (previousName === staticName) {
        mapping = m;
        break;
      }
    }
  }

  return mapping;
}

/**
 * 색상 값을 V3 형식으로 변환합니다.
 * property를 기반으로 bg/fg 선택을 결정합니다.
 */
function getTokenMapping(oldColorValue: string, propertyName?: string): string | null {
  // -semantic 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-semantic")) {
    const semanticName = oldColorValue.replace(/-semantic$/g, "");
    const mapping = findSemanticMapping(semanticName);

    if (mapping) {
      return selectAndTransformToken(mapping, propertyName);
    }
    return null;
  }

  // -static 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-static")) {
    const staticName = oldColorValue.replace(/-static$/g, "");
    const mapping = findStaticMapping(staticName);

    if (mapping) {
      return selectAndTransformToken(mapping, propertyName);
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
      return selectAndTransformToken(mapping, propertyName);
    }
  }

  // 다른 색상은 전체 colorMappings에서 찾기
  const mapping = colorMappings.find((m) => m.previous === previousToken);
  if (mapping) {
    return selectAndTransformToken(mapping, propertyName);
  }

  return null;
}

/**
 * 매핑에서 적절한 토큰을 선택하고 변환합니다.
 * bg/fg 선택은 속성 이름에 따라 결정됩니다.
 */
function selectAndTransformToken(mapping: any, propertyName?: string): string | null {
  let chosenToken: string | null = null;

  if (mapping.next.length === 1) {
    // next의 요소가 하나이면 바로 사용
    chosenToken = mapping.next[0];
  } else if (mapping.next.length > 1) {
    // next의 요소가 여러 개인 경우, 속성에 따라 bg/fg 선택
    const isBackgroundProperty = propertyName && COLOR_BACKGROUND_PROPERTIES.includes(propertyName);

    // background 관련 속성이면 bg 토큰 우선, 아니면 fg 토큰 우선
    const targetTokens = isBackgroundProperty
      ? mapping.next.filter((token: string) => token.includes("$color.bg"))
      : mapping.next.filter((token: string) => token.includes("$color.fg"));

    if (targetTokens.length > 0) {
      // 찾은 경우 첫 번째 토큰 사용
      chosenToken = targetTokens[0];
    } else {
      // palette 토큰 검색
      const paletteTokens = mapping.next.filter((token: string) =>
        token.includes("$color.palette"),
      );
      if (paletteTokens.length > 0) {
        chosenToken = paletteTokens[0];
      } else {
        // 다른 토큰이 없으면 첫 번째 매핑 사용
        chosenToken = mapping.next[0];
      }
    }
  }

  // 매핑된 토큰이 없고 alternative가 있는 경우 alternative에서 찾기
  if (
    !chosenToken &&
    "alternative" in mapping &&
    Array.isArray(mapping.alternative) &&
    mapping.alternative.length > 0
  ) {
    // alternative에서 palette 컬러 검색
    const alternativePaletteTokens = mapping.alternative.filter((token: string) =>
      token.includes("$color.palette"),
    );
    if (alternativePaletteTokens.length > 0) {
      chosenToken = alternativePaletteTokens[0];
    } else if (mapping.alternative.length > 0) {
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
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedPaths: Set<string>,
  transformationLog: Map<string, { previous: string; next: string; line: number }>,
): void {
  // path가 MemberExpression인지 확인
  if (path.node.type !== "MemberExpression" || !path.node.property) return;

  // theme.colors.xxx.computedValue 또는 theme.colors["xxx"].computedValue 형태인지 확인
  const themeObj = path.node.object;
  if (!themeObj || themeObj.type !== "MemberExpression") return;

  const colorsObj = themeObj.object;
  if (!colorsObj || colorsObj.type !== "Identifier" || colorsObj.name !== "theme") return;

  const colorsProp = themeObj.property;
  if (!colorsProp || colorsProp.type !== "Identifier" || colorsProp.name !== "colors") return;

  // 색상 토큰 이름 추출
  let colorName: string | undefined;

  // theme.colors["xxx"] 형태 처리
  if (path.node.computed && path.node.property.type === "StringLiteral") {
    colorName = path.node.property.value;
  }
  // theme.colors.xxx 형태 처리
  else if (!path.node.computed && path.node.property.type === "Identifier") {
    colorName = path.node.property.name;
  }
  // theme.colors['xxx'] 형태 처리
  else if (path.node.computed && path.node.property.type === "Literal") {
    colorName = path.node.property.value;
  }

  if (!colorName) return;

  // 경로 ID 생성
  const line = path.node.loc?.start.line || 0;
  const column = path.node.loc?.start.column || 0;
  const pathId = `${filePath}:${line}:${column}:${colorName}`;

  // 이미 처리한 경로는 건너뛰기
  if (processedPaths.has(pathId)) return;

  // 상위 속성 정보를 확인하여 속성 이름 찾기
  let propertyName: string | undefined;

  // 속성 이름을 찾기 위한 상위 컨텍스트 탐색
  let currentPath = path.parent;
  while (currentPath) {
    // JSX 속성인 경우
    if (currentPath.node.type === "JSXAttribute" && currentPath.node.name) {
      propertyName = currentPath.node.name.name;
      break;
    }
    // 객체 속성인 경우
    if (currentPath.node.type === "Property" && currentPath.node.key) {
      propertyName = currentPath.node.key.name || currentPath.node.key.value;
      break;
    }

    currentPath = currentPath.parent;
  }

  // 색상 토큰 변환
  let newToken: string | null = null;

  // 색상 토큰 매핑
  newToken = getTokenMapping(colorName, propertyName);

  if (newToken) {
    // 변환된 토큰으로 업데이트
    const processedToken = newToken.substring(1); // '$' 제거

    path.node.property = j.stringLiteral(processedToken);
    path.node.computed = true;

    // 변환 로그 추가
    transformationLog.set(`${colorName}:${line}`, {
      previous: colorName,
      next: newToken,
      line,
    });

    // 처리 완료 경로로 기록
    processedPaths.add(pathId);
  } else {
    // 매핑을 찾지 못한 경우 경고 로그
    logger.logTransformResult(filePath, {
      previousToken: colorName,
      nextToken: colorName,
      status: "warning",
      line,
      failureReason: "매핑을 찾을 수 없어 변환되지 않았습니다",
    });

    // 처리 완료 경로로 기록
    processedPaths.add(pathId);
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
  const transformationLog = new Map<string, { previous: string; next: string; line: number }>();

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

  // 변환 결과 로깅
  for (const [_, transformation] of transformationLog.entries()) {
    logger.logTransformResult(file.path, {
      previousToken: transformation.previous,
      nextToken: transformation.next,
      status: "success",
      line: transformation.line,
    });
  }

  logger.finishFile(file.path);

  return root.toSource();
};

export default transform;
