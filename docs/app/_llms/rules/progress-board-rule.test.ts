import { afterEach, describe, expect, it } from "bun:test";
import type { ComponentData } from "../../../sanity-studio/lib/types";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { normalizeForAssert, readFixture } from "../test-utils";
import { __setComponentsCacheForTests, progressBoardRule } from "./progress-board-rule";

const mockComponents: ComponentData[] = [
  {
    id: "button",
    name: "Button",
    figmaStatus: "ready",
    reactStatus: "ready",
    iosStatus: "ready",
    androidStatus: "ready",
  },
  {
    id: "card",
    name: "Card",
    figmaStatus: "ready",
    figmaUrl: "https://figma.com/card",
    reactStatus: "in-progress",
    iosStatus: "not-ready",
    androidStatus: "not-planned",
  },
  {
    id: "tab",
    name: "Tab",
    figmaStatus: "deprecated",
    figmaNote: "Use NewTab",
    reactStatus: "ready",
    reactUrl: "https://example.com/tab",
    reactNote: "see migration",
    iosStatus: "not-planned",
    androidStatus: "not-planned",
  },
];

const edgeCaseComponents: ComponentData[] = [
  {
    id: "all-not-planned",
    name: "AllNotPlanned",
    figmaStatus: "not-planned",
    reactStatus: "not-planned",
    iosStatus: "not-planned",
    androidStatus: "not-planned",
  },
];

afterEach(() => {
  __setComponentsCacheForTests(null);
});

describe("progressBoardRule", () => {
  it("keeps the original node when cache is empty", () => {
    const input = "<ProgressBoardTable />";

    const actual = normalizeLLMBodyWithRules(input, [progressBoardRule]);

    expect(actual).toContain("ProgressBoardTable");
  });

  it("renders summary and component tables for typical data", () => {
    __setComponentsCacheForTests(mockComponents);
    const input = readFixture("progress-board", "basic.input.mdx");
    const expected = readFixture("progress-board", "basic.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [progressBoardRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });

  it("renders 0/0 progress when every component is not-planned", () => {
    __setComponentsCacheForTests(edgeCaseComponents);
    const input = readFixture("progress-board", "edge-cases.input.mdx");
    const expected = readFixture("progress-board", "edge-cases.output.mdx");

    const actual = normalizeLLMBodyWithRules(input, [progressBoardRule]);

    expect(normalizeForAssert(actual)).toBe(normalizeForAssert(expected));
  });
});
