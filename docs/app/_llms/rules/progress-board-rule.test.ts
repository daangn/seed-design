import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { progressBoardRule } from "./progress-board-rule";

describe("progressBoardRule", () => {
  it("keeps the original node when component cache is empty", () => {
    const input = "<ProgressBoardTable />";

    const actual = normalizeLLMBodyWithRules(input, [progressBoardRule]);

    expect(actual).toContain("ProgressBoardTable");
  });
});
