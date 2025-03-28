import {
  colorMappings,
  semanticColorMappings,
  staticColorMappings,
  scaleColorMappings,
} from "@seed-design/migration-index";
import type { ObjectExpression, ObjectMethod, ObjectProperty, Transform } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

// 색상 관련 CSS 속성 목록 (전역 상수)
const COLOR_PROPERTIES = {
  // 텍스트 관련 색상 속성
  text: [
    "color",
    "textColor",
    "textDecorationColor",
    "textEmphasisColor",
    "caretColor",
    "webkitTextFillColor",
    "webkitTextStrokeColor",
  ],

  // 배경 관련 색상 속성 (linear-gradient 포함)
  background: ["background", "backgroundColor", "backgroundImage", "backgroundBlendMode"],

  // 테두리 관련 색상 속성
  border: [
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderBlockColor",
    "borderBlockEndColor",
    "borderBlockStartColor",
    "borderInlineColor",
    "borderInlineEndColor",
    "borderInlineStartColor",
    "border",
    "borderTop",
    "borderRight",
    "borderBottom",
    "borderLeft",
    "borderBlock",
    "borderBlockEnd",
    "borderBlockStart",
    "borderInline",
    "borderInlineEnd",
    "borderInlineStart",
  ],

  // 아웃라인 관련 색상 속성
  outline: ["outlineColor", "outline"],

  // 그림자 관련 색상 속성
  shadow: ["boxShadow", "textShadow"],

  // SVG 관련 색상 속성
  svg: ["fill", "fillColor", "stroke", "floodColor", "lightingColor", "stopColor"],

  // 기타 색상 속성
  misc: [
    "accentColor",
    "scrollbarColor",
    "columnRuleColor",
    "textDecoration",
    "maskColor",
    "maskBorderColor",
    "outlineOffset",
    "filter", // drop-shadow 필터 등에서 색상이 사용될 수 있음
    "backdropFilter",
  ],
};

// 색상 관련 속성 목록
const ALL_COLOR_PROPERTIES = Object.values(COLOR_PROPERTIES).flat();

