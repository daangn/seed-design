import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement, ReactNode } from "react";
import * as React from "react";

import {
  RadioGroupDescription,
  RadioGroupErrorMessage,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupLabel,
  RadioGroupRoot,
  type RadioGroupItemProps,
  type RadioGroupRootProps,
} from "./RadioGroup";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function RadioGroup(props: RadioGroupRootProps) {
  return <RadioGroupRoot {...props} />;
}

function Radio(props: RadioGroupItemProps) {
  return (
    <RadioGroupItem {...props}>
      <RadioGroupItemControl data-testid={props.value} />
      <RadioGroupItemHiddenInput data-testid={`${props.value}-input`} />
    </RadioGroupItem>
  );
}

interface TestRadioGroupProps extends RadioGroupRootProps {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  children?: ReactNode;
}

function TestRadioGroup({
  label,
  description,
  errorMessage,
  children,
  ...rootProps
}: TestRadioGroupProps) {
  return (
    <RadioGroupRoot data-testid="radio-group-root" {...rootProps}>
      {label && <RadioGroupLabel data-testid="radio-group-label">{label}</RadioGroupLabel>}
      {children}
      {description && (
        <RadioGroupDescription data-testid="radio-group-description">
          {description}
        </RadioGroupDescription>
      )}
      {errorMessage && (
        <RadioGroupErrorMessage data-testid="radio-group-error-message">
          {errorMessage}
        </RadioGroupErrorMessage>
      )}
    </RadioGroupRoot>
  );
}

function ControlledRadioGroup(
  props: React.PropsWithChildren<Omit<RadioGroupRootProps, "value" | "onValueChange">>,
) {
  const { defaultValue } = props;
  const [value, setValue] = React.useState(defaultValue);
  const mockSetValue = vi.fn((value) => setValue(value));

  return <RadioGroup value={value} onValueChange={mockSetValue} {...props} />;
}

