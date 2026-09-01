import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { MannerTempBadge } from "./MannerTempBadge";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("MannerTempBadge", () => {
  it("renders the label with the selected level and preserves className", () => {
    render(
      <MannerTempBadge className="custom-manner-temp-badge" level="l10">
        80°C
      </MannerTempBadge>,
    );

    const root = getRenderedRoot();
    const { getByText } = getQueriesForElement(root);
    const badgeRoot = root.querySelector(".seed-manner-temp-badge__root");
    const label = getByText("80°C");

    expect(badgeRoot).toHaveClass("custom-manner-temp-badge");
    expect(badgeRoot).toHaveClass("seed-manner-temp-badge__root--level_l10");
    expect(label).toHaveClass("seed-manner-temp-badge__label");
    expect(label).toHaveClass("seed-manner-temp-badge__label--level_l10");
  });
});
