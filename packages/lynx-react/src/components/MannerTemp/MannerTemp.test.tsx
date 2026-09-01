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
});
