import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { iconLibraryRule } from "./icon-library-rule";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
process.env.ICON_LIBRARY_DATA_DIR = path.join(
  currentDir,
  "..",
  "__fixtures__",
  "icon-library",
  "data",
);

describe("iconLibraryRule", () => {
  it("converts IconLibrary into icon tables", () => {
    const input = readFixture("icon-library", "basic.input.mdx");
    const expected = readFixture("icon-library", "basic.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [iconLibraryRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
