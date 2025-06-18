import { colorMappings } from "@seed-design/migration-index";
import type { Transform } from "jscodeshift";
import postcss, { type Plugin } from "postcss";
import { createTransformLogger } from "../../utils/logger.js";

// transform 최상단에 logger 정의
const logger = createTransformLogger("replace-css-seed-design-color-variable");

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
    /var\(--seed-(semantic|scale|static)-color-([^)]+)\)/g,
    (match, tokenType, tokenName) => {
      try {
        // 이전 토큰 형식으로 변환
        const previousToken = `$${tokenType}.color.${tokenName}`;

        // 매핑 찾기
        const mapping = colorMappings.find((m) => m.previous === previousToken);
        if (!mapping || !mapping.next || mapping.next.length === 0) {
          logger.logTransformResult(filePath, {
            previousToken: match,
            nextToken: null,
            status: "warning",
            failureReason: `No mapping found for ${previousToken}`,
          });
          return match;
        }

        // 새로운 토큰 선택 (첫 번째 매핑 사용)
        const nextToken = mapping.next[0];

        // CSS 변수 형식으로 변환
        const newVar = `var(--seed-${nextToken.substring(1).replace(/\./g, "-")})`;
        hasChanges = true;
        transformResults.push({ from: match, to: newVar });

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
      postcssPlugin: "replace-css-color-variable",
      Declaration(decl) {
        // var(--seed-semantic-color 또는 var(--seed-scale-color를 포함하는 선언만 처리
        if (
          decl.value.includes("var(--seed-semantic-color") ||
          decl.value.includes("var(--seed-scale-color") ||
          decl.value.includes("var(--seed-static-color")
        ) {
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
        previousToken: "No CSS color variables found to transform",
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
