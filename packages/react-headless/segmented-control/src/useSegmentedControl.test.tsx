import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";

import type { ReactElement } from "react";
import * as React from "react";

import {
  SegmentedControlRoot as Root,
  SegmentedControlItem as Segment,
  SegmentedControlItemHiddenInput as HiddenInput,
  type SegmentedControlRootProps,
  type SegmentedControlItemProps,
} from "./SegmentedControl";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function setUpAnimationFrameScheduler() {
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextFrameId = 0;

  spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    const frameId = ++nextFrameId;
    callbacks.set(frameId, callback);
    return frameId;
  });
  spyOn(window, "cancelAnimationFrame").mockImplementation((frameId) => {
    callbacks.delete(frameId);
  });

  return {
    flushNext() {
      const entry = callbacks.entries().next().value;
      if (!entry) return;

      const [frameId, callback] = entry;
      callbacks.delete(frameId);
      callback(0);
    },
    get pendingCount() {
      return callbacks.size;
    },
  };
}

afterEach(() => {
  mock.restore();
});

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

    it("enables indicator transition after the initial selected position is rendered", async () => {
      const animationFrames = setUpAnimationFrameScheduler();
      const { user, getByRole, getByTestId } = setUp(
        <SegmentedControl defaultValue={values[1]}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );
      const root = getByRole("radiogroup");

      expect(root.style.getPropertyValue("--segment-index")).toBe("1");
      expect(root.style.getPropertyValue("--segment-count")).toBe("3");
      expect(root.hasAttribute("data-indicator-transition")).toBe(false);

      act(() => animationFrames.flushNext());

      expect(root.hasAttribute("data-indicator-transition")).toBe(true);

      await user.click(getByTestId(values[2]));

      expect(root.style.getPropertyValue("--segment-index")).toBe("2");
      expect(root.hasAttribute("data-indicator-transition")).toBe(true);
    });

    it("cancels the pending indicator transition frame when unmounted", () => {
      const animationFrames = setUpAnimationFrameScheduler();
      const { unmount } = setUp(
        <SegmentedControl defaultValue={values[1]}>
          {values.map((value) => (
            <SegmentedControlItem key={value} value={value} />
          ))}
        </SegmentedControl>,
      );

      expect(animationFrames.pendingCount).toBe(1);

      unmount();

      expect(animationFrames.pendingCount).toBe(0);
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
      const handleValueChange = mock(() => {});

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
      const handleValueChange = mock(() => {});

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
