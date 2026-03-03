import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";

import type { ReactElement } from "react";

import { ToggleRoot, type ToggleRootProps } from "./Toggle";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function Toggle(props: ToggleRootProps) {
  return <ToggleRoot {...props}>Toggle</ToggleRoot>;
}

describe("useToggle", () => {
  it("should render with aria-pressed even without defaultPressed", () => {
    const { getByRole } = setUp(<Toggle />);
    const button = getByRole("button", { name: "Toggle" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("should toggle pressed state on click", async () => {
    const { getByRole, user } = setUp(<Toggle />);
    const button = getByRole("button", { name: "Toggle" });

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveAttribute("data-pressed");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-pressed");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("should call onPressedChange when toggled", async () => {
    const onPressedChange = mock();
    const { getByRole, user } = setUp(<Toggle onPressedChange={onPressedChange} />);
    const button = getByRole("button", { name: "Toggle" });

    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("should have aria-disabled when disabled prop is true", () => {
    const { getByRole } = setUp(<Toggle disabled />);
    const button = getByRole("button", { name: "Toggle" });

    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-disabled");
  });

  it("should not toggle when disabled", async () => {
    const onPressedChange = mock();
    const { getByRole, user } = setUp(<Toggle disabled onPressedChange={onPressedChange} />);
    const button = getByRole("button", { name: "Toggle" });

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("should remain focusable when disabled", async () => {
    const { getByRole, user } = setUp(<Toggle disabled />);
    const button = getByRole("button", { name: "Toggle" });

    await user.tab();
    expect(button).toHaveFocus();
  });

  it("should support controlled pressed state", () => {
    const { getByRole } = setUp(<Toggle pressed />);
    const button = getByRole("button", { name: "Toggle" });

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-pressed");
  });

  it("should support defaultPressed", () => {
    const { getByRole } = setUp(<Toggle defaultPressed />);
    const button = getByRole("button", { name: "Toggle" });

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-pressed");
  });
});
