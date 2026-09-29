import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { HStack, VStack } from "./Stack";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  const stack = root.querySelector<HTMLElement>("view");

  if (!stack) {
    throw new Error("Expected Stack root view to exist.");
  }

  return stack;
}

describe("Stack", () => {
  it("renders VStack as a column flex container", () => {
    render(<VStack />);

    expect(getRenderedRoot()).toHaveClass("seed-box-display", "seed-box-flex-direction");
  });

  it("applies a VStack gap to the row axis only", () => {
    render(<VStack gap="x3" />);

    expect(getRenderedRoot()).toHaveClass("seed-box-row-gap");
    expect(getRenderedRoot()).not.toHaveClass("seed-box-gap");
    expect(getRenderedRoot()).not.toHaveClass("seed-box-column-gap");
  });

  it("applies an HStack gap to the column axis only", () => {
    render(<HStack gap="x4" />);

    expect(getRenderedRoot()).toHaveClass("seed-box-column-gap");
    expect(getRenderedRoot()).not.toHaveClass("seed-box-gap");
    expect(getRenderedRoot()).not.toHaveClass("seed-box-row-gap");
  });

  it("maps stack aliases to flex style props", () => {
    render(<HStack align="center" justify="spaceBetween" wrap grow />);

    expect(getRenderedRoot()).toHaveClass(
      "seed-box-align-items",
      "seed-box-justify-content",
      "seed-box-flex-wrap",
      "seed-box-flex-grow",
    );
  });

  it("adds the bleed class", () => {
    render(<HStack bleedX="x4" />);

    expect(getRenderedRoot()).toHaveClass("seed-box-bleed-x");
  });
});
