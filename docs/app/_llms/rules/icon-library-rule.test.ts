import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { iconLibraryRule } from "./icon-library-rule";

describe("iconLibraryRule", () => {
  it("converts IconLibrary into icon tables", () => {
    const input = "<IconLibrary />\n";

    const actual = normalizeLLMBodyWithRules(input, [iconLibraryRule]);

    expect(actual).toContain("## Monochrome Icons");
    expect(actual).toContain("## Multicolor Icons");
    expect(actual).toContain("| Icon Name | Figma Name | Keywords | Services | Tags |");
  });
});
