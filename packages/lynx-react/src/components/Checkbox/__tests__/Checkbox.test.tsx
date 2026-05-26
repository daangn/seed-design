import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { checkbox } from "@seed-design/lynx-css/recipes/checkbox";
import { checkmark } from "@seed-design/lynx-css/recipes/checkmark";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../../types";
import { CheckboxControl, CheckboxIndicator, CheckboxLabel, CheckboxRoot } from "../Checkbox";

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRootView() {
  const root = getRenderedRoot();
  return root.matches("view") ? root : root.querySelector("view")!;
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

describe("Checkbox", () => {
  it("merges parent and local variant props through context", () => {
    render(
      <CheckboxRoot defaultChecked size="large" weight="bold" tone="brand">
        <CheckboxControl tone="neutral" variant="ghost" />
        <CheckboxLabel>동의</CheckboxLabel>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();
    const { getByText } = getRenderedQueries();

    expect(root.querySelector(".seed-checkmark__root")).toHaveClass(
      checkmark({
        variant: "ghost",
        tone: "neutral",
        size: "large",
        checked: true,
        disabled: false,
        indeterminate: false,
        pressed: false,
      }).root,
    );
    expect(getByText("동의")).toHaveClass(
      checkbox({ size: "large", weight: "bold", disabled: false }).label,
    );
  });

  it("wraps a custom indicator icon with the final checkmark icon class", () => {
    render(
      <CheckboxRoot defaultChecked>
        <CheckboxControl>
          <CheckboxIndicator checked={<MockIcon />} />
        </CheckboxControl>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();
    const iconWrapper = root.querySelector(".seed-checkmark__icon");
    const image = iconWrapper?.querySelector("image");

    expect(iconWrapper).toBeInTheDocument();
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
  });

  it("keeps recipe className and headless checked state class together", () => {
    render(
      <CheckboxRoot defaultChecked size="large" weight="bold">
        <CheckboxControl>
          <CheckboxIndicator checked={<MockIcon />} />
        </CheckboxControl>
        <CheckboxLabel>동의</CheckboxLabel>
      </CheckboxRoot>,
    );

    getRenderedQueries().getByText("동의");
    const root = getRootView();

    expect(root).toHaveClass("seed-checkbox__root", "ui-checked");
    expect(getRenderedRoot().querySelector(".seed-checkmark__root")).toHaveClass(
      checkmark({
        variant: "square",
        tone: "brand",
        size: "large",
        checked: true,
        disabled: false,
        indeterminate: false,
        pressed: false,
      }).root,
    );
  });

  it("keeps checked/defaultChecked/onCheckedChange behavior through headless state", () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckboxRoot defaultChecked={false} onCheckedChange={onCheckedChange}>
        <CheckboxLabel>동의</CheckboxLabel>
      </CheckboxRoot>,
    );

    getRenderedQueries().getByText("동의");
    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).toHaveClass("ui-checked");
  });

  it("does not change disabled checkbox on tap", () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckboxRoot disabled defaultChecked={false} onCheckedChange={onCheckedChange}>
        <CheckboxLabel>동의</CheckboxLabel>
      </CheckboxRoot>,
    );

    getRenderedQueries().getByText("동의");
    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("ui-disabled");
    expect(root).not.toHaveClass("ui-checked");
  });
});
