import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as React from "react";
import type { ReactElement } from "react";

import {
  NumberFieldDecrementButton,
  NumberFieldIncrementButton,
  NumberFieldInput,
  NumberFieldRoot,
  type NumberFieldRootProps,
} from "./NumberField";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function NumberField(props: NumberFieldRootProps) {
  return (
    <NumberFieldRoot {...props}>
      <NumberFieldInput />
      <NumberFieldIncrementButton>+</NumberFieldIncrementButton>
      <NumberFieldDecrementButton>-</NumberFieldDecrementButton>
    </NumberFieldRoot>
  );
}

describe("useNumberField", () => {
  it("should render the number field correctly", () => {
    const { getByRole } = setUp(<NumberField />);
    const input = getByRole("spinbutton");

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("should render with defaultValue", () => {
    const { getByRole } = setUp(<NumberField defaultValue={42} />);
    const input = getByRole("spinbutton");

    expect(input).toHaveValue("42");
  });

  it("should update value on input", async () => {
    const { getByRole, user } = setUp(<NumberField />);
    const input = getByRole("spinbutton") as HTMLInputElement;

    await user.type(input, "123");
    expect(input).toHaveValue("123");
  });

  it("should call onValueChange when value changes", async () => {
    const handleValueChange = vi.fn();
    const { getByRole, user } = setUp(<NumberField onValueChange={handleValueChange} />);
    const input = getByRole("spinbutton") as HTMLInputElement;

    await user.type(input, "42");
    await user.tab(); // blur to commit value

    expect(handleValueChange).toHaveBeenCalledWith(42);
  });

  it("should increment value when increment button is clicked", async () => {
    const { getByRole, user } = setUp(<NumberField defaultValue={5} />);
    const input = getByRole("spinbutton") as HTMLInputElement;
    const incrementButton = getByRole("button", { name: "Increment" });

    await user.click(incrementButton);

    expect(input).toHaveValue("6");
  });

  it("should decrement value when decrement button is clicked", async () => {
    const { getByRole, user } = setUp(<NumberField defaultValue={5} />);
    const input = getByRole("spinbutton") as HTMLInputElement;
    const decrementButton = getByRole("button", { name: "Decrement" });

    await user.click(decrementButton);

    expect(input).toHaveValue("4");
  });

  it("should increment with custom step", async () => {
    const { getByRole, user } = setUp(<NumberField defaultValue={0} step={5} />);
    const input = getByRole("spinbutton") as HTMLInputElement;
    const incrementButton = getByRole("button", { name: "Increment" });

    await user.click(incrementButton);

    expect(input).toHaveValue("5");
  });

  it("should respect min constraint", async () => {
    const { getByRole, user } = setUp(<NumberField defaultValue={5} min={0} />);
    const input = getByRole("spinbutton") as HTMLInputElement;

    await user.clear(input);
    await user.type(input, "-10");
    await user.tab(); // blur to commit

    expect(input).toHaveValue("0");
  });

  it("should respect max constraint", async () => {
    const { getByRole, user } = setUp(<NumberField defaultValue={5} max={10} />);
    const input = getByRole("spinbutton") as HTMLInputElement;

    await user.clear(input);
    await user.type(input, "100");
    await user.tab(); // blur to commit

    expect(input).toHaveValue("10");
  });

  it("should disable increment button at max value", () => {
    const { getByRole } = setUp(<NumberField value={10} max={10} />);
    const incrementButton = getByRole("button", { name: "Increment" });

    expect(incrementButton).toBeDisabled();
  });

  it("should disable decrement button at min value", () => {
    const { getByRole } = setUp(<NumberField value={0} min={0} />);
    const decrementButton = getByRole("button", { name: "Decrement" });

    expect(decrementButton).toBeDisabled();
  });

  describe("keyboard navigation", () => {
    it("should increment on ArrowUp", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={5} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.click(input);
      await user.keyboard("{ArrowUp}");

      expect(input).toHaveValue("6");
    });

    it("should decrement on ArrowDown", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={5} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.click(input);
      await user.keyboard("{ArrowDown}");

      expect(input).toHaveValue("4");
    });

    it("should jump to min on Home key", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={50} min={0} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.click(input);
      await user.keyboard("{Home}");

      expect(input).toHaveValue("0");
    });

    it("should jump to max on End key", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={50} max={100} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.click(input);
      await user.keyboard("{End}");

      expect(input).toHaveValue("100");
    });
  });

  describe("disabled prop test", () => {
    it("should be disabled when disabled prop is true", () => {
      const { getByRole } = setUp(<NumberField disabled={true} />);
      const input = getByRole("spinbutton");

      expect(input).toBeDisabled();
    });

    it("should not increment when disabled", async () => {
      const { getByRole, user } = setUp(<NumberField disabled={true} defaultValue={5} />);
      const input = getByRole("spinbutton") as HTMLInputElement;
      const incrementButton = getByRole("button", { name: "Increment" });

      await user.click(incrementButton);

      expect(input).toHaveValue("5");
    });

    it("should not respond to keyboard when disabled", async () => {
      const { getByRole, user } = setUp(<NumberField disabled={true} defaultValue={5} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.click(input);
      await user.keyboard("{ArrowUp}");

      expect(input).toHaveValue("5");
    });

    it("should not call onValueChange when disabled", async () => {
      const handleValueChange = vi.fn();
      const { getByRole, user } = setUp(
        <NumberField disabled={true} onValueChange={handleValueChange} />,
      );
      const incrementButton = getByRole("button", { name: "Increment" });

      await user.click(incrementButton);

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe("readOnly prop test", () => {
    it("should not increment when readOnly", async () => {
      const { getByRole, user } = setUp(<NumberField readOnly={true} defaultValue={5} />);
      const input = getByRole("spinbutton") as HTMLInputElement;
      const incrementButton = getByRole("button", { name: "Increment" });

      await user.click(incrementButton);

      expect(input).toHaveValue("5");
    });

    it("should not respond to keyboard when readOnly", async () => {
      const { getByRole, user } = setUp(<NumberField readOnly={true} defaultValue={5} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.click(input);
      await user.keyboard("{ArrowUp}");

      expect(input).toHaveValue("5");
    });
  });

  describe("decimal values", () => {
    it("should handle decimal step values", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={0} step={0.1} />);
      const input = getByRole("spinbutton") as HTMLInputElement;
      const incrementButton = getByRole("button", { name: "Increment" });

      await user.click(incrementButton);

      expect(input).toHaveValue("0.1");
    });

    it("should round to step precision", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={0} step={0.01} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.clear(input);
      await user.type(input, "1.234567");
      await user.tab(); // blur to commit

      // Should round to 2 decimal places based on step
      expect(input).toHaveValue("1.23");
    });
  });

  describe("controlled component", () => {
    it("should work as controlled component", async () => {
      function ControlledNumberField() {
        const [value, setValue] = React.useState<number | undefined>(5);
        return <NumberField value={value} onValueChange={setValue} />;
      }

      const { getByRole, user } = setUp(<ControlledNumberField />);
      const input = getByRole("spinbutton") as HTMLInputElement;
      const incrementButton = getByRole("button", { name: "Increment" });

      expect(input).toHaveValue("5");

      await user.click(incrementButton);

      expect(input).toHaveValue("6");
    });
  });

  describe("hover and focus states", () => {
    it("should update hover state correctly", async () => {
      const { getByRole, user } = setUp(<NumberField />);
      const input = getByRole("spinbutton");

      await user.hover(input);
      expect(input).toHaveAttribute("data-hover");

      await user.unhover(input);
      expect(input).not.toHaveAttribute("data-hover");
    });

    it("should update focus state correctly", async () => {
      const { getByRole, user } = setUp(<NumberField />);
      const input = getByRole("spinbutton");

      await user.click(input);
      expect(input).toHaveAttribute("data-focus");

      await user.tab();
      expect(input).not.toHaveAttribute("data-focus");
    });
  });

  describe("empty value handling", () => {
    it("should handle empty input", async () => {
      const { getByRole, user } = setUp(<NumberField defaultValue={42} />);
      const input = getByRole("spinbutton") as HTMLInputElement;

      await user.clear(input);

      expect(input).toHaveValue("");
      expect(input).toHaveAttribute("data-empty");
    });

    it("should increment from undefined to 0 + step", async () => {
      const { getByRole, user } = setUp(<NumberField />);
      const input = getByRole("spinbutton") as HTMLInputElement;
      const incrementButton = getByRole("button", { name: "Increment" });

      await user.click(incrementButton);

      expect(input).toHaveValue("1");
    });
  });

  describe("ARIA attributes", () => {
    it("should have correct ARIA attributes", () => {
      const { getByRole } = setUp(<NumberField min={0} max={100} value={50} />);
      const input = getByRole("spinbutton");

      expect(input).toHaveAttribute("role", "spinbutton");
      expect(input).toHaveAttribute("aria-valuemin", "0");
      expect(input).toHaveAttribute("aria-valuemax", "100");
      expect(input).toHaveAttribute("aria-valuenow", "50");
    });

    it("should have aria-invalid when invalid", () => {
      const { getByRole } = setUp(<NumberField invalid={true} />);
      const input = getByRole("spinbutton");

      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should have aria-required when required", () => {
      const { getByRole } = setUp(<NumberField required={true} />);
      const input = getByRole("spinbutton");

      expect(input).toHaveAttribute("aria-required", "true");
    });
  });
});

