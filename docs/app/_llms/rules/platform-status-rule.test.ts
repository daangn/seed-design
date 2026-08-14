import { describe, expect, it } from "bun:test";
import type { ComponentData } from "../../../sanity-studio/lib/types";
import { generateMarkdownTable } from "./platform-status-rule";

const base: ComponentData = {
  id: "button",
  name: "Button",
  figmaStatus: "ready",
  reactStatus: "in-progress",
  iosStatus: "not-ready",
  androidStatus: "not-planned",
};

describe("generateMarkdownTable", () => {
  it("renders one row per platform with its status label, dropping the Note column", () => {
    expect(generateMarkdownTable(base)).toBe(
      [
        "| Platform | Status |",
        "| --- | --- |",
        "| Figma | Done |",
        "| React | In Progress |",
        "| iOS | Not Ready |",
        "| Android | Not Planned |",
      ].join("\n"),
    );
  });

  it("links the platform when a url is set and keeps the Note column once any platform has a note", () => {
    const component: ComponentData = {
      ...base,
      figmaStatus: "deprecated",
      figmaNote: "Use NewTab",
      reactStatus: "ready",
      reactUrl: "https://example.com/tab",
      reactNote: "see migration",
    };

    expect(generateMarkdownTable(component)).toBe(
      [
        "| Platform | Status | Note |",
        "| --- | --- | --- |",
        "| Figma | Deprecated | Use NewTab |",
        "| [React](https://example.com/tab) | Done | see migration |",
        "| iOS | Not Ready |  |",
        "| Android | Not Planned |  |",
      ].join("\n"),
    );
  });

  it("escapes pipes and flattens newlines so a note cannot break the table", () => {
    expect(generateMarkdownTable({ ...base, figmaNote: "a | b\nc" })).toContain(
      "| Figma | Done | a \\| b c |",
    );
  });
});
