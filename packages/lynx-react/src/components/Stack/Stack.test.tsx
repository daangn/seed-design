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
  it("applies a VStack gap token to both axes without the gap shorthand", () => {
    render(<VStack gap="x3" />);

    const { style } = getRenderedRoot();
    expect(style.rowGap).toBe("var(--seed-dimension-x3)");
    expect(style.columnGap).toBe("var(--seed-dimension-x3)");
    expect(style.getPropertyValue("gap")).toBe("");
  });

  it("applies an HStack gap token to both axes so wrapped lines are spaced", () => {
    render(<HStack gap="x4" wrap />);

    const { style } = getRenderedRoot();
    expect(style.flexWrap).toBe("wrap");
    expect(style.rowGap).toBe("var(--seed-dimension-x4)");
    expect(style.columnGap).toBe("var(--seed-dimension-x4)");
    expect(style.getPropertyValue("gap")).toBe("");
  });

  it("keeps a numeric zero gap value", () => {
    render(<VStack gap={0} />);

    expect(getRenderedRoot()).toHaveStyle({ rowGap: "0px" });
  });

  it("keeps an arbitrary string gap value", () => {
    render(<HStack gap="1.5rem" />);

    expect(getRenderedRoot().style.columnGap).toBe("1.5rem");
  });

  it("keeps style gap precedence over the gap prop", () => {
    render(<VStack gap="x3" style={{ gap: "20px" }} />);

    expect(getRenderedRoot()).toHaveStyle({ rowGap: "20px", columnGap: "20px" });
  });

  it("keeps an axis longhand in style above the gap prop for that axis only", () => {
    render(<HStack gap="x3" style={{ rowGap: "24px" }} />);

    const { style } = getRenderedRoot();
    expect(style.rowGap).toBe("24px");
    expect(style.columnGap).toBe("var(--seed-dimension-x3)");
  });

  it("applies bleed as a negative margin", () => {
    render(<HStack bleedX="16px" />);

    expect(getRenderedRoot().style.getPropertyValue("margin-left")).toBe("calc(-16px)");
    expect(getRenderedRoot().style.getPropertyValue("margin-right")).toBe("calc(-16px)");
  });
});
