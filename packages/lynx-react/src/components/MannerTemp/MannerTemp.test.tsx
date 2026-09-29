import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { MannerTemp, MannerTempEmote } from "./MannerTemp";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("MannerTemp", () => {
  it("renders the label and emote with the selected level", () => {
    render(
      <MannerTemp className="custom-manner-temp" level="l6">
        40°C
        <MannerTempEmote />
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const { getByText } = getQueriesForElement(root);
    const mannerTempRoot = root.querySelector(".seed-manner-temp__root");
    const label = getByText("40°C");
    const emote = root.querySelector(".seed-manner-temp__emote");

    expect(mannerTempRoot).toHaveClass("custom-manner-temp");
    expect(mannerTempRoot).toHaveClass("seed-manner-temp__root--level_l6");
    expect(label).toHaveClass("seed-manner-temp__label");
    expect(label).toHaveClass("seed-manner-temp__label--level_l6");
    expect(emote).toHaveAttribute(
      "src",
      expect.stringContaining("bf8f9b4d-c72e-4bf2-a094-460d3ad1b11f"),
    );
  });

  it("renders the label before the emote and lets the emote override the root level", () => {
    render(
      <MannerTemp level="l3">
        <MannerTempEmote level="l9" />
        36.5°C
      </MannerTemp>,
    );

    const root = getRenderedRoot();
    const mannerTempRoot = root.querySelector(".seed-manner-temp__root");
    const label = mannerTempRoot?.querySelector("text");
    const emote = mannerTempRoot?.querySelector("image");

    expect(label?.textContent).toBe("36.5°C");
    expect(label?.querySelector("image")).toBeNull();
    expect(label?.compareDocumentPosition(emote as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(emote).toHaveClass("seed-manner-temp__emote--level_l9");
    expect(emote).toHaveAttribute(
      "src",
      expect.stringContaining("61f6c297-11da-4d72-ba90-20cd69c09c22"),
    );
    expect(emote).toHaveAttribute("accessibility-elements-hidden", "true");
  });
});
