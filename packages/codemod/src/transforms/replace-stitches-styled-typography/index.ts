import { typographyMappings } from "@seed-design/migration-index/typography";
import type { ObjectExpression, ObjectMethod, ObjectProperty, Transform } from "jscodeshift";
import { createTransformLogger } from "../../utils/logger.js";

/**
 * normalizeTypographyName 함수는 Stitches에서 사용하는 타이포그래피 이름을
 * migration-index에서 사용하는 정규화된 형식으로 변환합니다.
 */
function normalizeTypographyName(typographyName: string): string {
  // 문자열이 $로 시작하면 $를 제거
  let normalized = typographyName.startsWith("$") ? typographyName.substring(1) : typographyName;

  // 타이포그래피가 semantic.typography와 같은 형식이면 $semantic.typography 형식으로 변환
  if (normalized.startsWith("semantic.typography.")) {
    normalized = `$${normalized}`;
  } else if (!normalized.startsWith("$semantic.typography.")) {
    // 일반 토큰 (예: bodyM1Regular)을 semantic 형식으로 변환
    normalized = `$semantic.typography.${normalized}`;
  }

  return normalized;
}

/**
 * isTypographyToken 함수는 값이 타이포그래피 토큰인지 확인합니다.
 */
function isTypographyToken(value: string): boolean {
  if (typeof value !== "string") return false;

  // $text 등의 변수는 타이포그래피로 간주
  if (value.startsWith("$text")) return true;

  // bodyM1Regular, title1Bold 등의 패턴이 있으면 타이포그래피로 간주
  const typographyPatterns = [
    /body[LM][12](Regular|Bold)/,
    /title[123](Regular|Bold)/,
    /subtitle[12](Regular|Bold)/,
    /caption[12](Regular|Bold)/,
    /label[123456](Regular|Bold)/,
    /h[1234]/, // h1, h2, h3, h4와 같은 헤딩 패턴 추가
  ];

  if (typographyPatterns.some((pattern) => pattern.test(value))) {
    return true;
  }

  return false;
}

/**
 * getTokenMapping 함수는 이전 타이포그래피 토큰에 대응하는 새 토큰을 찾습니다.
 */
function getTokenMapping(oldTypographyValue: string): {
  token: string | null;
  source: "next" | "alternative" | null;
  mapping: any | null;
} {
  // $를 포함한 값인 경우 정규화
  const normalizedTypography = normalizeTypographyName(oldTypographyValue);

  // migration-index에서 매핑 찾기
  const mapping = typographyMappings.find((mapping) => mapping.previous === normalizedTypography);

  if (!mapping) {
    return { token: null, source: null, mapping: null };
  }

  // 새 토큰 선택 (우선순위: next > alternative)
  if (mapping.next && mapping.next.length > 0) {
    return { token: mapping.next[0], source: "next", mapping }; // 첫 번째 next 값 사용
  }

  if (mapping.alternative && mapping.alternative.length > 0) {
    return { token: mapping.alternative[0], source: "alternative", mapping }; // 첫 번째 alternative 값 사용
  }

  return { token: null, source: null, mapping };
}

/**
 * processStyleObject 함수는 스타일 객체를 순회하며 타이포그래피 속성을 변환합니다.
 */
function processStyleObject(
  styleObj: ObjectExpression,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
): void {
  const properties = styleObj.properties;

  for (const prop of properties) {
    // variants 처리 (중첩된 스타일 객체가 있을 수 있음)
    if (
      prop.type === "ObjectMethod" &&
      prop.key.type === "Identifier" &&
      prop.key.name === "variants"
    ) {
      processVariants(prop, logger, filePath, processedTokens, fileTransformationLog);
      continue;
    }

    // 일반 객체 속성 처리
    if (prop.type === "ObjectProperty") {
      // $text 속성이나 key가 오브젝트이면 처리
      if (
        (prop.key.type === "Identifier" && prop.key.name === "$text") ||
        (prop.key.type === "StringLiteral" && prop.key.value === "$text")
      ) {
        processTypographyProperty(prop, logger, filePath, processedTokens, fileTransformationLog);
      }

      // 중첩된 스타일 객체가 있는 경우 재귀 처리
      if (prop.value && prop.value.type === "ObjectExpression") {
        processStyleObject(prop.value, logger, filePath, processedTokens, fileTransformationLog);
      }
    }
  }
}

/**
 * processTypographyProperty 함수는 타이포그래피 속성을 처리합니다.
 */