// 복합 속성 (여러 값을 가질 수 있는 속성)
const COMPLEX_PROPERTIES = [
  ...COLOR_PROPERTIES.border,
  ...COLOR_PROPERTIES.outline,
  ...COLOR_PROPERTIES.shadow,
  "textDecoration",
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
 * 특정 문자열이 변환 대상 색상 토큰인지 확인하는 함수 - 더 많은 패턴 감지
 */
function isColorToken(value: string): boolean {
  // $로 시작하는지 확인
  if (!value.startsWith("$")) return false;

  // -semantic이나 -static으로 끝나는 경우 색상 토큰으로 판단
  if (value.endsWith("-semantic") || value.endsWith("-static")) {
    return true;
  }

  // $gray900, $blue500 등의 패턴 확인 ($gray00도 포함)
  if (/^\$([a-zA-Z]+)(\d+)$/.test(value)) {
    return true;
  }

  // $grayAlpha50, $blueAlpha200 등의 패턴 확인
  if (/^\$([a-zA-Z]+)[A-Z][a-zA-Z]*(\d+)$/.test(value)) {
    return true;
  }

  // $gray900-static, $blackAlpha200-static 패턴 확인 (숫자가 있는 색상 이름 + -static)
  if (/^\$([a-zA-Z]+[A-Za-z]*)(\d+)-static$/.test(value)) {
    return true;
  }

  // $whiteAlpha50-static 등의 특수 패턴 확인
  if (/^\$([a-zA-Z]+)[A-Z][a-zA-Z]*(\d+)-static$/.test(value)) {
    return true;
  }

  // 이미 V3 형식인 경우 처리하지 않음
  if (
    value.startsWith("$palette-") ||
    value.startsWith("$bg-") ||
    value.startsWith("$fg-") ||
    value.startsWith("$stroke-")
  ) {
    return false;
  }

  return false;
}

// 매핑 결과 인터페이스 정의
interface TokenMappingResult {
  token: string;
  needsVerification?: boolean;
  description?: string;
}

/**
 * V2 스타일 색상 이름을 마이그레이션 인덱스의 이전 형식으로 변환합니다.
 * 예: $gray700 -> $scale.color.gray-700
 * 예: $white-static -> $static.color.static-white
 * 예: $onPrimaryOverlay50-semantic -> $semantic.color.on-primary-overlay-50
 * 예: $divider1-semantic -> $semantic.color.divider-1
 * 예: $gray900-static -> $static.color.static-gray-900
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
    // -static 접미사 제거
    const staticPart = colorName.replace(/-static$/, "");

    // gray900-static과 같은 패턴 처리
    if (/^([a-zA-Z]+)(\d+)$/.test(staticPart)) {
      // gray900 -> gray-900 변환
      const colorWithDash = staticPart.replace(/([a-zA-Z]+)(\d+)/, "$1-$2");
      return `$static.color.static-${colorWithDash}`;
    }

    return `$static.color.static-${staticPart}`;
  }

  // 이미 palette 형태인 경우 그대로 반환 (예: palette-gray-100)
  if (colorName.startsWith("palette-")) {
    return `$scale.color.${colorName.substring(8)}`;
  }

  // camelCase 형식의 색상을 처리 (grayAlpha50 -> gray-alpha-50)
  if (/[A-Z]/.test(colorName)) {
    const normalized = colorName
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/(\d+)/g, "-$1");
    return `$scale.color.${normalized}`;
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

/**
 * 색상 값을 V3 형식으로 변환합니다.
 * colorMappings에서 매핑을 찾아 V3 형식으로 변환합니다.
 * 매핑에 없는 경우 원래 값을 그대로 반환합니다.
 */
function getTokenMapping(oldColorValue: string): TokenMappingResult {
  // 현재 값이 이미 V3 형식이면 그대로 반환
  if (
    oldColorValue.startsWith("$palette-") ||
    oldColorValue.startsWith("$bg-") ||
    oldColorValue.startsWith("$fg-") ||
    oldColorValue.startsWith("$stroke-")
  ) {
    return {
      token: oldColorValue,
      needsVerification: false,
      description: "이미 V3 형식입니다",
    };
  }

  // -semantic 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-semantic")) {
    const semanticName = oldColorValue.replace(/^\$|-semantic$/g, "");
    const mapping = findSemanticMapping(semanticName);

    if (mapping?.next?.length > 0) {
      const token = selectAndTransformToken(mapping);

      if (token && token !== oldColorValue) {
        return {
          token,
          needsVerification: mapping.needsVerification,
          description: mapping.description,
        };
      }
    }
    // 매핑이 없거나 mapping.next가 빈 배열인 경우 원래 값 반환
    return {
      token: oldColorValue,
      needsVerification: true,
      description: "시멘틱 색상 매핑을 찾을 수 없거나 매핑의 next가 비어있어 원래 값을 유지합니다",
    };
  }

  // -static 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-static")) {
    const staticName = oldColorValue.replace(/^\$|-static$/g, "");
    const mapping = findStaticMapping(staticName);

    if (mapping?.next?.length > 0) {
      const token = selectAndTransformToken(mapping);

      if (token && token !== oldColorValue) {
        return {
          token,
          needsVerification: mapping.needsVerification,
          description: mapping.description,
        };
      }
    }
    // 매핑이 없거나 mapping.next가 빈 배열인 경우 원래 값 반환
    return {
      token: oldColorValue,
      needsVerification: true,
      description: "스태틱 색상 매핑을 찾을 수 없거나 매핑의 next가 비어있어 원래 값을 유지합니다",
    };
  }

  // $로 시작하는 색상 토큰인지 확인 (기본 색상 패턴)
  if (oldColorValue.startsWith("$") && /^\$([a-zA-Z]+)(\d+)$/.test(oldColorValue)) {
    // 정규화된 형식으로 변환
    const previousToken = normalizeOldColorName(oldColorValue);

    // 마이그레이션 매핑 찾기
    let result = null;
    let needsVerification = false;
    let description = null;
    let mapping = null;

    // semantic 색상인 경우 semanticColorMappings에서 찾기
    if (previousToken.startsWith("$semantic.color.")) {
      const semanticName = previousToken.replace("$semantic.color.", "");
      mapping = findSemanticMapping(semanticName);

      if (mapping?.next?.length > 0) {
        result = selectAndTransformToken(mapping);
        needsVerification = mapping.needsVerification;
        description = mapping.description;
      }
    }
    // static 색상인 경우 staticColorMappings에서 찾기
    else if (previousToken.startsWith("$static.color.")) {
      const staticName = previousToken.replace("$static.color.static-", "");
      mapping = findStaticMapping(staticName);

      if (mapping?.next?.length > 0) {
        result = selectAndTransformToken(mapping);
        needsVerification = mapping.needsVerification;
        description = mapping.description;
      }
    }
    // scale 색상인 경우 처리
    else if (previousToken.startsWith("$scale.color.")) {
      const scaleColor = previousToken.replace("$scale.color.", "");
      // scaleColorMappings에서 정확히 일치하는 매핑 찾기
      mapping = scaleColorMappings.find((m) => m.previous === `$scale.color.${scaleColor}`);
      if (mapping?.next?.length > 0) {
        result = selectAndTransformToken(mapping);
        needsVerification = mapping.needsVerification;
        description = mapping.description;
      }
    }
    // 다른 색상은 전체 colorMappings에서 찾기
    else {
      mapping = colorMappings.find((m) => m.previous === previousToken);
      if (mapping?.next?.length > 0) {
        result = selectAndTransformToken(mapping);
        needsVerification = mapping.needsVerification;
        description = mapping.description;
      }
    }

    if (result && result !== oldColorValue) {
      return {
        token: result,
        needsVerification,
        description,
      };
    }

    // 매핑이 없거나 원본 값과 동일한 경우 원래 값 유지
    return {
      token: oldColorValue,
      needsVerification: true,
      description: "색상 매핑을 찾을 수 없거나 매핑의 next가 비어있어 원래 값을 유지합니다",
    };
  }

  // 패턴이 일치하지 않는 경우 원래 값 유지
  return {
    token: oldColorValue,
    needsVerification: true,
    description: "지원되지 않는 패턴이므로 원래 값을 유지합니다",
  };
}

