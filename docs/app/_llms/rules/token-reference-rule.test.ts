import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { tokenReferenceRule } from "./token-reference-rule";

describe("tokenReferenceRule", () => {
  it("converts TokenReference with groups to a markdown table", () => {
    const input = `<TokenReference groups={["radius"]} />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toContain("| Token |");
    expect(actual).toContain("| --- |");
    expect(actual).toContain("$radius.");
  });

  it("converts TokenReference without groups to all token tables with headings", () => {
    const input = "<TokenReference />";

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toContain("## ");
    expect(actual).toContain("| Token |");
    expect(actual).toContain("$radius.");
    expect(actual).toContain("$color.");
  });

  it("keeps the original node when group is unknown", () => {
    const input = `<TokenReference groups={["nonexistent"]} />`;

    const actual = normalizeLLMBodyWithRules(input, [tokenReferenceRule]);

    expect(actual).toContain("TokenReference");
  });
});
