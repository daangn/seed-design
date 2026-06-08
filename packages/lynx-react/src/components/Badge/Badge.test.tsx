import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("Badge", () => {
  it("renders label text in the label slot with default variant classes", () => {
    render(<Badge>거래중</Badge>);

    const { getByText } = getRenderedQueries();
    const root = getRenderedRoot();
    const badgeRoot = root.querySelector(".seed-badge__root");
    const label = getByText("거래중");

    expect(badgeRoot).toBeInTheDocument();
    expect(badgeRoot).toHaveClass("seed-badge__root--size_medium");
    expect(badgeRoot).toHaveClass("seed-badge__root--variant_solid");
    expect(badgeRoot).toHaveClass("seed-badge__root--tone_neutral");
    expect(label).toHaveClass("seed-badge__label");
  });

  it("applies variant classes and preserves user className", () => {
    render(
      <Badge className="custom-badge" size="large" variant="outline" tone="brand">
        추천
      </Badge>,
    );

    const root = getRenderedRoot();
    const badgeRoot = root.querySelector(".seed-badge__root");

    expect(badgeRoot).toBeInTheDocument();
    expect(badgeRoot).toHaveClass("custom-badge");
    expect(badgeRoot).toHaveClass("seed-badge__root--size_large");
    expect(badgeRoot).toHaveClass("seed-badge__root--variant_outline");
    expect(badgeRoot).toHaveClass("seed-badge__root--tone_brand");
    expect(badgeRoot).toHaveClass("seed-badge__root--tone_brand-variant_outline");
  });
});
