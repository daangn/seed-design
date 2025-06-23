import type { Transform } from "jscodeshift";
import postcss, { type Plugin } from "postcss";
import { typographyMappings } from "@seed-design/migration-index/typography";
import { createTransformLogger } from "../../utils/logger.js";

// transform 최상단에 logger 정의
const logger = createTransformLogger("replace-css-seed-design-typography-variable");

/**
 * 이전 토큰에서 새 토큰으로 변환하는 함수
 * @param previousToken 이전 토큰 (예: "$semantic.typography.label4-regular")
 * @returns 새 토큰 (예: "t2Regular") 또는 null (매핑 없을 경우)
 */
function transformTypographyToken(previousToken: string): string | null {
  // 매핑 찾기
  const mapping = typographyMappings.find((m) => m.previous === previousToken);

  if (!mapping) return null;

  // next 배열에 요소가 있으면 첫 번째 요소 사용
  if (mapping.next && mapping.next.length > 0) {
    return mapping.next[0];
  }

  // next 배열이 비어있고 alternative 배열이 있으면 첫 번째 alternative 사용
  if (
    (!mapping.next || mapping.next.length === 0) &&
    mapping.alternative &&
    mapping.alternative.length > 0
  ) {
    return mapping.alternative[0];
  }

  // 둘 다 없으면 null 반환
  return null;
}

/**
 * CSS 변수 값 변환 함수
 * @param value CSS 변수 값 (예: "var(--seed-semantic-typography-label4-regular-font-size)")
 * @returns 변환된 CSS 변수 값 (예: "var(--seed-font-size-t2)")
 */
function transformCssVarValue(
  value: string,
  filePath: string,
): {
  newValue: string;
  hasChanges: boolean;
  transformResults: Array<{ from: string; to: string }>;
} {
  let newValue = value;
  let hasChanges = false;
  const transformResults: Array<{ from: string; to: string }> = [];

  // CSS 변수 패턴을 찾아서 각각 변환
  newValue = value.replace(
    /var\(--seed-semantic-typography-([^-]+)-([^-]+)-([^)]+)\)/g,
    (match, style, weight, property) => {
      try {
        // 이전 토큰 형식으로 변환
        const previousToken = `$semantic.typography.${style}${weight.charAt(0).toUpperCase() + weight.slice(1)}`;

        // 매핑 찾기
        const newToken = transformTypographyToken(previousToken);
        if (!newToken) {
          logger.logTransformResult(filePath, {
            previousToken: match,
            nextToken: null,
            status: "warning",
            failureReason: `No mapping found for ${previousToken}`,
          });
          return match;
        }

        // 속성에 따라 새 변수 이름 생성
        let newVarName = "";
        switch (property) {
          case "font-size":
            newVarName = `--seed-font-size-${newToken.replace(/Regular|Medium|Bold/, "")}`;
            break;
          case "line-height":
            newVarName = `--seed-line-height-${newToken.replace(/Regular|Medium|Bold/, "")}`;
            break;
          case "font-weight":
            if (newToken.includes("Regular")) {
              newVarName = "--seed-font-weight-regular";
            } else if (newToken.includes("Medium")) {
              newVarName = "--seed-font-weight-medium";
            } else if (newToken.includes("Bold")) {
              newVarName = "--seed-font-weight-bold";
            }
            break;
          case "letter-spacing":
            // 새 디자인 시스템에서는 letter-spacing이 명시적으로 지정되지 않음
            transformResults.push({ from: match, to: "normal" });
            hasChanges = true;
            return "normal";
          default:
            logger.logTransformResult(filePath, {
              previousToken: match,
              nextToken: null,
              status: "warning",
              failureReason: `Unknown property: ${property}`,
            });
            return match;
        }

        const newVar = `var(${newVarName})`;
        transformResults.push({ from: match, to: newVar });
        hasChanges = true;
        return newVar;
      } catch (error) {
        logger.logTransformResult(filePath, {
          previousToken: match,
          nextToken: null,
          status: "failure",
          failureReason: `Error transforming token: ${error.message}`,
        });
        return match; // 오류 발생 시 원래 값 유지
      }
    },
  );

  return { newValue, hasChanges, transformResults };
}

/**
 * CSS 파일을 처리하는 함수
 */
function processCssFile(source: string, filePath: string): string {
  logger.startFile(filePath);

  try {
    let hasAnyChanges = false;

    // PostCSS로 CSS 처리
    const postcssPlugin: Plugin = {
      postcssPlugin: "replace-css-typography-variable",
      Declaration(decl) {
        // var(--seed-semantic-typography를 포함하는 선언만 처리
        if (decl.value.includes("var(--seed-semantic-typography")) {
          const originalValue = decl.value;
          const { newValue, hasChanges, transformResults } = transformCssVarValue(
            originalValue,
            filePath,
          );

          if (hasChanges) {
            decl.value = newValue;
            hasAnyChanges = true;

            // 각 변환 결과 로깅
            transformResults.forEach((result) => {
              logger.logTransformResult(filePath, {
                previousToken: result.from,
                nextToken: result.to,
                status: "success",
              });
            });
          }
        }
      },
    };

    const processor = postcss([postcssPlugin]);
    const result = processor
      .process(source, {
        from: filePath,
        parser: postcss.parse,
      })
      .sync();

    // toString()을 사용하여 변환된 CSS 문자열 얻기
    const transformedCss = result.root.toString();

    if (!hasAnyChanges) {
      logger.logTransformResult(filePath, {
        previousToken: "No CSS typography variables found to transform",
        nextToken: null,
        status: "warning",
      });
    }

    logger.finishFile(filePath);
    return transformedCss;
  } catch (error) {
    logger.logTransformResult(filePath, {
      previousToken: `Error processing CSS: ${error.message}`,
      nextToken: null,
      status: "failure",
      failureReason: error.message,
    });
    logger.finishFile(filePath);
    return source; // 에러 발생 시 원본 소스 반환
  }
}

const transform: Transform = (file, _api, _options) => {
  // CSS 파일이 아닌 경우 건너뛰기
  if (!file.path.endsWith(".css")) {
    return file.source;
  }

  return processCssFile(file.source, file.path);
};

export default transform;
