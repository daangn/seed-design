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
  it("maps a VStack gap token to row-gap", () => {
    render(<VStack gap="x3" />);

    expect(getRenderedRoot()).toHaveStyle({
      rowGap: "var(--seed-dimension-x3)",
    });
    expect(getRenderedRoot().style.getPropertyValue("gap")).toBe("");
    expect(getRenderedRoot().style.getPropertyValue("column-gap")).toBe("");
  });

  it("maps an HStack gap token to column-gap", () => {
    render(<HStack gap="x4" />);

    expect(getRenderedRoot()).toHaveStyle({
      columnGap: "var(--seed-dimension-x4)",
    });
    expect(getRenderedRoot().style.getPropertyValue("gap")).toBe("");
    expect(getRenderedRoot().style.getPropertyValue("row-gap")).toBe("");
  });

  it("keeps a numeric zero gap value", () => {
    render(<VStack gap={0} />);

    expect(getRenderedRoot()).toHaveStyle({ rowGap: "0px" });
  });

  it("keeps an arbitrary string gap value", () => {
    render(<HStack gap="1.5rem" />);

    expect(getRenderedRoot()).toHaveStyle({ columnGap: "1.5rem" });
  });

  it("keeps style gap precedence over the gap prop", () => {
    render(<VStack gap="x3" style={{ gap: "20px" }} />);

    expect(getRenderedRoot()).toHaveStyle({ rowGap: "20px" });
  });

  it("keeps an axis longhand in style above the gap prop", () => {
    render(<VStack gap="x3" style={{ rowGap: "24px" }} />);

    expect(getRenderedRoot()).toHaveStyle({ rowGap: "24px" });
  });
});