/**
 * selectAndTransformToken 함수는 mapping의 next 배열에서 가장 적합한 토큰을 선택합니다.
 * 만약 next가 없거나 빈 배열이면 null 대신 이전 토큰을 반환합니다.
 */
function selectAndTransformToken(mapping: any): string {
  const preferred: string | undefined = mapping.preferred;

  // next 배열이 없거나 비어있으면 이전 토큰을 반환
  if (!mapping.next || mapping.next.length === 0) {
    // previous 값이 있으면 그대로 반환
    if (mapping.previous) {
      // stitches 토큰 형식으로 변환 ($semantic.color. -> $)
      return mapping.previous
        .replace(/^\$(semantic|static|scale)\.color\./, "$")
        .replace(/^$/, "$");
    }
    return ""; // previous가 없는 경우는 거의 없지만, 빈 문자열 반환
  }

  // preferred가 있으면 그것을 사용
  if (preferred && mapping.next.includes(preferred)) {
    return transformToken(preferred);
  }

  // 우선순위에 따라 다음을 선택
  // 1. UI 스펙 관련 토큰 (bg-, fg-, stroke-)
  // 2. 팔레트 토큰 (palette-)
  // 3. 있는 것
  const uiSpecTokens = mapping.next.filter(
    (token: string) =>
      token.startsWith("$color.bg.") ||
      token.startsWith("$color.fg.") ||
      token.startsWith("$color.stroke."),
  );
  const paletteTokens = mapping.next.filter((token: string) => token.startsWith("$color.palette."));

  let selectedToken: string;

  if (uiSpecTokens.length > 0) {
    selectedToken = uiSpecTokens[0];
  } else if (paletteTokens.length > 0) {
    selectedToken = paletteTokens[0];
  } else if (mapping.next.length > 0) {
    selectedToken = mapping.next[0];
  } else {
    // mapping.next가 빈 배열인 경우, 원본 토큰을 사용
    return (
      mapping.previous?.replace(/^\$(semantic|static|scale)\.color\./, "$").replace(/^$/, "$") || ""
    );
  }

  return transformToken(selectedToken);
}

