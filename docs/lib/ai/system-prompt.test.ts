import { describe, expect, it } from "bun:test";
import { buildSystemPrompt } from "./system-prompt";

describe("buildSystemPrompt", () => {
  it("embeds verified links in component guide mode", () => {
    const prompt = buildSystemPrompt({
      verifiedLinks: [
        {
          title: "Action Button (Docs)",
          url: "https://seed-design.io/docs/components/action-button",
        },
        {
          title: "Action Button (React)",
          url: "https://seed-design.io/react/components/action-button",
        },
      ],
      componentGuide: {
        componentId: "action-button",
        userQuery: "ActionButton 사용법 알려줘",
      },
    });

    expect(prompt).toContain("## Runtime Verified Links");
    expect(prompt).toContain("Verified links for this component:");
    expect(prompt).toContain("[Action Button (Docs)](https://seed-design.io/docs/components/action-button)");
    expect(prompt).toContain("[Action Button (React)](https://seed-design.io/react/components/action-button)");
  });

  it("marks empty verified links when none are provided", () => {
    const prompt = buildSystemPrompt({
      verifiedLinks: [],
      componentGuide: {
        componentId: "action-button",
        userQuery: "ActionButton 사용법 알려줘",
      },
    });

    expect(prompt).toContain("Verified links for this component:");
    expect(prompt).toContain("- (none)");
    expect(prompt).toContain("If no verified links are listed, skip the final link bullets.");
  });

  it("includes runtime verified links section in non-component mode", () => {
    const prompt = buildSystemPrompt({
      verifiedLinks: [
        {
          title: "Action Button",
          url: "https://seed-design.io/react/components/action-button",
        },
      ],
      componentGuide: null,
    });

    expect(prompt).toContain("## Runtime Verified Links");
    expect(prompt).toContain("[Action Button](https://seed-design.io/react/components/action-button)");
  });
});
