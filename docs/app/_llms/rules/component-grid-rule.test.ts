import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { componentGridRule } from "./component-grid-rule";

describe("componentGridRule", () => {
  it("expands ComponentGrid into a categorized component list", () => {
    const input = "<ComponentGrid />\n";

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    expect(actual).toContain("## Buttons");
    expect(actual).toContain("## Controls");
    expect(actual).toContain("[Checkbox](/docs/components/checkbox)");
  });

  it("excludes deprecated components", () => {
    const input = "<ComponentGrid />\n";

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    expect(actual).not.toContain("/docs/components/fab");
  });

  it("leaves the node as-is when no components are available", () => {
    const input = "<SomethingElse />\n";

    const actual = normalizeLLMBodyWithRules(input, [componentGridRule]);

    expect(actual).toContain("<SomethingElse />");
  });
});
