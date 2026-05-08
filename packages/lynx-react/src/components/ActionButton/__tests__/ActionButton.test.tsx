import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { ActionButton } from "../ActionButton";

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

describe("ActionButton", () => {
  it("keeps the original label in the text slot while loading", () => {
    render(<ActionButton loading>Submit</ActionButton>);

    const { getByText } = getRenderedQueries();
    const label = getByText("Submit");
    const root = getRenderedRoot();

    expect(label).toHaveClass("seed-action-button__text");
    expect(label).toHaveClass("seed-action-button__text--size_medium-layout_withText");
    expect(root.querySelector(".seed-action-button__content")).toBeInTheDocument();
    expect(root.querySelector(".seed-action-button__loadingIndicator")).toBeInTheDocument();
    expect(root.querySelector(".seed-progress-circle__root")).toBeInTheDocument();
  });
});
