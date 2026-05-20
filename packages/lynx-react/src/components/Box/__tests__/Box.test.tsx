import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { vars } from "@seed-design/lynx-css/vars";
import { describe, expect, it } from "vitest";

import { Text } from "../../Text";
import { Box } from "../Box";

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

function expectStyle(style: CSSStyleDeclaration, expected: Record<string, string>) {
  for (const [key, value] of Object.entries(expected)) {
    expect(style.getPropertyValue(key)).toBe(value);
  }
}

describe("Box", () => {
  it("resolves token style props to direct view styles", () => {
    render(
      <Box
        className="box-test"
        bg="bg.brandWeak"
        borderColor="stroke.brandWeak"
        borderWidth={1}
        borderRadius="r3"
        p="x4"
      >
        <Text>Box content</Text>
      </Box>,
    );

    const box = getRenderedRoot().querySelector(".box-test");

    expect(box).toBeInTheDocument();
    expectStyle((box as HTMLElement).style, {
      background: vars.$color.bg.brandWeak,
      "border-color": vars.$color.stroke.brandWeak,
      "border-style": "solid",
      "border-width": "1px",
      "border-radius": vars.$radius.r3,
      "padding-top": vars.$dimension.x4,
      "padding-right": vars.$dimension.x4,
      "padding-bottom": vars.$dimension.x4,
      "padding-left": vars.$dimension.x4,
    });
  });

  it("lets explicit style override derived style props", () => {
    render(
      <Box className="box-test" p="x2" style={{ paddingLeft: "24px" }}>
        <Text>Box content</Text>
      </Box>,
    );

    const { getByText } = getRenderedQueries();
    const box = getByText("Box content").parentElement;

    expect(box).toHaveClass("box-test");
    expectStyle((box as HTMLElement).style, {
      "padding-top": vars.$dimension.x2,
      "padding-right": vars.$dimension.x2,
      "padding-bottom": vars.$dimension.x2,
      "padding-left": "24px",
    });
  });
});
