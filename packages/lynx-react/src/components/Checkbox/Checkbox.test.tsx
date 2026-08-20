import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";
import * as Checkbox from "./Checkbox.namespace";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => {
  return <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} />;
});
TestIcon.displayName = "TestIcon";

function ControlledGhostCheckbox({
  onCheckedChange,
}: {
  onCheckedChange: (checked: boolean) => void;
}) {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox.Root
      variant="ghost"
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        onCheckedChange(nextChecked);
      }}
    >
      <Checkbox.Control>
        <Checkbox.Indicator
          checked={<TestIcon className="checked-test-icon" />}
          unchecked={<TestIcon className="unchecked-test-icon" />}
        />
      </Checkbox.Control>
    </Checkbox.Root>
  );
}

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

function getCheckboxBackground() {
  const background = getCheckboxControl().querySelector<HTMLElement>(".seed-checkmark__background");

  if (!background) {
    throw new Error("Expected Checkbox background to exist.");
  }

  return background;
}

describe("Checkbox", () => {
  it("keeps each ghost press color stable through release in both toggle directions", () => {
    const onCheckedChange = vi.fn();

    render(<ControlledGhostCheckbox onCheckedChange={onCheckedChange} />);

    const root = getCheckboxRoot();
    const idleRootClassName = getCheckboxControl().className;

    expect(getCheckboxRoot().querySelector(".unchecked-test-icon")).not.toBeNull();
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_false");

    fireEvent.touchstart(root, {});
    expect(getCheckboxControl().className).toBe(idleRootClassName);
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--pressed_true");
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_false");

    fireEvent.touchend(root, {});
    const uncheckedReleaseRootClassName = getCheckboxControl().className;
    const uncheckedReleaseClassName = getCheckboxBackground().className;

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--pressed_false");
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_false");

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(getCheckboxRoot().querySelector(".checked-test-icon")).not.toBeNull();
    expect(getCheckboxControl().className).toBe(uncheckedReleaseRootClassName);
    expect(getCheckboxBackground().className).toBe(uncheckedReleaseClassName);

    fireEvent.touchstart(root, {});

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--pressed_true");
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_true");
    expect(getCheckboxBackground()).toHaveClass(
      "seed-checkmark__background--variant_ghost-tone_brand-checked_true",
    );

    fireEvent.touchend(root, {});
    const checkedReleaseRootClassName = getCheckboxControl().className;
    const checkedReleaseClassName = getCheckboxBackground().className;

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--pressed_false");
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_true");

    fireEvent.tap(root);

    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
    expect(getCheckboxRoot().querySelector(".unchecked-test-icon")).not.toBeNull();
    expect(getCheckboxControl().className).toBe(checkedReleaseRootClassName);
    expect(getCheckboxBackground().className).toBe(checkedReleaseClassName);

    fireEvent.touchstart(root, {});

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--pressed_true");
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_false");

    fireEvent.touchcancel(root, {});

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--pressed_false");
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_false");
  });

  it("keeps the touchstart selection while controlled state changes during a press", () => {
    const renderCheckbox = (checked: boolean) => (
      <Checkbox.Root variant="ghost" checked={checked}>
        <Checkbox.Control />
      </Checkbox.Root>
    );
    const { rerender } = render(renderCheckbox(true));

    const root = getCheckboxRoot();

    fireEvent.touchstart(root, {});
    const checkedPressClassName = getCheckboxBackground().className;

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_true");

    rerender(renderCheckbox(false));

    expect(getCheckboxBackground().className).toBe(checkedPressClassName);

    fireEvent.touchend(root, {});
    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_true");

    fireEvent.touchstart(root, {});
    const uncheckedPressClassName = getCheckboxBackground().className;

    expect(getCheckboxBackground()).toHaveClass("seed-checkmark__background--checked_false");

    rerender(renderCheckbox(true));

    expect(getCheckboxBackground().className).toBe(uncheckedPressClassName);
  });
});
