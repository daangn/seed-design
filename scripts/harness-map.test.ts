import { describe, expect, test } from "bun:test";
import { readLearning, verifyPromotions } from "./harness-map";

const source = (status: string, extra = "") => `---
id: fixture
description: Apply to source edits only.
scope: ["packages/example/**"]
status: ${status}
${extra}---
Body
`;

describe("learning promotion metadata", () => {
  test("keeps scope and status without treating active as promoted", () => {
    expect(readLearning("fixture.md", source("active"))).toEqual({
      id: "fixture",
      description: "Apply to source edits only.",
      scope: ["packages/example/**"],
      status: "active",
      promotedTo: [],
      path: "fixture.md",
    });
  });

  test("rejects ambiguous status and promotion without a target", () => {
    expect(() => readLearning("fixture.md", source("passing"))).toThrow();
    expect(() => readLearning("fixture.md", source("promoted"))).toThrow();
    expect(() => readLearning("fixture.md", source("active", "scope: wrong\n"))).toThrow();
  });

  test("requires a real promotion target", () => {
    const learning = readLearning(
      "fixture.md",
      source("promoted", 'promoted_to: ["packages/example/AGENTS.md"]\n'),
    );
    expect(() => verifyPromotions([learning], new Set())).toThrow();
    expect(() =>
      verifyPromotions([learning], new Set(["packages/example/AGENTS.md"])),
    ).not.toThrow();
  });

  test("rejects duplicate identities", () => {
    const learning = readLearning("fixture.md", source("active"));
    expect(() => verifyPromotions([learning, learning], new Set())).toThrow();
  });

  test("preserves quoted descriptions containing YAML delimiters", () => {
    const input = source("active").replace(
      "description: Apply to source edits only.",
      'description: "Check display: none and keep the scope."',
    );
    expect(readLearning("fixture.md", input).description).toBe(
      "Check display: none and keep the scope.",
    );
  });
});
