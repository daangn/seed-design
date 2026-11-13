import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { codeBlockTabsRule } from "./codeblock-tabs-rule";

describe("codeBlockTabsRule", () => {
  it("converts known package managers to sorted markdown list", () => {
    const input = readFixture("codeblock-tabs", "basic.input.mdx");
    const expected = readFixture("codeblock-tabs", "basic.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [codeBlockTabsRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("sorts known managers first and appends unknown managers", () => {
    const input = readFixture("codeblock-tabs", "partial.input.mdx");
    const expected = readFixture("codeblock-tabs", "partial.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [codeBlockTabsRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("keeps the original node when tabs are malformed", () => {
    const input = readFixture("codeblock-tabs", "malformed.input.mdx");
    const expected = readFixture("codeblock-tabs", "malformed.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [codeBlockTabsRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
