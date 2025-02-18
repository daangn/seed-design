import type { Transform } from "jscodeshift";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, test } from "vitest";
import type { z } from "zod";
import type { transformOptionsSchema } from "../schema.js";

export function runFixtureTests(
  transform: Transform,
  fixturesDir: string,
  transformOptions: z.infer<typeof transformOptionsSchema> = {
    reporter: true,
  },
) {
  const inputFiles = readdirSync(fixturesDir)
    .filter((filename) => filename.endsWith(".input.tsx"))
    .map((filename) => basename(filename, ".input.tsx"));

  describe(`Transform tests in ${fixturesDir}`, () => {
    inputFiles.forEach((testCase) => {
      test(`transforms ${testCase} correctly`, () => {
        const inputPath = join(fixturesDir, `${testCase}.input.tsx`);
        const outputPath = join(fixturesDir, `${testCase}.output.tsx`);

        const input = readFileSync(inputPath, "utf8");
        const output = readFileSync(outputPath, "utf8").trim();

        const result = applyTransform(
          transform,
          transformOptions,
          { source: input },
          { parser: "tsx" },
        );
        expect(result.trim()).toEqual(output);
      });
    });
  });
}
