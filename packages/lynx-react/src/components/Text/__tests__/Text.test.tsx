import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { vars } from "@seed-design/lynx-css/vars";
import { typography } from "@seed-design/lynx-css/vars/component";
import { describe, expect, it } from "vitest";

import { Text } from "../Text";

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

describe("Text", () => {
  it("applies typography styles and color tokens directly to the text element", () => {
    render(
      <Text textStyle="t5Bold" color="fg.critical">
        Critical text
      </Text>,
    );

    const { getByText } = getRenderedQueries();
    const text = getByText("Critical text");
    const typographyStyle = typography.textStyleT5Bold.enabled.root;

    expect(text).toHaveStyle({
      color: vars.$color.fg.critical,
      fontSize: typographyStyle.fontSize,
      lineHeight: typographyStyle.lineHeight,
      fontWeight: typographyStyle.fontWeight,
    });
  });

  it("lets explicit typography props override textStyle", () => {
    render(
      <Text textStyle="t5Regular" fontSize="t7" lineHeight="t7" fontWeight="bold" align="center">
        Custom text
      </Text>,
    );

    const { getByText } = getRenderedQueries();
    const text = getByText("Custom text");

    expect(text).toHaveStyle({
      fontSize: vars.$fontSize.t7,
      lineHeight: vars.$lineHeight.t7,
      fontWeight: vars.$fontWeight.bold,
      textAlign: "center",
    });
  });
});
