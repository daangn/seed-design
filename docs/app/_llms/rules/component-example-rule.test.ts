import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { componentExampleRule } from "./component-example-rule";

describe("componentExampleRule", () => {
  it("adds preview heading when name ends with /preview", () => {
    const input = readFixture("component-example", "component-example.input.mdx");
    const expected = readFixture("component-example", "component-example.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [componentExampleRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("unwraps non-preview examples without adding a heading", () => {
    const input = readFixture("component-example", "non-preview.input.mdx");
    const expected = readFixture("component-example", "non-preview.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [componentExampleRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