/**
 * 스타일 객체의 모든 속성을 재귀적으로 처리
 */
function processStyleObject(
  styleObj: ObjectExpression,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<
    string,
    {
      previous: string;
      next: string;
      line: number;
      needsVerification?: boolean;
      description?: string;
    }
  >,
): void {
  // 객체의 모든 속성을 순회하며 색상 속성 처리
  if (!styleObj.properties) return;

  styleObj.properties.forEach((prop) => {
    if (prop.type === "ObjectProperty") {
      // 1. 색상 속성 처리
      processColorProperty(prop, logger, filePath, processedTokens, fileTransformationLog);

      // 2. 중첩된 객체 처리 (variants 외에 다른 중첩 객체도 처리)
      if (prop.value && prop.value.type === "ObjectExpression" && prop.value.properties) {
        processStyleObject(prop.value, logger, filePath, processedTokens, fileTransformationLog);
      }
    } else if (
      prop.type === "ObjectMethod" &&
      prop.key.type === "Identifier" &&
      prop.key.name === "variants"
    ) {
      // variants 속성 내부 처리
      processVariants(prop, logger, filePath, processedTokens, fileTransformationLog);
    }
  });
}

/**
 * 색상 속성을 처리하는 함수
 */
function processColorProperty(
  prop: ObjectProperty,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<
    string,
    {
      previous: string;
      next: string;
      line: number;
      needsVerification?: boolean;
      description?: string;
    }
  >,
): void {
  // 모든 StringLiteral 타입 속성에서 색상 토큰 확인
  if (
    prop.value.type === "StringLiteral" &&
    prop.value.value != null // null이나 undefined가 아닌지 확인
  ) {
    const stringValue = prop.value.value;

    // $ 문자가 포함된 경우에만 처리 (성능 최적화)
    if (stringValue.includes("$")) {
      // 1. 값 자체가 단일 색상 토큰인 경우 (예: color: '$gray700')
      if (stringValue.startsWith("$") && isColorToken(stringValue)) {
        const oldValue = stringValue;
        const line = prop.loc?.start.line || 0;
        const column = prop.loc?.start.column || 0;
        const tokenKey = `${filePath}:${line}:${column}:${oldValue}`;

        // 이미 처리한 토큰은 건너뛰기
        if (processedTokens.has(tokenKey)) {
          return;
        }

        const mappingResult = getTokenMapping(oldValue);

        // 매핑 결과가 있고 원본과 변환된 값이 다른 경우에만 변경
        if (mappingResult && mappingResult.token !== oldValue) {
          // 원본 따옴표 스타일을 보존
          prop.value.value = mappingResult.token;

          // 변환 로그에 추가
          const logKey = `${oldValue}:${line}`;
          fileTransformationLog.set(logKey, {
            previous: oldValue,
            next: mappingResult.token,
            line: line,
            needsVerification: mappingResult.needsVerification,
            description: mappingResult.description,
          });

          // 성공 로그 기록
          logger.logTransformResult(filePath, {
            previousToken: oldValue,
            nextToken: mappingResult.token,
            status: "success",
            line: line,
            needsVerification: mappingResult.needsVerification,
            description: mappingResult.description,
          });
        } else {
          // 매핑이 없거나 변환되지 않은 경우 경고 로그 (V3 형식이 아닌 경우만)
          if (
            !oldValue.startsWith("$palette-") &&
            !oldValue.startsWith("$bg-") &&
            !oldValue.startsWith("$fg-") &&
            !oldValue.startsWith("$stroke-")
          ) {
            const failureReason = mappingResult
              ? "매핑은 존재하지만 변환 결과가 원본과 동일합니다"
              : "매핑을 찾을 수 없어 변환되지 않았습니다";

            logger.logTransformResult(filePath, {
              previousToken: oldValue,
              nextToken: oldValue, // 변경되지 않음
              status: "warning",
              line: line,
              failureReason,
            });
          }
        }

        // 처리한 토큰 추적
        processedTokens.add(tokenKey);
      }
      // 2. 복합 값에 색상 토큰이 포함된 경우 (예: 'linear-gradient(...)')
      else {
        processComplexProperty(prop, logger, filePath, processedTokens, fileTransformationLog);
      }
    }
  }
}

