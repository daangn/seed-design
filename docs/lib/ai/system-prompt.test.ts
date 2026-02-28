import { describe, expect, it } from "bun:test";
import { buildSystemPrompt } from "./system-prompt";
import { createToolDescriptor } from "./tool-registry";

describe("buildSystemPrompt", () => {
  it("embeds runtime tool catalog and verified links", () => {
    const prompt = buildSystemPrompt({
      toolCatalog: [
        createToolDescriptor({
          name: "showInstallation",
          source: "client",
          description: "installation tool",
          capability: "install",
        }),
      ],
      verifiedLinks: [
        {
          title: "Action Button (React)",
          url: "https://seed-design.io/react/components/action-button",
        },
      ],
    });

    expect(prompt).toContain("## Runtime Tool Catalog");
    expect(prompt).toContain("showInstallation");
    expect(prompt).toContain("## Runtime Verified Links");
    expect(prompt).toContain("[Action Button (React)](https://seed-design.io/react/components/action-button)");
  });

  it("includes orchestration and component guide context when available", () => {
    const prompt = buildSystemPrompt({
      toolCatalog: [],
      orchestrationPlan: {
        reasoningMode: "tool-planned",
        toolSequence: ["showInstallation", "showComponentExample"],
        summary: "install then preview",
      },
      componentGuide: {
        componentId: "action-button",
        userQuery: "ActionButton 설치 방법 알려줘",
        focus: "installation",
      },
    });

    expect(prompt).toContain("## Runtime Orchestration Plan");
    expect(prompt).toContain("showInstallation");
    expect(prompt).toContain("## Runtime Mode: Component Guide");
    expect(prompt).toContain("Focus: installation");
  });
});
