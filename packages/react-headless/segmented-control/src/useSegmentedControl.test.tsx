import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import {
  SegmentedControlRoot as Root,
  SegmentedControlItem as Segment,
  SegmentedControlItemHiddenInput as HiddenInput,
  type SegmentedControlRootProps,
  type SegmentedControlItemProps,
} from "./SegmentedControl";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function SegmentedControl({ children, ...otherProps }: SegmentedControlRootProps) {
  return (
    <Root {...otherProps}>
      {children}
      <div />
    </Root>
  );
}

function SegmentedControlItem({ children, ...otherProps }: SegmentedControlItemProps) {
  return (
    <Segment {...otherProps}>
      <HiddenInput data-testid={otherProps.value} />
      <span>{children}</span>
    </Segment>
  );
}

describe("useSegmentedControl", () => {
  global.CSS = {
    // @ts-expect-error
    supports: (_k, _v) => true,
  };

  const values = ["first", "second", "third"];

  describe("uncontrolled", () => {
    it("should render correctly", () => {
      const { getByTestId } = setUp(
        <SegmentedControl defaultValue={values[0]}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      for (const value of values) {
        const input = getByTestId(value);
        expect(input).toBeInTheDocument();
      }
    });

    it("should change value on click", async () => {
      const { user, getByTestId } = setUp(
        <SegmentedControl defaultValue={values[0]}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      const firstControl = getByTestId(values[0]);
      const secondControl = getByTestId(values[1]);

      expect(firstControl).toBeChecked();
      expect(secondControl).not.toBeChecked();

      await user.click(secondControl);

      expect(firstControl).not.toBeChecked();
      expect(secondControl).toBeChecked();
    });

    it("should disabled when disabled prop is true", async () => {
      const { getByTestId } = setUp(
        <SegmentedControl disabled defaultValue={values[0]}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      for (const value of values) {
        const input = getByTestId(value);
        expect(input).toHaveAttribute("disabled");
      }
    });

    it("should not change value on click when disabled", async () => {
      const { user, getByTestId } = setUp(
        <SegmentedControl disabled defaultValue={values[0]}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      const firstControl = getByTestId(values[0]);
      const secondControl = getByTestId(values[1]);

      expect(firstControl).toBeChecked();
      expect(secondControl).not.toBeChecked();

      await user.click(secondControl);

      expect(firstControl).toBeChecked();
      expect(secondControl).not.toBeChecked();
    });
  });

  describe("controlled test", () => {
    it("should render correctly with controlled value", () => {
      const ControlledSegmentedControl = () => {
        const [value, setValue] = React.useState(values[2]);

        return (
          <SegmentedControl value={value} onValueChange={setValue}>
            {values.map((value) => (
              <SegmentedControlItem key={value} value={value} />
            ))}
          </SegmentedControl>
        );
      };

      const { getByTestId } = setUp(<ControlledSegmentedControl />);

      const thirdControl = getByTestId(values[2]);
      expect(thirdControl).toBeChecked();
    });

    it("should onValueChange be called", async () => {
      const handleValueChange = vi.fn();

      const { user, getByTestId } = setUp(
        <SegmentedControl value={values[0]} onValueChange={handleValueChange}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      const secondControl = getByTestId(values[1]);

      await user.click(secondControl);

      expect(handleValueChange).toHaveBeenCalledWith(values[1]);
    });

    it("should change value on click with controlled value", async () => {
      const ControlledSegmentedControl = () => {
        const [value, setValue] = React.useState(values[1]);

        return (
          <SegmentedControl value={value} onValueChange={setValue}>
            {values.map((value) => (
              <SegmentedControlItem key={value} value={value} />
            ))}
          </SegmentedControl>
        );
      };

      const { user, getByTestId } = setUp(<ControlledSegmentedControl />);

      const secondControl = getByTestId(values[1]);
      const thirdControl = getByTestId(values[2]);

      expect(secondControl).toBeChecked();
      expect(thirdControl).not.toBeChecked();

      await user.click(thirdControl);

      expect(secondControl).not.toBeChecked();
      expect(thirdControl).toBeChecked();
    });

    it("should not call onValueChange when disabled", async () => {
      const handleValueChange = vi.fn();

      const { user, getByTestId } = setUp(
        <SegmentedControl disabled value={values[0]} onValueChange={handleValueChange}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      const secondControl = getByTestId(values[1]);

      await user.click(secondControl);

      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });
});
