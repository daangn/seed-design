import type { Transform } from "jscodeshift";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, test } from "vitest";
import type { z } from "zod";
import type { transformOptionsSchema } from "../schema.js";

export function runFixtureTests(
  name: string,
  transform: Transform,
  fixturesDir: string,
  extension = "tsx",
  transformOptions: z.infer<typeof transformOptionsSchema> = {
    log: true,
  },
) {
  const inputFiles = readdirSync(fixturesDir)
    .filter((filename) => filename.endsWith(`.input.${extension}`))
    .map((filename) => basename(filename, `.input.${extension}`));

  describe(`${name} transform tests`, () => {
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
