import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

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
  it("exposes checkbox accessibility state", () => {
    const { rerender } = render(<Checkbox.Root />);

    expect(getCheckboxRoot()).toHaveAttribute("accessibility-element", "true");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-role-description", "checkbox");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-value", "not checked");
    expect(getCheckboxRoot()).not.toHaveAttribute("accessibility-traits");

    rerender(<Checkbox.Root checked disabled />);

    expect(getCheckboxRoot()).toHaveAttribute("accessibility-value", "checked");
    expect(getCheckboxRoot()).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("prefers explicit accessibility props over defaults", () => {
    render(
      <Checkbox.Root
        checked
        disabled
        accessibility-element={false}
        accessibility-role-description="custom checkbox"
        accessibility-value="custom value"
        accessibility-traits="button"
      />,
    );

    const root = getCheckboxRoot();

    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).toHaveAttribute("accessibility-role-description", "custom checkbox");
    expect(root).toHaveAttribute("accessibility-value", "custom value");
    expect(root).toHaveAttribute("accessibility-traits", "button");
  });

  it("applies the checkbox size class to the control", () => {
    render(
      <Checkbox.Root size="large">
        <Checkbox.Control />
      </Checkbox.Root>,
    );

    expect(getCheckboxControl()).toHaveClass("seed-checkbox__control--size_large");
  });
});
