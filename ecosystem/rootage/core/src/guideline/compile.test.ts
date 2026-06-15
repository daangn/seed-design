import { describe, expect, it } from "bun:test";
import { compileGuidelineSpec, safeParseGuidelineSpec } from "./compile";
import { generateGuidelineId } from "./id";
import type { GuidelineSpec } from "./types";

describe("generateGuidelineId", () => {
  it("formats id with scope prefix and 3-digit zero-padded sequence", () => {
    expect(generateGuidelineId("component", "action-button", 0)).toBe("G-C-action-button-001");
    expect(generateGuidelineId("foundation", "elevation", 9)).toBe("G-F-elevation-010");
    expect(generateGuidelineId("pattern", "empty-state", 99)).toBe("G-P-empty-state-100");
  });
});

describe("compileGuidelineSpec", () => {
  const spec: GuidelineSpec = {
    kind: "GuidelineSpec",
    metadata: { target: "action-button", scope: "component" },
    guidelines: [
      { type: "do", statement: "First", detectable: true },
      { type: "dont", statement: "Second" },
      { type: "do", statement: "Deprecated", deprecated: true, reason: "Replaced" },
      { type: "do", statement: "Fourth" },
    ],
  };

  it("assigns sequential ids, keeping the slot of deprecated items", () => {
    const compiled = compileGuidelineSpec(spec);
    expect(compiled.guidelines.map((g) => g.id)).toEqual([
      "G-C-action-button-001",
      "G-C-action-button-002",
      "G-C-action-button-003",
      "G-C-action-button-004",
    ]);
  });

  it("preserves authored fields alongside the generated id", () => {
    const compiled = compileGuidelineSpec(spec);
    expect(compiled.guidelines[2]).toMatchObject({
      id: "G-C-action-button-003",
      type: "do",
      deprecated: true,
      reason: "Replaced",
    });
  });
});

describe("safeParseGuidelineSpec", () => {
  it("accepts a valid spec", () => {
    const result = safeParseGuidelineSpec({
      kind: "GuidelineSpec",
      metadata: { target: "action-button", scope: "component" },
      guidelines: [{ type: "do", statement: "Use a single primary action." }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown scope", () => {
    const result = safeParseGuidelineSpec({
      kind: "GuidelineSpec",
      metadata: { target: "action-button", scope: "widget" },
      guidelines: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown guideline type", () => {
    const result = safeParseGuidelineSpec({
      kind: "GuidelineSpec",
      metadata: { target: "x", scope: "foundation" },
      guidelines: [{ type: "maybe", statement: "x" }],
    });
    expect(result.success).toBe(false);
  });
});
