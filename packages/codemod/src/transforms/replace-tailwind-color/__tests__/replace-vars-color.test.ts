import { applyTransform } from "jscodeshift/src/testUtils.js";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, test } from "vitest";
import transform from "../index.js";

describe("replace-tailwind-color", () => {
  const fixturesDir = join(__dirname, "..", "__testfixtures__");
  const inputFiles = readdirSync(fixturesDir)
    .filter((filename) => filename.endsWith(".input.tsx"))
    .map((filename) => basename(filename, ".input.tsx"));

  inputFiles.forEach((testCase) => {
    test(`transforms ${testCase} correctly`, () => {
      const inputPath = join(fixturesDir, `${testCase}.input.tsx`);
      const outputPath = join(fixturesDir, `${testCase}.output.tsx`);

      const input = readFileSync(inputPath, "utf8");
      const output = readFileSync(outputPath, "utf8").trim();

      const transformResult = applyTransform(transform, {}, { source: input }, { parser: "tsx" });
      expect(transformResult.trim()).toEqual(output.trim());
    });
  });
});
