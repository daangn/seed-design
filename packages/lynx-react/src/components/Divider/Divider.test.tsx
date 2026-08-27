import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

function getRenderedDivider() {
  const divider = elementTree.root?.firstElementChild;

  if (!divider) {
    throw new Error("Expected Divider to render a root element.");
  }

  return divider as HTMLElement;
}

function expectStyle(style: CSSStyleDeclaration, expected: Record<string, string>) {
  for (const [key, value] of Object.entries(expected)) {
    expect(style.getPropertyValue(key)).toBe(value);
  }
}

describe("Divider", () => {
  it("renders a horizontal semantic divider by default", () => {
    render(<Divider className="custom-divider" />);

    const divider = getRenderedDivider();

    expect(divider).toHaveClass("custom-divider");
    expect(divider).toHaveAttribute("accessibility-element", "true");
    expect(divider).toHaveAttribute("accessibility-role-description", "separator");
    expectStyle(divider.style, {
      width: "100%",
      "border-color": "var(--seed-color-stroke-neutral-muted)",
      "border-bottom-width": "1px",
      "border-right-width": "0px",
    });
  });

  it("supports vertical orientation, inset spacing, color, and thickness", () => {
    render(
      <Divider
        orientation="vertical"
        inset
        color="palette.blue500"
        thickness="2px"
        accessibility-element={false}
      />,
    );

    const divider = getRenderedDivider();

    expect(divider).toHaveAttribute("accessibility-element", "false");
    expectStyle(divider.style, {
      height: "calc(100% - 32px)",
      "border-color": "var(--seed-color-palette-blue-500)",
      "border-bottom-width": "0px",
      "border-right-width": "2px",
      "margin-top": "16px",
      "margin-bottom": "16px",
    });
  });

  it("lets user style override the default layout style", () => {
    render(<Divider style={{ width: "80%", marginLeft: "4px" }} inset />);

    expectStyle(getRenderedDivider().style, {
      width: "80%",
      "margin-left": "4px",
      "margin-right": "16px",
    });
  });
});
