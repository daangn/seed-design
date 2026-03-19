import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { platformStatusRule } from "./platform-status-rule";

describe("platformStatusRule", () => {
  it("keeps the original node when componentId is missing", () => {
    const input = "<PlatformStatusTable />";

    const actual = normalizeLLMBodyWithRules(input, [platformStatusRule]);

    expect(actual).toContain("PlatformStatusTable");
  });

  it("keeps the original node when component is not found", () => {
    const input = `<PlatformStatusTable componentId="nonexistent-component" />`;

    const actual = normalizeLLMBodyWithRules(input, [platformStatusRule]);

    expect(actual).toContain("PlatformStatusTable");
  });
});
