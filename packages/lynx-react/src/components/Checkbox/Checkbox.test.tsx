import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Checkbox from "./Checkbox.namespace";

function getCheckboxRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Checkbox root to exist.");
  }

  if (root.classList.contains("seed-checkbox__root")) {
    return root;
  }

  const checkboxRoot = root.querySelector<HTMLElement>(".seed-checkbox__root");

  if (!checkboxRoot) {
    throw new Error("Expected Checkbox root to exist.");
  }

  return checkboxRoot;
}

function getCheckboxControl() {
  const control = getCheckboxRoot().querySelector<HTMLElement>(".seed-checkmark__root");

  if (!control) {
    throw new Error("Expected Checkbox control to exist.");
  }

  return control;
}

describe("Checkbox", () => {
  it("keeps the released ghost root class stable when tap changes checked state", () => {
    const onCheckedChange = vi.fn();

    render(
      <Checkbox.Root variant="ghost" onCheckedChange={onCheckedChange}>
        <Checkbox.Control />
      </Checkbox.Root>,
    );

    const root = getCheckboxRoot();

    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--checked_false");

    fireEvent.touchstart(root, {});
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--pressed_true");
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--checked_false");

    fireEvent.touchend(root, {});
    const releasedClassName = getCheckboxControl().className;

    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--pressed_false");
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--checked_false");

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--pressed_false");
    expect(getCheckboxControl().className).toBe(releasedClassName);

    fireEvent.touchstart(root, {});

    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--pressed_true");
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--checked_true");
  });

  it("does not overlap the checked and pressed color states when tap precedes touchend", () => {
    render(
      <Checkbox.Root variant="ghost">
        <Checkbox.Control />
      </Checkbox.Root>,
    );

    const root = getCheckboxRoot();

    fireEvent.touchstart(root, {});
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--pressed_true");
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--checked_false");

    fireEvent.tap(root);
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--pressed_false");
    expect(getCheckboxControl()).toHaveClass("seed-checkmark__root--checked_false");
    expect(getCheckboxControl()).not.toHaveClass(
      "seed-checkmark__root--variant_ghost-tone_brand-pressed_true-checked_true-disabled_false",
    );
  });
});