function processTypographyProperty(
  prop: ObjectProperty,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
): void {
  // 문자열 리터럴만 처리
  if (
    prop.value.type !== "StringLiteral" &&
    (prop.value.type !== "TemplateLiteral" || prop.value.expressions.length > 0)
  ) {
    return;
  }

  let oldValue: string;
  if (prop.value.type === "StringLiteral") {
    oldValue = prop.value.value;
  } else {
    // 템플릿 리터럴인 경우 quasis[0]에서 값 추출
    oldValue = prop.value.quasis[0].value.raw;
  }

  // 이미 처리한 토큰이면 스킵
  const tokenKey = `${oldValue}-${prop.loc?.start.line || 0}`;
  if (processedTokens.has(tokenKey)) {
    return;
  }

  // 타이포그래피 토큰이 아니면 스킵
  if (!isTypographyToken(oldValue)) {
    return;
  }

  processedTokens.add(tokenKey);

  // 매핑 찾기
  const { token: newValue, source, mapping } = getTokenMapping(oldValue);
  const line = prop.loc?.start.line;

  if (newValue) {
    // 매핑이 있으면 변환하고 성공 로그 기록
    if (prop.value.type === "StringLiteral") {
      prop.value.value = newValue;
    } else {
      // 템플릿 리터럴 처리
      prop.value.quasis[0].value.raw = newValue;
      prop.value.quasis[0].value.cooked = newValue;
    }

    // alternative를 사용한 경우 경고 로그 추가
    if (source === "alternative") {
      logger.logTransformResult(filePath, {
        previousToken: oldValue,
        nextToken: newValue,
        line,
        status: "warning",
        failureReason: "Used alternative mapping",
      });
    } else {
      logger.logTransformResult(filePath, {
        previousToken: oldValue,
        nextToken: newValue,
        line,
        status: "success",
      });
    }

    if (line) {
      fileTransformationLog.set(tokenKey, { previous: oldValue, next: newValue, line });
    }
  } else if (mapping) {
    // 매핑은 있지만 next와 alternative 모두 없는 경우
    logger.logTransformResult(filePath, {
      previousToken: oldValue,
      nextToken: null,
      line,
      status: "warning",
      failureReason: "No mapping found",
    });
  } else {
    // 매핑이 없으면 경고 로그 기록
    logger.logTransformResult(filePath, {
      previousToken: oldValue,
      nextToken: null,
      line,
      status: "warning",
      failureReason: "No mapping found",
    });
  }
}

/**
 * processVariants 함수는 variants 객체를 처리합니다.
 */
function processVariants(
  prop: ObjectMethod,
  logger: ReturnType<typeof createTransformLogger>,
  filePath: string,
  processedTokens: Set<string>,
  fileTransformationLog: Map<string, { previous: string; next: string; line: number }>,
): void {
  // variants는 함수 본문이 BlockStatement이어야 함
  if (prop.body.type !== "BlockStatement") {
    return;
  }

  // body에 있는 return문 찾기
  const returnStatement = prop.body.body.find((statement) => statement.type === "ReturnStatement");

  if (
    !returnStatement ||
    !returnStatement.argument ||
    returnStatement.argument.type !== "ObjectExpression"
  ) {
    return;
  }

  // variants 객체 처리
  processStyleObject(
    returnStatement.argument,
    logger,
    filePath,
    processedTokens,
    fileTransformationLog,
  );
}

/**
 * replace-stitches-typography 트랜스폼은 Stitches에서 사용하는 타이포그래피 토큰을 v3 형식으로 변환합니다.
 */
const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const filePath = file.path;
  const source = file.source;

  // 내용이 없으면 조기 반환
  if (!source || source.trim() === "") {
    return source;
  }

  // 로거 생성
  const logger = createTransformLogger("replace-stitches-typography");
  logger.startFile(filePath);

  try {
    // 소스 코드를 AST로 파싱
    const root = j(source);

    // 변환 로그를 추적하기 위한 세트와 맵
    const processedTokens: Set<string> = new Set();
    const fileTransformationLog: Map<string, { previous: string; next: string; line: number }> =
      new Map();

    // styled 함수 호출 찾기 (Stitches styled)
    root
      .find(j.CallExpression, {
        callee: {
          name: "styled",
        },
      })
      .forEach((path) => {
        // styled 함수의 두 번째 인자(스타일 객체) 찾기
        const styleArg = path.node.arguments[1];
        if (styleArg && styleArg.type === "ObjectExpression") {
          processStyleObject(styleArg, logger, filePath, processedTokens, fileTransformationLog);
        }
      });

    // $text 속성을 가진 객체 찾기 (styled 함수 호출이 아닌 경우도 포함)
    root
      .find(j.ObjectProperty, {
        key: {
          type: "Identifier",
          name: "$text",
        },
      })
      .forEach((path) => {
        processTypographyProperty(
          path.node,
          logger,
          filePath,
          processedTokens,
          fileTransformationLog,
        );
      });

    // $text 속성을 가진 객체 찾기 (문자열 키 사용 경우)
    root
      .find(j.ObjectProperty, {
        key: {
          type: "StringLiteral",
          value: "$text",
        },
      })
      .forEach((path) => {
        processTypographyProperty(
          path.node,
          logger,
          filePath,
          processedTokens,
          fileTransformationLog,
        );
      });

    logger.finishFile(filePath);

    return root.toSource();
  } catch (error) {
    logger.logger.error(`Error processing ${filePath}: ${error}`);
    return source;
  }
};

export default transform;
