import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { lynxComponentExampleRule } from "./lynx-component-example-rule";

describe("lynxComponentExampleRule", () => {
  it("preview 예제에 제목을 추가하고 children을 펼친다", () => {
    const input = readFixture("lynx-component-example", "preview.input.mdx");
    const expected = readFixture("lynx-component-example", "preview.output.mdx");
    expect(normalizeForAssert(normalizeLLMBodyWithRules(input, [lynxComponentExampleRule]))).toBe(
      normalizeForAssert(expected),
    );
  });
});
