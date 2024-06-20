import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import { useTextField, type UseTextFieldProps } from "./index";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function TextField(props: UseTextFieldProps) {
  const {
    rootProps,
    inputProps,
    labelProps,
    descriptionProps,
    errorMessageProps,
    stateProps,
    restProps,
    graphemes,
  } = useTextField({ ...props, elementType: "input" });

  return (
    <div {...stateProps} {...rootProps}>
      <div data-part="head">
        <label {...labelProps} />
        <span data-part="indicator" />
      </div>
      <div data-part="field">
        <div data-part="prefix" />
        <input {...inputProps} {...restProps} />
        <div data-part="suffix" />
      </div>
      <div data-part="foot">
        <span {...stateProps} {...errorMessageProps} />
        <span {...stateProps} {...descriptionProps} />
        <div data-part="count-container" {...stateProps}>
          <span data-part="character-count">{graphemes.length}</span>
          <span data-part="max-count" />
        </div>
      </div>
    </div>
  );
}

describe("useTextField", () => {
  it("initial state is correct", () => {
    const { getByRole } = setUp(<TextField defaultValue="" />);
    const input = getByRole("textbox");

    expect(input).toHaveValue("");
  });

  it("state changes on input", async () => {
    const { getByRole, user } = setUp(<TextField defaultValue="" />);
    const input = getByRole("textbox");

    expect(input).toHaveValue("");

    await user.type(input, "a");
    expect(input).toHaveValue("a");
  });

  it("onValueChange is called", async () => {
    const handleValueChange = vi.fn();

    const { getByRole, user } = setUp(
      <TextField defaultValue="" onValueChange={handleValueChange} />,
    );
    const input = getByRole("textbox");

    await user.type(input, "a");
    expect(handleValueChange).toHaveBeenCalledWith("a");
  });

  it("onValueChange is not called when value is the same", async () => {
    const handleValueChange = vi.fn();

    const { getByRole, user } = setUp(
      <TextField defaultValue="a" onValueChange={handleValueChange} />,
    );
    const input = getByRole("textbox");

    await user.type(input, "{backspace}");
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("onValueChange is not called when value is the same after trimming", async () => {
    const handleValueChange = vi.fn();

    const { getByRole, user } = setUp(
      <TextField defaultValue="a" onValueChange={handleValueChange} />,
    );
    const input = getByRole("textbox");

    await user.type(input, "{backspace}");
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("copy and paste works", async () => {
    const { getByRole, user } = setUp(<TextField defaultValue="" />);
    const input = getByRole("textbox");

    await user.type(input, "a");
    expect(input).toHaveValue("a");

    await user.type(input, "{selectall}{copy}");
    await user.type(input, "{selectall}{paste}");
    expect(input).toHaveValue("a");
  });

  it("copy and paste works with maxLength", async () => {
    const { getByRole, user } = setUp(<TextField defaultValue="" maxLength={1} />);
    const input = getByRole("textbox");

    await user.type(input, "a");
    expect(input).toHaveValue("a");

    await user.type(input, "{selectall}{copy}");
    await user.type(input, "{selectall}{paste}");
    expect(input).toHaveValue("a");
  });

  it("copy and paste works with maxLength with emoji", async () => {
    const { getByRole, user } = setUp(<TextField defaultValue="" maxLength={5} />);
    const input = getByRole("textbox");

    input.focus();

    await user.paste("🥕🥕🥕🥕");
    await user.paste("🥕🥕🥕🥕");

    expect(input).toHaveValue("🥕🥕🥕🥕🥕");
  });
});
