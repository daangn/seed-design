import { describe, expect, it } from "bun:test";
import { orderAssistantToolSections, type AssistantToolItem } from "./assistant-tool-sections";

function createTool(toolName: string, key: string, input: Record<string, unknown> = {}): AssistantToolItem {
  return {
    key,
    toolName,
    input,
    state: "output-available",
  };
}

describe("orderAssistantToolSections", () => {
  it("keeps fixed section groups regardless of incoming order", () => {
    const ordered = orderAssistantToolSections([
      createTool("showInstallation", "1", { component: "alert-dialog" }),
      createTool("showCodeBlock", "2", { title: "basic usage" }),
      createTool("showComponentExample", "3", { component: "alert-dialog" }),
    ]);

    expect(ordered.examples.map((item) => item.toolName)).toEqual([
      "showCodeBlock",
      "showComponentExample",
    ]);
    expect(ordered.installations.map((item) => item.toolName)).toEqual(["showInstallation"]);
    expect(ordered.others).toHaveLength(0);
  });

  it("dedupes duplicate tools for same section key", () => {
    const ordered = orderAssistantToolSections([
      createTool("showInstallation", "1", { component: "alert-dialog" }),
      createTool("showInstallation", "2", { component: "alert-dialog" }),
      createTool("showComponentExample", "3", { name: "react/alert-dialog/preview" }),
      createTool("showComponentExample", "4", { name: "react/alert-dialog/preview" }),
    ]);

    expect(ordered.installations).toHaveLength(1);
    expect(ordered.examples).toHaveLength(1);
  });

  it("does not throw when tool input is undefined", () => {
    const ordered = orderAssistantToolSections([
      {
        key: "no-input-install",
        toolName: "showInstallation",
        input: undefined as unknown as Record<string, unknown>,
        state: "input-available",
      },
      {
        key: "no-input-example",
        toolName: "showComponentExample",
        input: undefined as unknown as Record<string, unknown>,
        state: "input-available",
      },
    ]);

    expect(ordered.installations).toHaveLength(1);
    expect(ordered.examples).toHaveLength(1);
  });
});
