import { describe, expect, it } from "bun:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeLLMBody } from "./normalize-llm-body";
import { normalizeForAssert, readFixture } from "./test-utils";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
process.env.ICON_LIBRARY_DATA_DIR = path.join(
  currentDir,
  "__fixtures__",
  "icon-library",
  "data",
);

describe("normalizeLLMBody pipeline", () => {
  it("applies ComponentExample and CodeBlockTabs rules together", () => {
    const input = readFixture("pipeline", "combined.input.mdx");
    const expected = readFixture("pipeline", "combined.output.mdx");

    const actual = normalizeLLMBody(input);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("applies IconLibrary rule in pipeline", () => {
    const input = readFixture("pipeline", "icon-library.input.mdx");
    const expected = readFixture("pipeline", "icon-library.output.mdx");

    const actual = normalizeLLMBody(input);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
