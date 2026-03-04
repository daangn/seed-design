import { beforeAll, describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { platformStatusRule } from "./platform-status-rule";

describe("platformStatusRule", () => {
  describe("with Sanity data", () => {
    beforeAll(async () => {
      await platformStatusRule.init?.();
    });

    it("converts PlatformStatusTable to a markdown table", () => {
      const input = `<PlatformStatusTable componentId="action-button" />`;

      const actual = normalizeLLMBodyWithRules(input, [platformStatusRule]);

      expect(actual).toContain("| Platform |");
      expect(actual).toContain("| --- |");
      expect(actual).toContain("Figma");
      expect(actual).toContain("React");
      expect(actual).toContain("iOS");
      expect(actual).toContain("Android");
    });

    it("includes status labels in the table", () => {
      const input = `<PlatformStatusTable componentId="action-button" />`;

      const actual = normalizeLLMBodyWithRules(input, [platformStatusRule]);

      const validStatuses = ["Done", "In Progress", "Not Ready", "Deprecated", "Not Planned"];
      expect(validStatuses.some((s) => actual.includes(s))).toBe(true);
    });
  });

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
