import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { typeTableRule } from "./type-table-rule";

describe("typeTableRule", () => {
  it("converts TypeTable rows to readable markdown list", async () => {
    const input = readFixture("type-table", "basic.input.mdx");
    const expected = readFixture("type-table", "basic.output.mdx");

    const actual = await normalizeLLMBodyWithRules(input, [typeTableRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("keeps the original node when type attribute is missing", async () => {
    const input = readFixture("type-table", "malformed.input.mdx");
    const expected = readFixture("type-table", "malformed.output.mdx");

    const actual = await normalizeLLMBodyWithRules(input, [typeTableRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
