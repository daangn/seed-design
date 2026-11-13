import { describe, expect, it } from "bun:test";
import { normalizeLLMBody } from "./normalize-llm-body";
import { normalizeForAssert, readFixture } from "./test-utils";

describe("normalizeLLMBody pipeline", () => {
  it("applies ComponentExample and CodeBlockTabs rules together", () => {
    const input = readFixture("pipeline", "combined.input.mdx");
    const expected = readFixture("pipeline", "combined.output.mdx");

    const actual = normalizeLLMBody(input);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
