import type { Transform } from "jscodeshift";
import postcss, { type Plugin } from "postcss";
import { TokenMigrationReporter } from "../../utils/reporter.js";
import { glob } from "glob";
import { colorMappings } from "@seed-design/migration-index";
import { writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function transformCssVarValue(value: string): string {
  // CSS 변수 패턴을 찾아서 각각 변환
  return value.replace(
    /var\(--seed-(semantic|scale|static)-color-([^)]+)\)/g,
    (match, tokenType, tokenName) => {
      try {
        // 이전 토큰 형식으로 변환
        const previousToken = `$${tokenType}.color.${tokenName}`;

        // 매핑 찾기
        const mapping = colorMappings.find((m) => m.previous === previousToken);
        if (!mapping || !mapping.next || mapping.next.length === 0) return match;

        // 새로운 토큰 선택 (첫 번째 매핑 사용)
        const nextToken = mapping.next[0];

        // CSS 변수 형식으로 변환
        return `var(--seed-${nextToken.substring(1).replace(/\./g, "-")})`;
      } catch (error) {
        console.error(`Error transforming token: ${match}`, error);
        return match; // 오류 발생 시 원래 값 유지
      }
    },
  );
}

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
      const newValue = transformCssVarValue(originalValue);

      if (originalValue !== newValue) {
        decl.value = newValue;
      }
    }
  },
};

const transform: Transform = (file, _, options) => {
  const { reporter } = options;
  let reporter_instance = null;

  if (reporter) {
    reporter_instance = new TokenMigrationReporter("replace-css-color-variable");
    reporter_instance.startNewFile(file.path);
  }

  // CSS 파일이 아닌 경우 건너뛰기
  if (!file.path.endsWith(".css")) {
    return file.source;
  }

  console.log("file.path", file.path);

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

    if (reporter_instance) {
      console.log("writeReport");
      reporter_instance.finishFile();
      reporter_instance.writeReport();
    }

    return transformedCss;
  } catch (error) {
    console.error("Error processing CSS:", error);
    return file.source; // 에러 발생 시 원본 소스 반환
  }
};

export function processCssFiles(paths: string[], options: any) {
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
      const transformedCss = transform({ path: filePath, source }, null, options);

      if (source !== transformedCss) {
        writeFileSync(filePath, transformedCss as string, "utf8");
        console.log(`변환 완료: ${filePath}`);
        totalChanged++;
      }
    } catch (error) {
      console.error(`파일 변환 중 오류 발생: ${filePath}`, error);
    }
  }

  console.log(`CSS 변환 완료: 총 ${totalChanged}개 파일 변경됨`);
}

export default transform;
