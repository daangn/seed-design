import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { radio } from "@seed-design/lynx-css/recipes/radio";
import { radiomark } from "@seed-design/lynx-css/recipes/radiomark";
import * as React from "react";
import { describe, expect, it } from "vitest";

import type { LynxIconElementProps } from "../../../types";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemIndicator,
  RadioGroupItemLabel,
  RadioGroupRoot,
} from "../RadioGroup";

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

const MockIcon = React.forwardRef<unknown, LynxIconElementProps>((props, ref) => {
  const { className, style, ...rest } = props;

  return (
    <image
      {...rest}
      {...(ref ? { "main-thread:ref": ref as React.Ref<unknown> } : {})}
      className={className}
      style={style}
    />
  );
});
MockIcon.displayName = "MockIcon";

describe("RadioGroup", () => {
  it("merges group and local item variant props through context", () => {
    render(
      <RadioGroupRoot defaultValue="a" size="large" weight="bold" tone="neutral">
        <RadioGroupItem value="a">
          <RadioGroupItemControl tone="brand" />
          <RadioGroupItemLabel>옵션 A</RadioGroupItemLabel>
        </RadioGroupItem>
      </RadioGroupRoot>,
    );

    const root = getRenderedRoot();
    const { getByText } = getRenderedQueries();

    expect(root.querySelector(".seed-radio__root")).toHaveClass(
      radio({ size: "large", weight: "bold", disabled: false }).root,
    );
    expect(root.querySelector(".seed-radiomark__root")).toHaveClass(
      radiomark({
        tone: "brand",
        size: "large",
        checked: true,
        disabled: false,
        pressed: false,
      }).root,
    );
    expect(getByText("옵션 A")).toHaveClass(
      radio({ size: "large", weight: "bold", disabled: false }).label,
    );
  });

  it("wraps a custom indicator icon with the final radiomark icon class", () => {
    render(
      <RadioGroupRoot defaultValue="a">
        <RadioGroupItem value="a">
          <RadioGroupItemControl>
            <RadioGroupItemIndicator checked={<MockIcon />} />
          </RadioGroupItemControl>
        </RadioGroupItem>
      </RadioGroupRoot>,
    );

    const root = getRenderedRoot();
    const iconWrapper = root.querySelector(".seed-radiomark__icon");
    const image = iconWrapper?.querySelector("image");

    expect(iconWrapper).toBeInTheDocument();
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
  });
});
