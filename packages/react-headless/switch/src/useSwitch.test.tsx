import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import { useSwitch, type UseSwitchProps } from "./index";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function Switch(props: UseSwitchProps) {
  const { stateProps, restProps, controlProps, hiddenInputProps, rootProps, thumbProps } =
    useSwitch(props);
  return (
    <label {...rootProps}>
      <div {...controlProps}>
        <div {...stateProps} {...thumbProps} />
      </div>
      <input {...hiddenInputProps} {...restProps} />
    </label>
  );
}

describe("useSwitch", () => {
  it("initial state is correct", () => {
    const { getByRole } = setUp(<Switch defaultChecked={false} />);
    const swc = getByRole("switch");

    expect(swc).not.toBeChecked();
  });

  it("state changes on click", async () => {
    const { getByRole, user } = setUp(<Switch defaultChecked={false} />);
    const swc = getByRole("switch");

    expect(swc).not.toBeChecked();

    await user.click(swc);
    expect(swc).toBeChecked();
  });

  it("onCheckedChange is called", async () => {
    const handleCheckedChange = vi.fn();

    const { getByRole, user } = setUp(
      <Switch defaultChecked={false} onCheckedChange={handleCheckedChange} />,
    );
    const swc = getByRole("switch");

    await user.click(swc);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("hover state updates correctly", async () => {
    const { getByRole, user } = setUp(<Switch defaultChecked={false} />);
    const swc = getByRole("switch");

    await user.hover(swc);
    expect(swc).toHaveAttribute("data-hover");

    await user.unhover(swc);
    expect(swc).not.toHaveAttribute("data-hover");
  });

  it("focus state updates correctly", async () => {
    const { getByRole, user } = setUp(<Switch defaultChecked={false} />);
    const swc = getByRole("switch");

    await user.click(swc);
    expect(swc).toHaveFocus();

    await user.click(document.body);
    expect(swc).not.toHaveFocus();
  });

  it("disabled state", async () => {
    const { getByRole } = setUp(<Switch defaultChecked={false} disabled />);
    const swc = getByRole("switch");

    expect(swc).toBeDisabled();
    expect(swc).not.toBeChecked();

    await userEvent.click(swc);
    expect(swc).not.toBeChecked();
  });

  it("required state", () => {
    const { getByRole } = setUp(<Switch defaultChecked={false} required />);
    const swc = getByRole("switch");

    expect(swc).toBeRequired();
  });
});
