import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import { useCheckbox, type UseCheckboxProps } from "./index";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

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

describe("useCheckbox", () => {
  it("initial state is correct", () => {
    const { getByRole } = setUp(<Checkbox defaultChecked={false} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("state changes on click", async () => {
    const { getByRole, user } = setUp(<Checkbox defaultChecked={false} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("onCheckedChange is called", async () => {
    const handleCheckedChange = vi.fn();

    const { getByRole, user } = setUp(<Checkbox onCheckedChange={handleCheckedChange} />);
    const checkbox = getByRole("checkbox");

    await user.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("hover state updates correctly", async () => {
    const { getByRole, user } = setUp(<Checkbox />);
    const checkbox = getByRole("checkbox");

    await user.hover(checkbox);
    expect(checkbox).toHaveAttribute("data-hover");

    await user.unhover(checkbox);
    expect(checkbox).not.toHaveAttribute("data-hover");
  });

  it("focus state updates correctly", async () => {
    const { getByRole, user } = setUp(<Checkbox />);
    const checkbox = getByRole("checkbox");

    await user.click(checkbox);
    expect(checkbox).toHaveFocus();

    await user.click(document.body);
    expect(checkbox).not.toHaveFocus();
  });

  it("disabled state", async () => {
    const { getByRole } = setUp(<Checkbox defaultChecked={false} disabled />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("required state", () => {
    const { getByRole } = setUp(<Checkbox required={true} />);
    const checkbox = getByRole("checkbox");

    expect(checkbox).toBeRequired();
  });
});
