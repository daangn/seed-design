import {
  colorMappings,
  semanticColorMappings,
  staticColorMappings,
  scaleColorMappings,
} from "@seed-design/migration-index/color";
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

  // 배경 관련 색상 속성
  background: ["background", "backgroundColor", "backgroundImage"],

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
  misc: ["accentColor", "scrollbarColor", "columnRuleColor", "textDecoration"],
};

// 모든 색상 속성을 하나의 배열로 병합
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
 * 특정 문자열이 변환 대상 색상 토큰인지 확인하는 함수
 */
function isColorToken(value: string): boolean {
  // $로 시작하는지 확인
  if (!value.startsWith("$")) return false;

  // -semantic이나 -static으로 끝나는 경우 색상 토큰으로 판단
  if (value.endsWith("-semantic") || value.endsWith("-static")) {
    return true;
  }

  // $gray100, $blue500 등의 패턴 확인
  if (/^\$([a-zA-Z]+)(\d+)$/.test(value)) {
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

/**
 * 색상 값을 V3 형식으로 변환합니다.
 * colorMappings에서 매핑을 찾아 V3 형식으로 변환합니다.
 * 매핑에 없는 경우 원래 값을 그대로 반환합니다.
 */
function getTokenMapping(oldColorValue: string): string | null {
  // 현재 값이 이미 V3 형식이면 그대로 반환
  if (
    oldColorValue.startsWith("$palette-") ||
    oldColorValue.startsWith("$bg-") ||
    oldColorValue.startsWith("$fg-") ||
    oldColorValue.startsWith("$stroke-")
  ) {
    return null;
  }

  // -semantic 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-semantic")) {
    const semanticName = oldColorValue.replace(/^\$|-semantic$/g, "");
    const mapping = findSemanticMapping(semanticName);

    if (mapping) {
      return selectAndTransformToken(mapping);
    }
    // 매핑이 없는 경우 원래 값 반환
    return null;
  }

  // -static 접미사가 있는 경우 특별 처리
  if (oldColorValue.endsWith("-static")) {
    const staticName = oldColorValue.replace(/^\$|-static$/g, "");
    const mapping = findStaticMapping(staticName);

    if (mapping) {
      return selectAndTransformToken(mapping);
    }
    // 매핑이 없는 경우 원래 값 반환
    return null;
  }

  // $로 시작하는 색상 토큰인지 확인 (기본 색상 패턴)
  if (oldColorValue.startsWith("$") && /^\$([a-zA-Z]+)(\d+)$/.test(oldColorValue)) {
    // 정규화된 형식으로 변환
    const previousToken = normalizeOldColorName(oldColorValue);

    // 마이그레이션 매핑 찾기
    let result = null;

    // semantic 색상인 경우 semanticColorMappings에서 찾기
    if (previousToken.startsWith("$semantic.color.")) {
      const semanticName = previousToken.replace("$semantic.color.", "");
      const mapping = findSemanticMapping(semanticName);

      if (mapping) {
        result = selectAndTransformToken(mapping);
      }
    }
    // static 색상인 경우 staticColorMappings에서 찾기
    else if (previousToken.startsWith("$static.color.")) {
      const staticName = previousToken.replace("$static.color.static-", "");
      const mapping = findStaticMapping(staticName);

      if (mapping) {
        result = selectAndTransformToken(mapping);
      }
    }
    // scale 색상인 경우 처리
    else if (previousToken.startsWith("$scale.color.")) {
      const scaleColor = previousToken.replace("$scale.color.", "");
      // scaleColorMappings에서 정확히 일치하는 매핑 찾기
      const mapping = scaleColorMappings.find((m) => m.previous === `$scale.color.${scaleColor}`);
      if (mapping) {
        result = selectAndTransformToken(mapping);
      }
    }
    // 다른 색상은 전체 colorMappings에서 찾기
    else {
      const mapping = colorMappings.find((m) => m.previous === previousToken);
      if (mapping) {
        result = selectAndTransformToken(mapping);
      }
    }

    return result; // 매핑이 없으면 null 반환
  }

  // 패턴이 일치하지 않거나 매핑이 없는 경우 null 반환
  return null;
}

/**
 * 매핑에서 적절한 토큰을 선택하고 변환합니다.
 */
function selectAndTransformToken(mapping: any): string | null {
  // 매핑 토큰 선택 로직
  let chosenToken: string | null = null;

  if (mapping.next.length === 1) {
    // next의 요소가 하나이면 바로 사용
    chosenToken = mapping.next[0];
  } else if (mapping.next.length > 1) {
    // next의 요소가 여러 개인 경우, palette 컬러를 우선 검색
    const paletteTokens = mapping.next.filter((token: string) => token.includes("$color.palette"));
    if (paletteTokens.length > 0) {
      chosenToken = paletteTokens[0];
    } else {
      // palette 컬러가 없으면 첫 번째 매핑 사용
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
 * 스타일 객체의 모든 속성을 재귀적으로 처리
 */
function processStyleObject(
  styleObj: ObjectExpression,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
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
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
): void {
  const propName =
    prop.key.type === "Identifier"
      ? prop.key.name
      : prop.key.type === "StringLiteral"
        ? prop.key.value
        : "";

  // 단일 색상 속성 처리
  if (
    ALL_COLOR_PROPERTIES.includes(propName) &&
    prop.value.type === "StringLiteral" &&
    prop.value.value.startsWith("$") &&
    isColorToken(prop.value.value)
  ) {
    const oldValue = prop.value.value;
    const line = prop.loc?.start.line || 0;
    const column = prop.loc?.start.column || 0;
    const tokenKey = `${filePath}:${line}:${column}:${oldValue}`;

    // 이미 처리한 토큰은 건너뛰기
    if (processedTokens.has(tokenKey)) {
      return;
    }

    const newValue = getTokenMapping(oldValue);

    if (newValue) {
      // 원본 따옴표 스타일을 보존
      prop.value.value = newValue;

      // 변환 로그에 추가 (실제 변경이 있는 경우만)
      if (oldValue !== newValue) {
        const logKey = `${oldValue}:${line}`;
        fileTransformationLog.set(logKey, {
          previous: oldValue,
          next: newValue,
          line: line,
        });
      }

      // 처리한 토큰 추적
      processedTokens.add(tokenKey);
    } else {
      // 매핑이 없는 경우 경고 로그 (V3 형식이 아닌 경우만)
      if (
        !oldValue.startsWith("$palette-") &&
        !oldValue.startsWith("$bg-") &&
        !oldValue.startsWith("$fg-") &&
        !oldValue.startsWith("$stroke-") &&
        !oldValue.startsWith("$palette.") &&
        !oldValue.startsWith("$bg.") &&
        !oldValue.startsWith("$fg.") &&
        !oldValue.startsWith("$stroke.")
      ) {
        logger.logTransformResult(filePath, {
          previousToken: oldValue,
          nextToken: oldValue, // 변경되지 않음
          status: "warning",
          line: line,
          failureReason: "매핑을 찾을 수 없어 변환되지 않았습니다",
        });
      }

      // 처리한 토큰으로 표시
      processedTokens.add(tokenKey);
    }
  }

  // 복합 속성 처리 (예: border, outline, boxShadow 등)
  else if (COMPLEX_PROPERTIES.includes(propName) && prop.value.type === "StringLiteral") {
    processComplexProperty(prop, logger, filePath, processedTokens, fileTransformationLog);
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
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
): void {
  // StringLiteral 타입 체크 추가
  if (prop.value.type !== "StringLiteral") return;

  const value = prop.value.value;
  // 문자열에서 $로 시작하는 토큰 추출
  const colorTokenPattern = /(\$[\w\-]+)/g;
  const matches: { token: string; index: number }[] = [];
  let matchResult: RegExpExecArray | null = null;

  // 모든 토큰 위치를 먼저 찾기
  matchResult = colorTokenPattern.exec(value);
  while (matchResult !== null) {
    const token = matchResult[1];
    if (isColorToken(token)) {
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

      const newColorToken = getTokenMapping(oldColorToken);

      if (newColorToken) {
        // 해당 위치의 토큰만 교체
        const beforeReplace = newValue.substring(0, index);
        const afterReplace = newValue.substring(index + oldColorToken.length);
        newValue = beforeReplace + newColorToken + afterReplace;

        hasChanges = true;

        // 변환 로그에 추가 (실제 변경이 있는 경우만)
        if (oldColorToken !== newColorToken) {
          const logKey = `${oldColorToken}:${line}`;
          fileTransformationLog.set(logKey, {
            previous: oldColorToken,
            next: newColorToken,
            line: line,
          });
        }

        // 처리한 토큰 추적
        processedTokens.add(tokenKey);
      } else {
        // 매핑이 없는 경우 경고 로그 (V3 형식이 아닌 경우만)
        if (
          !oldColorToken.startsWith("$palette-") &&
          !oldColorToken.startsWith("$bg-") &&
          !oldColorToken.startsWith("$fg-") &&
          !oldColorToken.startsWith("$stroke-") &&
          !oldColorToken.startsWith("$palette.") &&
          !oldColorToken.startsWith("$bg.") &&
          !oldColorToken.startsWith("$fg.") &&
          !oldColorToken.startsWith("$stroke.")
        ) {
          logger.logTransformResult(filePath, {
            previousToken: oldColorToken,
            nextToken: oldColorToken, // 변경되지 않음
            status: "warning",
            line: line,
            failureReason: "매핑을 찾을 수 없어 변환되지 않았습니다",
          });
        }

        // 처리한 토큰으로 표시 (중복 경고 방지)
        processedTokens.add(tokenKey);
      }
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
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
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
 * 메인 transform 함수
 */
const transform: Transform = (file, api) => {
  const logger = createTransformLogger("replace-stitches-color");
  const j = api.jscodeshift;
  const root = j(file.source);

  // 이미 처리한 토큰의 위치를 추적하기 위한 Set
  // 파일 경로를 포함하여 같은 파일을 여러 번 처리할 때도 중복 처리 방지
  const processedTokens = new Set<string>();

  // 각 파일의 색상 토큰 변환 내역을 추적 (로그 중복 방지용)
  const fileTransformationLog = new Map<string, { previous: string; next: string; line: number }>();

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
    const hasStyleProps = path.node.properties.some((prop) => {
      if (prop.type !== "ObjectProperty" || prop.key.type !== "Identifier") {
        return false;
      }
      return ALL_COLOR_PROPERTIES.includes(prop.key.name);
    });

    // CSS 관련 속성이 있으면 처리
    if (hasStyleProps) {
      processStyleObject(path.node, logger, file.path, processedTokens, fileTransformationLog);
    }
  });

  // 파일 처리가 끝나면 모든 변환 로그를 한 번에 출력
  for (const [_, transformation] of fileTransformationLog.entries()) {
    logger.logTransformResult(file.path, {
      previousToken: transformation.previous,
      nextToken: transformation.next,
      status: "success",
      line: transformation.line,
    });
  }

  return root.toSource();
};

export default transform;