/**
 * 복합 속성(border, boxShadow 등) 내의 색상 토큰을 처리하는 함수
 */
function processComplexProperty(
  prop: ObjectProperty,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<
    string,
    {
      previous: string;
      next: string;
      line: number;
      needsVerification?: boolean;
      description?: string;
    }
  >,
): void {
  // StringLiteral 타입과 value가 null이 아닌지 체크
  if (prop.value.type !== "StringLiteral" || prop.value.value == null) return;

  const value = prop.value.value;

  // 개선된 정규식: 문자열 내에서 '$'로 시작하는 모든 토큰을 찾기
  // 'linear-gradient(180deg, $blue50 0%, $paperDefault-semantic 100%)' 와 같은 복잡한 식에서도 동작
  const colorTokenPattern = /(\$[a-zA-Z0-9][\w\-A-Z]*(?:-semantic|-static)?)/g;
  const matches: { token: string; index: number }[] = [];
  let matchResult: RegExpExecArray | null;

  // 모든 토큰 위치를 먼저 찾기
  matchResult = colorTokenPattern.exec(value);
  while (matchResult !== null) {
    const token = matchResult[1];
    if (token && isColorToken(token)) {
      matches.push({
        token,
        index: matchResult.index,
      });
    }
    matchResult = colorTokenPattern.exec(value);
  }

  // 찾은 토큰을 뒤에서부터 교체하여 인덱스 문제 회피
  if (matches.length > 0) {
    let newValue = value;
    let hasChanges = false;

    // 뒤에서부터 교체하여 이전 교체로 인한 인덱스 변화 방지
    for (let i = matches.length - 1; i >= 0; i--) {
      const { token: oldColorToken, index } = matches[i];
      const line = prop.loc?.start.line || 0;
      const column = prop.loc?.start.column || 0;
      const tokenKey = `${filePath}:${line}:${column}:${oldColorToken}:${index}`;

      // 이미 처리한 토큰은 건너뛰기
      if (processedTokens.has(tokenKey)) {
        continue;
      }

      const mappingResult = getTokenMapping(oldColorToken);

      // 매핑 결과가 있고 원본과 변환된 값이 다른 경우에만 변경
      if (mappingResult && mappingResult.token !== oldColorToken) {
        // 해당 위치의 토큰만 교체
        const beforeReplace = newValue.substring(0, index);
        const afterReplace = newValue.substring(index + oldColorToken.length);
        newValue = beforeReplace + mappingResult.token + afterReplace;

        hasChanges = true;

        // 변환 로그에 추가
        const logKey = `${oldColorToken}:${line}`;
        fileTransformationLog.set(logKey, {
          previous: oldColorToken,
          next: mappingResult.token,
          line: line,
          needsVerification: mappingResult.needsVerification,
          description: mappingResult.description,
        });

        // 성공 로그 기록
        logger.logTransformResult(filePath, {
          previousToken: oldColorToken,
          nextToken: mappingResult.token,
          status: "success",
          line: line,
          needsVerification: mappingResult.needsVerification,
          description: mappingResult.description,
        });
      } else {
        // 매핑이 없거나 변환되지 않은 경우 경고 로그 (V3 형식이 아닌 경우만)
        if (
          !oldColorToken.startsWith("$palette-") &&
          !oldColorToken.startsWith("$bg-") &&
          !oldColorToken.startsWith("$fg-") &&
          !oldColorToken.startsWith("$stroke-")
        ) {
          const failureReason = mappingResult
            ? "매핑은 존재하지만 변환 결과가 원본과 동일합니다"
            : "매핑을 찾을 수 없어 변환되지 않았습니다";

          logger.logTransformResult(filePath, {
            previousToken: oldColorToken,
            nextToken: oldColorToken, // 변경되지 않음
            status: "warning",
            line: line,
            failureReason,
          });
        }
      }

      // 처리한 토큰으로 표시 (중복 경고 방지)
      processedTokens.add(tokenKey);
    }

    // 변경된 값이 있으면 업데이트
    if (hasChanges) {
      prop.value.value = newValue;
    }
  }
}

