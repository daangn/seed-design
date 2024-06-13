import "@testing-library/jest-dom/vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
import * as React from "react";

import { useCheckbox, type UseCheckboxProps } from "./index";

// A helper component to test the hook
function Checkbox(props: UseCheckboxProps) {
  const { controlProps, hiddenInputProps, restProps, rootProps, stateProps } = useCheckbox(props);
  return (
    <label {...rootProps}>
      <div {...controlProps}>
        <svg {...stateProps} />
      </div>
      <input {...hiddenInputProps} {...restProps} />
      <span {...stateProps} />
    </label>
  );
}

afterEach(() => {
  cleanup();
});

describe("useCheckbox", () => {
  it("initial state is correct", () => {
    const { getByRole } = render(<Checkbox defaultChecked={false} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("state changes on click", () => {
    const { getByRole } = render(<Checkbox defaultChecked={false} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("onCheckedChange is called", () => {
    const handleCheckedChange = vi.fn();

    const { getByRole } = render(<Checkbox onCheckedChange={handleCheckedChange} />);
    const checkbox = getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("data attributes are set correctly", () => {
    const { getByRole } = render(<Checkbox defaultChecked={true} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).toHaveAttribute("data-checked");
  });

  it("hover state updates correctly", () => {
    const { getByLabelText } = render(<Checkbox />);
    const label = getByLabelText("");

    fireEvent.pointerMove(label);
    expect(label).toHaveAttribute("data-hover");

    fireEvent.pointerLeave(label);
    expect(label).not.toHaveAttribute("data-hover");
  });

  it("focus state updates correctly", () => {
    const { getByRole } = render(<Checkbox />);
    const checkbox = getByRole("checkbox");

    fireEvent.focus(checkbox);
    expect(checkbox).toHaveAttribute("data-focus");

    fireEvent.blur(checkbox);
    expect(checkbox).not.toHaveAttribute("data-focus");
  });

  it("disabled state", () => {
    const { getByRole } = render(<Checkbox defaultChecked={false} disabled />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("required state", () => {
    const { getByRole } = render(<Checkbox required={true} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeRequired();
  });
});
