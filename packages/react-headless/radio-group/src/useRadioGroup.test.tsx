import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
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
      <RadioGroupItemHiddenInput />
    </RadioGroupItem>
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
});