/**
 * variants 속성 내부를 처리하는 함수
 */
function processVariants(
  prop: ObjectMethod,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<
    string,
    {
      previous: string;
      next: string;
      line: number;
      needsVerification?: boolean;
      description?: string;
    }
  >,
): void {
  if (prop.body.type === "BlockStatement") {
    prop.body.body.forEach((statement) => {
      if (statement.type === "ReturnStatement" && statement.argument?.type === "ObjectExpression") {
        // variant 객체의 모든 프로퍼티 처리
        statement.argument.properties.forEach((variantProp) => {
          if (
            variantProp.type === "ObjectProperty" &&
            variantProp.value.type === "ObjectExpression"
          ) {
            // variant 값(객체) 처리
            processStyleObject(
              variantProp.value,
              logger,
              filePath,
              processedTokens,
              fileTransformationLog,
            );
          }
        });
      }
    });
  }
}

/**
 * 객체가 CSS 스타일 속성을 포함하는지 확인
 */
function hasStyleProperties(node: ObjectExpression): boolean {
  if (!node.properties || !Array.isArray(node.properties)) {
    return false;
  }

  // 어떤 CSS 속성이라도 가지고 있으면 스타일 객체로 처리
  return node.properties.some((prop: any) => {
    if (prop.type !== "ObjectProperty" || !prop.key) {
      return false;
    }

    // 값이 문자열이고 $ 토큰을 포함하는지 확인 (색상 토큰 가능성)
    if (
      prop.value &&
      prop.value.type === "StringLiteral" &&
      prop.value.value &&
      prop.value.value.includes("$")
    ) {
      return true;
    }

    // 키가 일반적인 CSS 속성인지 확인
    if (prop.key.type === "Identifier") {
      // 더 폭넓은 CSS 속성 탐지
      if (
        isColorProperty(prop.key.name) ||
        COMPLEX_PROPERTIES.includes(prop.key.name) ||
        /^(margin|padding|flex|grid|gap|font|text|align|justify|display|position|width|height|top|right|bottom|left)/.test(
          prop.key.name,
        )
      ) {
        return true;
      }
    }

    // 키가 문자열인 경우
    if (prop.key.type === "StringLiteral") {
      if (
        isColorProperty(prop.key.value) ||
        COMPLEX_PROPERTIES.includes(prop.key.value) ||
        /^(margin|padding|flex|grid|gap|font|text|align|justify|display|position|width|height|top|right|bottom|left)/.test(
          prop.key.value,
        )
      ) {
        return true;
      }
    }

    return false;
  });
}

