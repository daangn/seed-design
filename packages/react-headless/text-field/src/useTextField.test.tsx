import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import React from "react";

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
        <input {...inputProps} />
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

function ControlledTextField(props: Omit<UseTextFieldProps, "value" | "onValueChange">) {
  const { defaultValue } = props;
  const [value, setValue] = React.useState(defaultValue);
  const mockSetValue = vi.fn((value) => setValue(value));

  return <TextField value={value} onValueChange={mockSetValue} {...props} />;
}

describe("useTextField", () => {
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
    expect(handleValueChange).toHaveBeenCalledWith("a");
  });

  it("should not called onValueChange when maxLength is reached", async () => {
    const handleValueChange = vi.fn();

    const maxLength = 5;
    const defaultFulledValue = "a".repeat(maxLength);
    const { getByRole, user } = setUp(
      <TextField
        defaultValue={defaultFulledValue}
        maxLength={maxLength}
        onValueChange={handleValueChange}
      />,
    );
    const input = getByRole("textbox");

    await user.type(input, "a");
    expect(input).toHaveValue(defaultFulledValue);
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  describe("graphemes test", () => {
    it("should grapheme count 5 when type 5 text", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "a".repeat(5));

      expect(input).toHaveAttribute("data-grapheme-count", "5");
    });

    it("should grapheme count 5 when type 5 emoji", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "🥕".repeat(5));

      expect(input).toHaveAttribute("data-grapheme-count", "5");
    });

    it("should grapheme count 10 when maxLength is 10, type 15 text", async () => {
      const { getByRole, user } = setUp(<TextField maxLength={10} />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "a".repeat(15));

      expect(input).toHaveAttribute("data-grapheme-count", "10");
    });

    it("should grapheme count 10 when maxLength is 10, type 15 emoji", async () => {
      const { getByRole, user } = setUp(<TextField maxLength={10} />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "🥕".repeat(15));

      expect(input).toHaveAttribute("data-grapheme-count", "10");
    });

    it("should grapheme count 10 when maxLength is 10, type 15 emoji and text", async () => {
      const { getByRole, user } = setUp(<TextField maxLength={10} />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "a🥕a".repeat(5));

      expect(input).toHaveAttribute("data-grapheme-count", "10");
    });

    it("should slice correctly when paste over maxLength", async () => {
      const { getByRole, user } = setUp(<TextField maxLength={12} />);
      const input = getByRole("textbox");

      const value = "a".repeat(10);
      await user.type(input, value);
      expect(input).toHaveValue(value);

      await user.paste("aaaaa");
      expect(input).toHaveValue(`${value}${"a".repeat(2)}`);
    });

    it("should slice correctly when paste over maxLength with emoji", async () => {
      const maxLength = 5;
      const { getByRole, user } = setUp(<TextField maxLength={maxLength} />);
      const input = getByRole("textbox");

      input.focus();

      await user.paste("🥕".repeat(4));
      await user.paste("🥕".repeat(4));

      expect(input).toHaveValue("🥕".repeat(maxLength));
    });

    it("should not slice when allowExceedLength is true", async () => {
      const { getByRole, user } = setUp(<TextField maxLength={5} allowExceedLength />);
      const input = getByRole("textbox");

      input.focus();

      await user.paste("🥕🥕🥕🥕");
      await user.paste("🥕🥕🥕🥕");

      expect(input).toHaveValue("🥕🥕🥕🥕🥕🥕🥕🥕");
    });
  });

  describe("graphemes test with controlled", () => {
    it("should grapheme count 5 when type 5 text", async () => {
      const { getByRole, user } = setUp(<ControlledTextField />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "a".repeat(5));

      expect(input).toHaveAttribute("data-grapheme-count", "5");
    });

    it("should grapheme count 5 when type 5 emoji", async () => {
      const { getByRole, user } = setUp(<ControlledTextField />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "🥕".repeat(5));

      expect(input).toHaveAttribute("data-grapheme-count", "5");
    });

    it("should grapheme count 10 when maxLength is 10, type 15 text", async () => {
      const { getByRole, user } = setUp(<ControlledTextField maxLength={10} />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "a".repeat(15));

      expect(input).toHaveAttribute("data-grapheme-count", "10");
    });

    it("should grapheme count 10 when maxLength is 10, type 15 emoji", async () => {
      const { getByRole, user } = setUp(<ControlledTextField maxLength={10} />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "🥕".repeat(15));

      expect(input).toHaveAttribute("data-grapheme-count", "10");
    });

    it("should grapheme count 10 when maxLength is 10, type 15 emoji and text", async () => {
      const { getByRole, user } = setUp(<ControlledTextField maxLength={10} />);
      const input = getByRole("textbox");

      input.focus();

      await user.type(input, "a🥕a".repeat(5));

      expect(input).toHaveAttribute("data-grapheme-count", "10");
    });

    it("should slice correctly when paste over maxLength", async () => {
      const { getByRole, user } = setUp(<ControlledTextField maxLength={12} />);
      const input = getByRole("textbox");

      const value = "a".repeat(10);
      await user.type(input, value);
      expect(input).toHaveValue(value);

      await user.paste("aaaaa");
      expect(input).toHaveValue(`${value}${"a".repeat(2)}`);
    });

    it("should slice correctly when paste over maxLength with emoji", async () => {
      const maxLength = 5;
      const { getByRole, user } = setUp(<ControlledTextField maxLength={maxLength} />);
      const input = getByRole("textbox");

      input.focus();

      await user.paste("🥕".repeat(4));
      await user.paste("🥕".repeat(4));

      expect(input).toHaveValue("🥕".repeat(maxLength));
    });

    it("should not slice when allowExceedLength is true", async () => {
      const { getByRole, user } = setUp(<ControlledTextField maxLength={5} allowExceedLength />);
      const input = getByRole("textbox");

      input.focus();

      await user.paste("🥕🥕🥕🥕");
      await user.paste("🥕🥕🥕🥕");

      expect(input).toHaveValue("🥕🥕🥕🥕🥕🥕🥕🥕");
    });
  });
});
