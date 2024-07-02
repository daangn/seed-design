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
  it("should render the switch correctly", () => {
    const { getByRole } = setUp(<Switch />);
    const swc = getByRole("switch");

    expect(swc).not.toBeChecked();
  });

  it("should render the switch with defaultChecked=true", () => {
    const { getByRole } = setUp(<Switch defaultChecked={true} />);
    const swc = getByRole("switch");

    expect(swc).toBeChecked();
  });

  it("should render the switch with defaultChecked=false", () => {
    const { getByRole } = setUp(<Switch defaultChecked={false} />);
    const swc = getByRole("switch");

    expect(swc).not.toBeChecked();
  });

  it("should checked when clicked", async () => {
    const { getByRole, user } = setUp(<Switch />);
    const swc = getByRole("switch");

    await user.click(swc);
    expect(swc).toBeChecked();
  });

  it("should onCheckedChange is called when clicked", async () => {
    const handleCheckedChange = vi.fn();

    const { getByRole, user } = setUp(<Switch onCheckedChange={handleCheckedChange} />);
    const swc = getByRole("switch");

    await user.click(swc);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("should hover state updates correctly", async () => {
    const { getByRole, user } = setUp(<Switch />);
    const swc = getByRole("switch");

    await user.hover(swc);
    expect(swc).toHaveAttribute("data-hover");

    await user.unhover(swc);
    expect(swc).not.toHaveAttribute("data-hover");
  });

  it("should focus state updates correctly", async () => {
    const { getByRole, user } = setUp(<Switch />);
    const swc = getByRole("switch");

    await user.click(swc);
    expect(swc).toHaveFocus();

    await user.click(document.body);
    expect(swc).not.toHaveFocus();
  });

  it("should required state when required prop is true", () => {
    const { getByRole } = setUp(<Switch required={true} />);
    const swc = getByRole("switch");

    expect(swc).toBeRequired();
  });

  describe("disabled prop test", () => {
    it("should disabled when disabled prop is true", async () => {
      const { getByRole } = setUp(<Switch disabled={true} />);
      const swc = getByRole("switch");

      expect(swc).toBeDisabled();
    });

    it("should not change checked state when clicked", async () => {
      const { getByRole } = setUp(<Switch disabled={true} />);
      const swc = getByRole("switch");

      await userEvent.click(swc);
      expect(swc).not.toBeChecked();
    });

    it("should not onCheckedChange be called when clicked", async () => {
      const handleCheckedChange = vi.fn();

      const { getByRole } = setUp(<Switch disabled={true} onCheckedChange={handleCheckedChange} />);
      const swc = getByRole("switch");

      await userEvent.click(swc);
      expect(handleCheckedChange).not.toHaveBeenCalled();
    });
  });
});
