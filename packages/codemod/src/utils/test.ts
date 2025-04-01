import type { Transform } from "jscodeshift";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join, dirname } from "node:path";
import { describe, expect, test } from "vitest";
import type { z } from "zod";
import type { transformOptionsSchema } from "../schema.js";

interface RunFixtureTestsOptions {
  transform: Transform;
  fixturesDir: string;
  extension?: string;
  transformOptions?: z.infer<typeof transformOptionsSchema>;
  name?: string;
}

// 실제 구현체
export function runFixtureTests({
  transform,
  fixturesDir,
  extension = "tsx",
  transformOptions,
  name,
}: RunFixtureTestsOptions): void {
  // transform 폴더명을 fixturesDir에서 추론
  const transformName = name || basename(dirname(fixturesDir));

  const inputFiles = readdirSync(fixturesDir)
    .filter((filename) => filename.endsWith(`.input.${extension}`))
    .map((filename) => basename(filename, `.input.${extension}`));

  describe(`${transformName} transform tests`, () => {
    inputFiles.forEach((testCase) => {
      test(`transforms ${testCase} correctly`, () => {
        const inputPath = join(fixturesDir, `${testCase}.input.${extension}`);
        const outputPath = join(fixturesDir, `${testCase}.output.${extension}`);

        const input = readFileSync(inputPath, "utf8");
        const output = readFileSync(outputPath, "utf8").trim();

        let result: string;
        if (extension === "css") {
          // CSS 파일인 경우 직접 transform 함수 호출
          result = transform({ path: inputPath, source: input }, null, transformOptions) as string;
        } else {
          // JS/TS 파일인 경우 jscodeshift의 applyTransform 사용
          result = applyTransform(
            transform,
            transformOptions,
            { source: input },
            { parser: "tsx" },
          );
        }

        expect(result?.trim()).toEqual(output);
      });
    });
  });
}
