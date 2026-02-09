import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";

import type { ReactElement } from "react";
import React, { useMemo } from "react";

import {
  TextFieldRoot,
  TextFieldInput,
  type TextFieldRootProps,
  type TextFieldInputProps,
} from "./TextField";

function setUp(jsx: ReactElement) {
  const renderResult = render(jsx);
  return {
    user: userEvent.setup(),
    ...renderResult,
  };
}

const TextField = ({
  inputProps,
  ...rootProps
}: TextFieldRootProps & { inputProps?: TextFieldInputProps }) => {
  return (
    <TextFieldRoot {...rootProps}>
      <TextFieldInput {...inputProps} />
    </TextFieldRoot>
  );
};

describe("useTextField", () => {
  describe("basic functionality", () => {
    it("should render and type correctly", async () => {
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
      const { getByRole } = setUp(<TextField inputProps={{ autoFocus: true }} />);
      const input = getByRole("textbox");

      expect(input).toHaveFocus();
    });
  });

  describe("value management", () => {
    it("should onValueChange be called", async () => {
      const handleValueChange = mock(() => {});

      const { getByRole, user } = setUp(<TextField onValueChange={handleValueChange} />);
      const input = getByRole("textbox");

      await user.type(input, "a");
      expect(input).toHaveValue("a");
      expect(handleValueChange).toHaveBeenCalledWith("a");
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

  describe("props and aria attributes", () => {
    it("should render the input with aria-invalid=true when invalid=true", () => {
      const { getByRole } = setUp(<TextField invalid />);

      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).not.toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should render the input with aria-required=true when required=true", () => {
      const { getByRole } = setUp(<TextField required />);
      const input = getByRole("textbox");

      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("should **not** render the input with required when required=true", () => {
      const { getByRole } = setUp(<TextField required />);
      const input = getByRole("textbox");

      // note: required attribute is not set on the input and this is intentional
      expect(input).not.toHaveAttribute("required");
    });

    it("should apply aria attributes only to input element", () => {
      const { getByRole } = setUp(<TextField required invalid />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toHaveAttribute("aria-invalid", "true");

      expect(root).not.toHaveAttribute("aria-required");
      expect(root).not.toHaveAttribute("aria-invalid");
    });
  });

  describe("data attributes", () => {
    it("should have data-empty when value is empty", () => {
      const { getByRole } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).toHaveAttribute("data-empty", "");
      expect(input).toHaveAttribute("data-empty", "");
    });

    it("should not have data-empty when value is not empty", async () => {
      const { getByRole, user } = setUp(<TextField defaultValue="test" />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).not.toHaveAttribute("data-empty");
      expect(input).not.toHaveAttribute("data-empty");

      await user.clear(input);
      expect(root).toHaveAttribute("data-empty", "");
      expect(input).toHaveAttribute("data-empty", "");
    });

    it("should have data-disabled when disabled", () => {
      const { getByRole } = setUp(<TextField disabled />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).toHaveAttribute("data-disabled", "");
      expect(input).toHaveAttribute("data-disabled", "");
      expect(input).toBeDisabled();
    });

    it("should have data-readonly when readOnly", () => {
      const { getByRole } = setUp(<TextField readOnly />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).toHaveAttribute("data-readonly", "");
      expect(input).toHaveAttribute("data-readonly", "");
      expect(input).toHaveAttribute("readonly");
    });

    it("should have data-invalid when invalid", () => {
      const { getByRole } = setUp(<TextField invalid />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).toHaveAttribute("data-invalid", "");
      expect(input).toHaveAttribute("data-invalid", "");
    });

    it("should have data-hover on hover", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(root).not.toHaveAttribute("data-hover");
      expect(input).not.toHaveAttribute("data-hover");

      await user.hover(root);
      expect(root).toHaveAttribute("data-hover", "");
      expect(input).toHaveAttribute("data-hover", "");

      await user.unhover(root);
      expect(root).not.toHaveAttribute("data-hover");
      expect(input).not.toHaveAttribute("data-hover");
    });

    it("should have data-active on pointer down", async () => {
      const { getByRole } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(root).not.toHaveAttribute("data-active");
      expect(input).not.toHaveAttribute("data-active");

      fireEvent.pointerDown(root);
      expect(root).toHaveAttribute("data-active", "");
      expect(input).toHaveAttribute("data-active", "");

      fireEvent.pointerUp(root);
      expect(root).not.toHaveAttribute("data-active");
      expect(input).not.toHaveAttribute("data-active");
    });

    it("should remove data-active and data-hover on pointer leave", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(root).not.toHaveAttribute("data-hover");
      expect(root).not.toHaveAttribute("data-active");
      expect(input).not.toHaveAttribute("data-hover");
      expect(input).not.toHaveAttribute("data-active");

      await user.hover(root);
      fireEvent.pointerDown(root);
      expect(root).toHaveAttribute("data-hover", "");
      expect(root).toHaveAttribute("data-active", "");
      expect(input).toHaveAttribute("data-hover", "");
      expect(input).toHaveAttribute("data-active", "");

      fireEvent.pointerLeave(root);
      expect(root).not.toHaveAttribute("data-hover");
      expect(root).not.toHaveAttribute("data-active");
      expect(input).not.toHaveAttribute("data-hover");
      expect(input).not.toHaveAttribute("data-active");
    });

    it("should have data-focus when input is focused", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      expect(root).not.toHaveAttribute("data-focus");
      expect(input).not.toHaveAttribute("data-focus");

      await user.click(input);
      expect(root).toHaveAttribute("data-focus", "");
      expect(input).toHaveAttribute("data-focus", "");

      await user.tab();
      expect(root).not.toHaveAttribute("data-focus");
      expect(input).not.toHaveAttribute("data-focus");
    });
  });

  describe("disabled state", () => {
    it("should propagate disabled prop to input and actually disable it", () => {
      const { getByRole } = setUp(<TextField disabled />);
      const input = getByRole("textbox");

      expect(input).toHaveProperty("disabled", true);
      expect(input).toBeDisabled();
    });

    it("should not allow typing when disabled", async () => {
      const handleValueChange = mock(() => {});
      const { getByRole, user } = setUp(<TextField disabled onValueChange={handleValueChange} />);
      const input = getByRole("textbox");

      await user.type(input, "test");
      expect(input).toHaveValue("");
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should still trigger hover state when disabled", async () => {
      const { getByRole, user } = setUp(<TextField disabled />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(root).not.toHaveAttribute("data-hover");
      expect(input).not.toHaveAttribute("data-hover");

      await user.hover(root);
      expect(root).toHaveAttribute("data-hover", "");
      expect(input).toHaveAttribute("data-hover", "");
    });
  });

  describe("readOnly state", () => {
    it("should propagate readOnly prop to input", () => {
      const { getByRole } = setUp(<TextField readOnly />);
      const input = getByRole("textbox");

      expect(input).toHaveProperty("readOnly", true);
      expect(input).toHaveAttribute("readonly");
    });

    it("should not allow value changes when readOnly", async () => {
      const handleValueChange = mock(() => {});
      const { getByRole, user } = setUp(
        <TextField readOnly defaultValue="initial" onValueChange={handleValueChange} />,
      );
      const input = getByRole("textbox");

      expect(input).toHaveValue("initial");
      await user.type(input, "test");
      expect(input).toHaveValue("initial");
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it("should allow focus when readOnly", async () => {
      const { getByRole, user } = setUp(<TextField readOnly />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      await user.click(input);
      expect(input).toHaveFocus();
    });
  });

  describe("controlled vs uncontrolled", () => {
    it("should work as uncontrolled component with defaultValue", async () => {
      const { getByRole, user } = setUp(<TextField defaultValue="initial" />);
      const input = getByRole("textbox");

      expect(input).toHaveValue("initial");
      await user.clear(input);
      expect(input).toHaveValue("");
      await user.type(input, "new value");
      expect(input).toHaveValue("new value");
    });

    it("should work as controlled component with value", async () => {
      const ControlledTextField = () => {
        const [value, setValue] = React.useState("controlled");
        return <TextField value={value} onValueChange={setValue} />;
      };

      const { getByRole, user } = setUp(<ControlledTextField />);
      const input = getByRole("textbox");

      expect(input).toHaveValue("controlled");
      await user.clear(input);
      expect(input).toHaveValue("");
      await user.type(input, "new");
      expect(input).toHaveValue("new");
    });

    it("should not update value without onValueChange in controlled mode", async () => {
      const { getByRole, user } = setUp(<TextField value="fixed" />);
      const input = getByRole("textbox");

      expect(input).toHaveValue("fixed");
      await user.type(input, "test");
      expect(input).toHaveValue("fixed");
    });
  });

  describe("name prop", () => {
    it("should use provided name", () => {
      const { getByRole } = setUp(<TextField name="custom-name" />);
      const input = getByRole("textbox");

      expect(input).toHaveAttribute("name", "custom-name");
    });

    it("should generate a unique name when not provided", () => {
      const { getAllByRole } = setUp(
        <>
          <TextField />
          <TextField />
        </>,
      );
      const inputs = getAllByRole("textbox");

      expect(inputs[0]).toHaveAttribute("name");
      expect(inputs[1]).toHaveAttribute("name");
      expect(inputs[0].getAttribute("name")).not.toBe(inputs[1].getAttribute("name"));
    });
  });

  describe("focus management", () => {
    it("should update focus-visible correctly on change event", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus-visible");

      await user.tab();
      expect(input).toHaveFocus();
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus-visible", "");

      await user.type(input, "a");
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus-visible", "");
    });

    it("should clear focus states on blur", async () => {
      const { getByRole, user } = setUp(<TextField />);
      const input = getByRole("textbox");
      const root = input.parentElement;

      if (!root) throw new Error("root not found");

      expect(root).not.toHaveAttribute("data-focus");
      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus");
      expect(input).not.toHaveAttribute("data-focus-visible");

      await user.tab();
      expect(input).toHaveFocus();
      expect(root).toHaveAttribute("data-focus", "");
      expect(root).toHaveAttribute("data-focus-visible", "");
      expect(input).toHaveAttribute("data-focus", "");
      expect(input).toHaveAttribute("data-focus-visible", "");

      await user.tab();
      expect(input).not.toHaveFocus();
      expect(root).not.toHaveAttribute("data-focus");
      expect(root).not.toHaveAttribute("data-focus-visible");
      expect(input).not.toHaveAttribute("data-focus");
      expect(input).not.toHaveAttribute("data-focus-visible");
    });
  });
});