/**
 * 정규식으로 color 속성 패턴 확인하는 함수
 */
function isColorProperty(propName: string): boolean {
  // 기본 color 속성 목록
  if (ALL_COLOR_PROPERTIES.includes(propName)) {
    return true;
  }

  // color1, color2, color3... 또는 color-1, color-2, color-3... 패턴 확인
  if (/^color(\d+|[-_]\d+)$/.test(propName)) {
    return true;
  }

  // background 관련 속성 (linear-gradient가 사용되는 속성)
  if (/^background/.test(propName)) {
    return true;
  }

  // border 관련 속성
  if (/^border/.test(propName)) {
    return true;
  }

  // 그림자 관련 속성
  if (/^(box|text)Shadow/.test(propName)) {
    return true;
  }

  // 필터 관련 속성
  if (/^(filter|backdrop-filter)$/.test(propName)) {
    return true;
  }

  // 그라디언트, 필터 등 색상이 사용될 가능성이 있는 모든 CSS 속성
  if (propName.includes("gradient") || propName.includes("color") || propName.includes("shadow")) {
    return true;
  }

  return false;
}

/**
 * 메인 transform 함수
 */
const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const logger = createTransformLogger("replace-stitches-styled-color");

  // 이미 처리한 토큰의 위치를 추적하기 위한 Set
  // 파일 경로를 포함하여 같은 파일을 여러 번 처리할 때도 중복 처리 방지
  const processedTokens = new Set<string>();

  // 각 파일의 색상 토큰 변환 내역을 추적 (로그 중복 방지용)
  const fileTransformationLog = new Map<
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

  // 1. styled 함수 호출 찾기
  root
    .find(j.CallExpression, {
      callee: { name: "styled" },
    })
    .forEach((path) => {
      // styled의 두 번째 인자(객체 리터럴) 처리
      if (path.node.arguments.length >= 2 && path.node.arguments[1].type === "ObjectExpression") {
        processStyleObject(
          path.node.arguments[1],
          logger,
          file.path,
          processedTokens,
          fileTransformationLog,
        );
      }
    });

  // 2. css 프로퍼티를 가진 객체 리터럴 찾기
  root
    .find(j.Property, {
      key: { name: "css" },
    })
    .forEach((path) => {
      if (path.node.value && path.node.value.type === "ObjectExpression") {
        processStyleObject(
          path.node.value,
          logger,
          file.path,
          processedTokens,
          fileTransformationLog,
        );
      }
    });

  // 3. css 함수 호출 찾기
  root
    .find(j.CallExpression, {
      callee: { name: "css" },
    })
    .forEach((path) => {
      if (
        path.node.arguments.length >= 1 &&
        path.node.arguments[0] &&
        path.node.arguments[0].type === "ObjectExpression"
      ) {
        processStyleObject(
          path.node.arguments[0],
          logger,
          file.path,
          processedTokens,
          fileTransformationLog,
        );
      }
    });

  // 4. CSS 속성을 포함하는 모든 객체 리터럴 찾기
  root.find(j.ObjectExpression).forEach((path) => {
    // CSS 관련 속성이 있는지 확인
    if (hasStyleProperties(path.node)) {
      processStyleObject(path.node, logger, file.path, processedTokens, fileTransformationLog);
    }
  });

  // 파일 처리가 끝나면 모든 변환 로그를 한 번에 출력
  for (const transformResult of fileTransformationLog.values()) {
    const { previous, next, line } = transformResult;
    if (previous !== next) {
      logger.logTransformResult(file.path, {
        previousToken: previous,
        nextToken: next,
        status: "success",
        line,
        needsVerification: transformResult.needsVerification,
        description: transformResult.description,
      });
    }
  }

  logger.finishFile(file.path);

  return root.toSource();
};

export default transform;