describe("useRadioGroup", () => {
  global.CSS = {
    // @ts-expect-error
    supports: (_k, _v) => true,
  };

  const FIRST_VALUE = "first";
  const SECOND_VALUE = "second";
  const THIRD_VALUE = "third";
  const values = [FIRST_VALUE, SECOND_VALUE, THIRD_VALUE];

  it("should render correctly", () => {
    const { getByTestId } = setUp(
      <RadioGroup>
        {values.map((value) => (
          <Radio key={value} value={value} />
        ))}
      </RadioGroup>,
    );

    for (const value of values) {
      const control = getByTestId(value);
      expect(control).toBeInTheDocument();
    }
  });

  it("should change value on click", async () => {
    const { user, getByTestId } = setUp(
      <RadioGroup>
        {values.map((value) => (
          <Radio key={value} value={value} />
        ))}
      </RadioGroup>,
    );

    const firstControl = getByTestId(FIRST_VALUE);
    const secondControl = getByTestId(SECOND_VALUE);

    await user.click(secondControl);

    expect(firstControl).not.toHaveAttribute("data-checked");
    expect(secondControl).toHaveAttribute("data-checked");
  });

  it("should onValueChange be called", async () => {
    const handleValueChange = vi.fn();

    const { user, getByTestId } = setUp(
      <RadioGroup onValueChange={handleValueChange}>
        {values.map((value) => (
          <Radio key={value} value={value} />
        ))}
      </RadioGroup>,
    );

    const secondControl = getByTestId(SECOND_VALUE);

    await user.click(secondControl);

    expect(handleValueChange).toHaveBeenCalledWith(SECOND_VALUE);
  });

  describe("disabled prop test", () => {
    it("should disabled when disabled prop is true", async () => {
      const { getByTestId } = setUp(
        <RadioGroup disabled>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      for (const value of values) {
        const control = getByTestId(value);
        expect(control).toHaveAttribute("data-disabled");
      }
    });

    it("should not change value on click when disabled", async () => {
      const { user, getByTestId } = setUp(
        <RadioGroup disabled value={FIRST_VALUE}>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      const firstControl = getByTestId(FIRST_VALUE);
      const secondControl = getByTestId(SECOND_VALUE);

      await user.click(secondControl);

      expect(firstControl).toHaveAttribute("data-checked");
      expect(secondControl).not.toHaveAttribute("data-checked");
    });

    it("should not call onValueChange when disabled", async () => {
      const handleValueChange = vi.fn();

      const { user, getByTestId } = setUp(
        <RadioGroup disabled onValueChange={handleValueChange}>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      const secondControl = getByTestId(SECOND_VALUE);

      await user.click(secondControl);

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe("controlled test", () => {
    it("should render correctly with controlled value", () => {
      const { getByTestId } = setUp(
        <ControlledRadioGroup defaultValue={SECOND_VALUE}>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </ControlledRadioGroup>,
      );

      const secondControl = getByTestId(SECOND_VALUE);
      expect(secondControl).toHaveAttribute("data-checked");
    });

    it("should change value on click with controlled value", async () => {
      const { user, getByTestId } = setUp(
        <ControlledRadioGroup>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </ControlledRadioGroup>,
      );

      const firstControl = getByTestId(FIRST_VALUE);
      const secondControl = getByTestId(SECOND_VALUE);

      await user.click(secondControl);

      expect(firstControl).not.toHaveAttribute("data-checked");
      expect(secondControl).toHaveAttribute("data-checked");
    });
  });

  describe("invalid prop test", () => {
    it("should have data-invalid when invalid prop is true", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup invalid>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      expect(root).toHaveAttribute("data-invalid");
    });

    it("should have aria-invalid on root when invalid", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup invalid>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      expect(root).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("label, description, and error message", () => {
    it("should render label as div element", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup label="Test Label">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const label = getByTestId("radio-group-label");
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("DIV");
    });

    it("should render description as span element", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup description="Test Description">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const description = getByTestId("radio-group-description");
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe("SPAN");
    });

    it("should render error message as div element", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup errorMessage="Test Error">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const errorMessage = getByTestId("radio-group-error-message");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage.tagName).toBe("DIV");
    });
  });

  describe("aria attributes", () => {
    it("should have role=radiogroup on root", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      expect(root).toHaveAttribute("role", "radiogroup");
    });

    it("should connect label to root with aria-labelledby", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup label="Select Option">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      const label = getByTestId("radio-group-label");

      expect(label).toHaveAttribute("id");
      expect(root).toHaveAttribute("aria-labelledby", label.getAttribute("id"));
    });

    it("should connect description to root with aria-describedby", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup description="Choose one option">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      const description = getByTestId("radio-group-description");

      expect(description).toHaveAttribute("id");
      expect(root).toHaveAttribute("aria-describedby");
      expect(root.getAttribute("aria-describedby")?.split(" ")).toContain(
        description.getAttribute("id"),
      );
    });

    it("should connect error message to root with aria-describedby", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup errorMessage="Please select an option">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      const errorMessage = getByTestId("radio-group-error-message");

      expect(errorMessage).toHaveAttribute("id");
      expect(root).toHaveAttribute("aria-describedby");
      expect(root.getAttribute("aria-describedby")?.split(" ")).toContain(
        errorMessage.getAttribute("id"),
      );
    });

    it("should combine description and error in aria-describedby", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup description="Choose one option" errorMessage="Selection required">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      const description = getByTestId("radio-group-description");
      const errorMessage = getByTestId("radio-group-error-message");

      const ariaDescribedBy = root.getAttribute("aria-describedby");
      expect(ariaDescribedBy?.split(" ")).toContain(description.getAttribute("id"));
      expect(ariaDescribedBy?.split(" ")).toContain(errorMessage.getAttribute("id"));
    });

    it("should not have aria-labelledby when label is not rendered", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      expect(root).not.toHaveAttribute("aria-labelledby");
    });

    it("should not have aria-describedby when neither description nor error is rendered", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      expect(root).not.toHaveAttribute("aria-describedby");
    });

    it("should set aria-live on error message", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup errorMessage="Error">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const errorMessage = getByTestId("radio-group-error-message");
      expect(errorMessage).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("ID generation", () => {
    it("should generate unique id", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup label="Label">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const label = getByTestId("radio-group-label");
      expect(label.id).toMatch(/^fieldset:.+:label$/);
    });
  });

  describe("name and form prop", () => {
    it("should use provided name prop for all radio inputs", () => {
      const { getByTestId } = setUp(
        <RadioGroup name="custom-name">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      for (const value of values) {
        const input = getByTestId(`${value}-input`);
        expect(input).toHaveAttribute("name", "custom-name");
      }
    });

    it("should fallback to generated id when name is not provided", () => {
      const { getByTestId } = setUp(
        <RadioGroup>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      const firstInput = getByTestId(`${FIRST_VALUE}-input`);
      const secondInput = getByTestId(`${SECOND_VALUE}-input`);

      // All inputs should have the same name (generated id)
      expect(firstInput).toHaveAttribute("name");
      expect(firstInput.getAttribute("name")).toBe(secondInput.getAttribute("name"));
    });

    it("should use provided form prop for all radio inputs", () => {
      const { getByTestId } = setUp(
        <RadioGroup form="my-form">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      for (const value of values) {
        const input = getByTestId(`${value}-input`);
        expect(input).toHaveAttribute("form", "my-form");
      }
    });

    it("should not have form attribute when form prop is not provided", () => {
      const { getByTestId } = setUp(
        <RadioGroup>
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </RadioGroup>,
      );

      for (const value of values) {
        const input = getByTestId(`${value}-input`);
        expect(input).not.toHaveAttribute("form");
      }
    });
  });

  describe("data attributes propagation", () => {
    it("should propagate data-disabled to label, description, and error message", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup disabled label="Label" description="Desc" errorMessage="Error">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      const label = getByTestId("radio-group-label");
      const description = getByTestId("radio-group-description");
      const errorMessage = getByTestId("radio-group-error-message");

      [root, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-disabled");
      });
    });

    it("should propagate data-invalid to label, description, and error message", () => {
      const { getByTestId } = setUp(
        <TestRadioGroup invalid label="Label" description="Desc" errorMessage="Error">
          {values.map((value) => (
            <Radio key={value} value={value} />
          ))}
        </TestRadioGroup>,
      );

      const root = getByTestId("radio-group-root");
      const label = getByTestId("radio-group-label");
      const description = getByTestId("radio-group-description");
      const errorMessage = getByTestId("radio-group-error-message");

      [root, label, description, errorMessage].forEach((element) => {
        expect(element).toHaveAttribute("data-invalid");
      });
    });
  });
});
