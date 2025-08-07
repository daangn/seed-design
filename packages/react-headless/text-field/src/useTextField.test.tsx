import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import React, { useMemo } from "react";

import { TextFieldInput, type TextFieldInputProps } from "./TextField";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const TextField = (props: TextFieldInputProps) => {
  return <TextFieldInput {...props} />;
};

describe("useTextField", () => {
  describe("aria test", () => {
    it("should render the input with aria-invalid=true when isInvalid=true", () => {
      const { getByRole } = setUp(<TextField invalid />);
      const input = getByRole("textbox");

      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should render the input with aria-required=true when isRequired=true", () => {
      const { getByRole } = setUp(<TextField required />);
      const input = getByRole("textbox");

      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("should not render the input with aria-describedby when provided neither description nor errorMessage", () => {
      const { getByRole } = setUp(<TextField />);
      const input = getByRole("textbox");

      expect(input).not.toHaveAttribute("aria-describedby");
    });
  });

  it("should render correctly", () => {
    const { getByRole } = setUp(<TextField />);
    const input = getByRole("textbox");

    expect(input).toHaveValue("");
  });

  it("should type correctly", async () => {
    const { getByRole, user } = setUp(<TextField />);
    const input = getByRole("textbox");

    expect(input).toHaveValue("");

    await user.type(input, "a");
    expect(input).toHaveValue("a");
  });

  it("should render `defaultValue` correctly", () => {
    const defaultValue = "abcde";
    const { getByRole } = setUp(<TextField defaultValue={defaultValue} />);
    const input = getByRole("textbox");

    expect(input).toHaveValue(defaultValue);
  });

  it("should autofocus correctly", () => {
    const { getByRole } = setUp(<TextField autoFocus />);
    const input = getByRole("textbox");

    expect(input).toHaveFocus();
  });

  it("should onValueChange be called", async () => {
    const handleValueChange = vi.fn();

    const { getByRole, user } = setUp(<TextField onValueChange={handleValueChange} />);
    const input = getByRole("textbox");

    await user.type(input, "a");
    expect(input).toHaveValue("a");
    expect(handleValueChange).toHaveBeenCalledWith({
      value: "a",
      graphemes: ["a"],
      slicedValue: "a",
      slicedGraphemes: ["a"],
    });
  });

  it("should set value from outside correctly (number formatting)", async () => {
    function NumberFormattedInput() {
      const [value, setValue] = React.useState("");

      const formattedValue = useMemo(() => {
        if (value === "") return value;

        const number = Number(value.replace(/,/g, ""));
        if (Number.isNaN(number)) return "";

        return number.toLocaleString();
      }, [value]);

      return <TextField value={formattedValue} onValueChange={(value) => setValue(value)} />;
    }

    const { getByRole, user } = setUp(<NumberFormattedInput />);
    const input = getByRole("textbox");

    await user.type(input, "11111111");
    expect(input).toHaveValue("11,111,111");
  });
});
