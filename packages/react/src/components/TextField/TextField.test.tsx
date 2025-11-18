import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import React from "react";

import { Field } from "@seed-design/react-field";
import {
  TextFieldRoot,
  TextFieldInput,
  TextFieldTextarea,
  TextFieldPrefixIcon,
  TextFieldPrefixText,
  TextFieldSuffixIcon,
  TextFieldSuffixText,
} from "./TextField";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("TextField", () => {
  global.CSS = {
    // @ts-expect-error
    supports: (_k, _v) => true,
  };

  describe("props merging", () => {
    describe("TextFieldInput", () => {
      it("should merge props from TextFieldRoot", () => {
        const { getByRole } = setUp(
          <TextFieldRoot defaultValue="initial">
            <TextFieldInput placeholder="Placeholder" />
          </TextFieldRoot>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveValue("initial");
        expect(input).toHaveAttribute("placeholder", "Placeholder");
      });

      it("should merge props from Field context", () => {
        const { getByRole } = setUp(
          <Field.Root required invalid disabled name="test-field">
            <TextFieldRoot>
              <TextFieldInput />
            </TextFieldRoot>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("name", "test-field");
        expect(input).toHaveAttribute("aria-required", "true");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toBeDisabled();
      });

      it("should prioritize direct props over context props", () => {
        const { getByRole } = setUp(
          <Field.Root name="field-name">
            <TextFieldRoot>
              <TextFieldInput name="direct-name" />
            </TextFieldRoot>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("name", "direct-name");
      });

      it("should merge data attributes", () => {
        const { getByRole } = setUp(
          <Field.Root disabled readOnly invalid>
            <TextFieldRoot>
              <TextFieldInput data-custom="value" />
            </TextFieldRoot>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("data-disabled", "");
        expect(input).toHaveAttribute("data-readonly", "");
        expect(input).toHaveAttribute("data-invalid", "");
        expect(input).toHaveAttribute("data-custom", "value");
      });

      it("should handle uncontrolled modes", async () => {
        const handleChange = vi.fn();
        const { getByRole, user } = setUp(
          <TextFieldRoot onValueChange={handleChange}>
            <TextFieldInput />
          </TextFieldRoot>,
        );

        const input = getByRole("textbox");

        await user.type(input, "test");
        expect(handleChange).toHaveBeenCalledWith("test");
      });

      it("should handle controlled modes", async () => {
        function Controlled() {
          const [value, setValue] = React.useState("");

          return (
            <TextFieldRoot value={value} onValueChange={setValue}>
              <TextFieldInput />
            </TextFieldRoot>
          );
        }

        const { getByRole, user } = setUp(<Controlled />);

        const input = getByRole("textbox");

        await user.type(input, "test");
        expect(input).toHaveValue("test");
      });
    });

    describe("TextFieldTextarea", () => {
      it("should merge props from TextFieldRoot", () => {
        const { getByRole } = setUp(
          <TextFieldRoot defaultValue="initial">
            <TextFieldTextarea placeholder="Placeholder" />
          </TextFieldRoot>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveValue("initial");
        expect(input).toHaveAttribute("placeholder", "Placeholder");
      });

      it("should merge props from Field context", () => {
        const { getByRole } = setUp(
          <Field.Root required invalid disabled name="test-field">
            <TextFieldRoot>
              <TextFieldTextarea />
            </TextFieldRoot>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("name", "test-field");
        expect(input).toHaveAttribute("aria-required", "true");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toBeDisabled();
      });

      it("should prioritize direct props over context props", () => {
        const { getByRole } = setUp(
          <Field.Root disabled name="field-name">
            <TextFieldRoot>
              <TextFieldTextarea disabled={false} name="direct-name" />
            </TextFieldRoot>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("name", "direct-name");
        expect(input).not.toBeDisabled();
      });

      it("should merge data attributes", () => {
        const { getByRole } = setUp(
          <Field.Root disabled readOnly invalid>
            <TextFieldRoot>
              <TextFieldTextarea data-custom="value" />
            </TextFieldRoot>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("data-disabled", "");
        expect(input).toHaveAttribute("data-readonly", "");
        expect(input).toHaveAttribute("data-invalid", "");
        expect(input).toHaveAttribute("data-custom", "value");
      });

      it("should handle uncontrolled modes", async () => {
        const handleChange = vi.fn();
        const { getByRole, user } = setUp(
          <TextFieldRoot onValueChange={handleChange}>
            <TextFieldTextarea />
          </TextFieldRoot>,
        );

        const input = getByRole("textbox");

        await user.type(input, "test");
        expect(handleChange).toHaveBeenCalledWith("test");
      });

      it("should handle controlled modes", async () => {
        function Controlled() {
          const [value, setValue] = React.useState("");

          return (
            <TextFieldRoot value={value} onValueChange={setValue}>
              <TextFieldTextarea />
            </TextFieldRoot>
          );
        }

        const { getByRole, user } = setUp(<Controlled />);

        const input = getByRole("textbox");

        await user.type(input, "test");
        expect(input).toHaveValue("test");
      });
    });

    describe("Prefix and Suffix components", () => {
      it("should apply state props to affix elements", () => {
        const { getByTestId } = setUp(
          <TextFieldRoot disabled invalid readOnly>
            <TextFieldPrefixText>Prefix</TextFieldPrefixText>
            <TextFieldPrefixIcon svg={<svg data-testid="prefix-icon" />} />
            <TextFieldInput />
            <TextFieldSuffixIcon svg={<svg data-testid="suffix-icon" />} />
            <TextFieldSuffixText>Suffix</TextFieldSuffixText>
          </TextFieldRoot>,
        );

        const prefixIcon = getByTestId("prefix-icon");
        expect(prefixIcon).toHaveAttribute("data-disabled", "");
        expect(prefixIcon).toHaveAttribute("data-invalid", "");
        expect(prefixIcon).toHaveAttribute("data-readonly", "");

        const suffixIcon = getByTestId("suffix-icon");
        expect(suffixIcon).toHaveAttribute("data-disabled", "");
        expect(suffixIcon).toHaveAttribute("data-invalid", "");
        expect(suffixIcon).toHaveAttribute("data-readonly", "");
      });
    });

    describe("Complex prop merging scenarios", () => {
      // this is possible, but you shouldn't be doing this
      it("should handle nested Field and TextField contexts", () => {
        const { getByRole } = setUp(
          <Field.Root required name="field">
            <Field.Label>Label</Field.Label>
            <TextFieldRoot invalid>
              <TextFieldInput />
            </TextFieldRoot>
            <Field.Description>Description</Field.Description>
          </Field.Root>,
        );

        const input = getByRole("textbox");
        expect(input).toHaveAttribute("name", "field");
        expect(input).toHaveAttribute("aria-required", "true");
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute("aria-describedby");
      });
    });
  });
});
