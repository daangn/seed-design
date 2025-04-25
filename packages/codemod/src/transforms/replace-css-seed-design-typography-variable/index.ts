import type { Transform } from "jscodeshift";
import postcss, { type Plugin } from "postcss";
import { typographyMappings } from "@seed-design/migration-index/typography";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { glob } from "glob";
import { createTransformLogger } from "../../utils/logger.js";

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
function transformCssVarValue(value: string): string {
  // CSS 변수 패턴을 찾아서 각각 변환
  return value.replace(
    /var\(--seed-semantic-typography-([^-]+)-([^-]+)-([^)]+)\)/g,
    (match, style, weight, property) => {
      try {
        // 이전 토큰 형식으로 변환
        const previousToken = `$semantic.typography.${style}${weight.charAt(0).toUpperCase() + weight.slice(1)}`;

        // 매핑 찾기
        const newToken = transformTypographyToken(previousToken);
        if (!newToken) return match;

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
            return "normal";
          default:
            return match;
        }

        return `var(${newVarName})`;
      } catch (error) {
        console.error(`Error transforming token: ${match}`, error);
        return match; // 오류 발생 시 원래 값 유지
      }
    },
  );
}

const postcssPlugin: Plugin = {
  postcssPlugin: "replace-css-typography-variable",
  Declaration(decl) {
    // var(--seed-semantic-typography를 포함하는 선언만 처리
    if (decl.value.includes("var(--seed-semantic-typography")) {
      const originalValue = decl.value;
      const newValue = transformCssVarValue(originalValue);

      if (originalValue !== newValue) {
        decl.value = newValue;
      }
    }
  },
};

const transform: Transform = (file, _api, _options) => {
  const logger = createTransformLogger("replace-css-seed-design-typography-variable");

  // CSS 파일이 아닌 경우 건너뛰기
  if (!file.path.endsWith(".css")) {
    return file.source;
  }

  logger.startFile(file.path);

  try {
    // PostCSS로 CSS 처리
    const processor = postcss([postcssPlugin]);

    const fileSource = file.source as unknown as Record<string, any>;
    const result = processor
      .process(fileSource, {
        from: file.path,
        parser: postcss.parse,
      })
      .sync();

    // toString()을 사용하여 변환된 CSS 문자열 얻기
    const transformedCss = result.root.toString();

    logger.finishFile(file.path);

    return transformedCss;
  } catch (error) {
    console.error("Error processing CSS:", error);
    return file.source; // 에러 발생 시 원본 소스 반환
  }
};

/**
 * 여러 CSS 파일을 처리하는 함수
 * @param paths 처리할 파일 경로 배열
 * @param options 옵션
 */
export function processCssFiles(paths: string[], _options: any) {
  const logger = createTransformLogger("replace-css-seed-design-typography-variable");

  let cssFilePaths: string[] = [];

  // 각 경로에 대해 glob 패턴으로 CSS 파일 찾기
  for (const path of paths) {
    try {
      // 경로가 CSS 파일인지 확인
      if (path.endsWith(".css")) {
        cssFilePaths.push(resolve(path));
        continue;
      }

      // glob 패턴으로 CSS 파일 찾기
      const files = glob.sync(`${path}/**/*.css`, {
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      });

      cssFilePaths = [...cssFilePaths, ...files];
    } catch (error) {
      console.error(`경로 처리 중 오류 발생: ${path}`, error);
    }
  }

  // 중복 제거
  const uniqueCssFiles = [...new Set(cssFilePaths)];

  if (uniqueCssFiles.length === 0) {
    console.log("변환할 CSS 파일을 찾을 수 없습니다.");
    return;
  }

  console.log(`총 ${uniqueCssFiles.length}개의 CSS 파일을 찾았습니다.`);

  // 각 CSS 파일 처리
  let totalChanged = 0;

  for (const filePath of uniqueCssFiles) {
    try {
      const source = readFileSync(filePath, "utf8");
      const transformedCss = transform({ path: filePath, source }, null, {});

      if (source !== transformedCss) {
        writeFileSync(filePath, transformedCss as string, "utf8");
        logger.logTransformResult(filePath, {
          previousToken: filePath,
          nextToken: "transformed",
          status: "success",
        });
        totalChanged++;
      }
    } catch (error) {
      console.error(`파일 변환 중 오류 발생: ${filePath}`, error);
      logger.logTransformResult(filePath, {
        previousToken: filePath,
        nextToken: null,
        status: "failure",
        failureReason: error.message,
      });
    }
  }

  console.log(`CSS 변환 완료: 총 ${totalChanged}개 파일 변경됨`);
}

export default transform;
