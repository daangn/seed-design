import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, test, expect } from "vitest";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import transformer from "../index.js";

describe("replace-custom-seed-design-color", () => {
  // 기본 테스트
  test("basic transform", () => {
    const fixtureDir = join(__dirname, "..", "__testfixtures__");
    const inputPath = join(fixtureDir, "basic.input.ts");
    const inputContent = readFileSync(inputPath, "utf8");
    const expected = readFileSync(join(fixtureDir, "basic.output.ts"), "utf8").trim();

    // 변환 실행
    const actual = applyTransform(
      transformer,
      {},
      { source: inputContent, path: inputPath },
      { parser: "ts" },
    ).trim();

    // 결과 비교
    expect(actual).toBe(expected);
  });

  // 좀 더 복잡한 경우 테스트
  test("advanced transform", () => {
    const fixtureDir = join(__dirname, "..", "__testfixtures__");
    const inputPath = join(fixtureDir, "advanced.input.ts");
    const inputContent = readFileSync(inputPath, "utf8");
    const expected = readFileSync(join(fixtureDir, "advanced.output.ts"), "utf8").trim();

    // 변환 실행
    const actual = applyTransform(
      transformer,
      {},
      { source: inputContent, path: inputPath },
      { parser: "ts" },
    ).trim();

    // 결과 비교
    expect(actual).toBe(expected);
  });
});
