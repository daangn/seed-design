import type { Transform } from "jscodeshift";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join, dirname } from "node:path";
import { describe, expect, test } from "bun:test";
import type { z } from "zod";
import type { transformOptionsSchema } from "../schema.js";

interface RunFixtureTestsOptions {
  transform: Transform;
  fixturesDir: string;
  extension?: string[];
  transformOptions?: z.infer<typeof transformOptionsSchema>;
  name?: string;
}

// 실제 구현체
export function runFixtureTests({
  transform,
  fixturesDir,
  extension = ["tsx", "ts"],
  transformOptions,
  name,
}: RunFixtureTestsOptions): void {
  // transform 폴더명을 fixturesDir에서 추론
  const transformName = name || basename(dirname(fixturesDir));

  // 배열로 확장자 정규화
  const extensions = Array.isArray(extension) ? extension : [extension];

  // 모든 확장자에 대해 입력 파일 찾기
  const inputFiles = extensions.flatMap((ext) => {
    return readdirSync(fixturesDir)
      .filter((filename) => filename.endsWith(`.input.${ext}`))
      .map((filename) => ({
        testCase: basename(filename, `.input.${ext}`),
        extension: ext,
      }));
  });

  describe(`${transformName} transform tests`, () => {
    inputFiles.forEach(({ testCase, extension: ext }) => {
      test(`${testCase} (${ext})`, () => {
        const inputPath = join(fixturesDir, `${testCase}.input.${ext}`);
        const outputPath = join(fixturesDir, `${testCase}.output.${ext}`);

        const input = readFileSync(inputPath, "utf8");
        const output = readFileSync(outputPath, "utf8").trim();

        let result: string;
        if (ext === "css") {
          // CSS 파일인 경우 직접 transform 함수 호출
          result = transform({ path: inputPath, source: input }, null, transformOptions) as string;
        } else {
          // JS/TS 파일인 경우 jscodeshift의 applyTransform 사용
          result = applyTransform(
            transform,
            transformOptions,
            { source: input },
            { parser: ext.includes("tsx") ? "tsx" : "ts" }, // tsx 또는 ts 파서 선택
          );
        }

        expect(result?.trim()).toEqual(output);
      });
    });
  });
}
