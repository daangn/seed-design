import "@testing-library/jest-dom/vitest";
import { cleanup, render, type RenderResult } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import type { UseSliderProps } from "./useSlider";
import {
  SliderRoot,
  SliderRange,
  SliderThumb,
  SliderHiddenInput,
  SliderValueIndicatorRoot,
  SliderValueIndicatorLabel,
  type SliderRootProps,
} from "./Slider";

afterEach(cleanup);

function setUp(jsx: React.ReactElement): { user: UserEvent } & RenderResult {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

// Test wrapper component using actual Slider components
interface SliderProps extends Omit<SliderRootProps, "children"> {
  "data-testid"?: string;
}

const Slider = ({ "data-testid": testId = "slider", ...props }: SliderProps) => {
  return (
    <SliderRoot {...props} data-testid={`${testId}-root`}>
      <div data-testid={`${testId}-track`}>
        <SliderRange data-testid={`${testId}-range`} />
      </div>
      {(props.values || props.defaultValues || [0]).map((_, index) => (
        <React.Fragment key={index}>
          <SliderThumb thumbIndex={index} data-testid={`${testId}-thumb-${index}`} />
          <SliderHiddenInput thumbIndex={index} data-testid={`${testId}-hidden-input-${index}`} />
        </React.Fragment>
      ))}
    </SliderRoot>
  );
};

// Controlled slider for controlled mode tests
interface ControlledSliderProps extends Omit<UseSliderProps, "values" | "onValuesChange"> {
  "data-testid"?: string;
}

const ControlledSlider = (props: ControlledSliderProps) => {
  const [values, setValues] = React.useState(props.defaultValues || [0]);
  const handleValuesChange = (newValues: number[]) => {
    setValues(newValues);
  };

  return (
    <Slider
      {...props}
      values={values}
      onValuesChange={handleValuesChange}
      data-testid={props["data-testid"]}
    />
  );
};

describe("useSlider", () => {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();

  describe("Basic Rendering & Initialization", () => {
    it("renders single thumb with default values", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toBeInTheDocument();
      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveAttribute("role", "slider");
    });

    it("renders multiple thumbs", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[0, 50, 100]} />);

      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");
      const thumb2 = getByTestId("slider-thumb-2");

      expect(thumb0).toBeInTheDocument();
      expect(thumb1).toBeInTheDocument();
      expect(thumb2).toBeInTheDocument();
    });

    it("renders with custom min/max/step", () => {
      const { getByTestId } = setUp(<Slider min={10} max={200} step={5} defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-valuemin", "10");
      expect(thumb).toHaveAttribute("aria-valuemax", "200");
      expect(thumb).toHaveAttribute("aria-valuenow", "50");
    });

    it("sets disabled state attributes", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} disabled />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toHaveAttribute("data-disabled");
      expect(thumb).toHaveAttribute("aria-disabled", "true");
      expect(thumb).toHaveAttribute("tabindex", "-1");
    });

    it("sets readonly state attributes", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} readOnly />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toHaveAttribute("data-readonly");
      expect(thumb).toHaveAttribute("aria-readonly", "true");
    });

    it("sets invalid state attributes", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} invalid />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toHaveAttribute("data-invalid");
      expect(thumb).toHaveAttribute("aria-invalid", "true");
    });

    it("sets correct ARIA attributes on thumbs", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[25]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("role", "slider");
      expect(thumb).toHaveAttribute("aria-valuemin", "0");
      expect(thumb).toHaveAttribute("aria-valuemax", "100");
      expect(thumb).toHaveAttribute("aria-valuenow", "25");

      // XXX: enable this test when vertical sliders are supported: sliders have implicit aria-orientation of horizontal
      // expect(thumb).toHaveAttribute("aria-orientation", "horizontal");

      expect(thumb).toHaveAttribute("tabindex", "0");
    });

    it("uses custom aria-label via getAriaLabel", () => {
      const { getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          defaultValues={[0, 100]}
          getAriaLabel={(index) => `Thumb ${index + 1}`}
        />,
      );

      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      expect(thumb0).toHaveAttribute("aria-label", "Thumb 1");
      expect(thumb1).toHaveAttribute("aria-label", "Thumb 2");
    });

    it("uses custom aria-labelledby via getAriaLabelledby", () => {
      const { getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          defaultValues={[0, 100]}
          getAriaLabelledby={(index) => `label-${index}`}
        />,
      );

      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      expect(thumb0).toHaveAttribute("aria-labelledby", "label-0");
      expect(thumb1).toHaveAttribute("aria-labelledby", "label-1");
    });

    it("uses custom aria-valuetext via getAriaValuetext", () => {
      const { getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} getAriaValuetext={(value) => `${value}%`} />,
      );

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-valuetext", "50%");
    });

    it("creates hidden inputs with correct attributes", () => {
      const { getByTestId } = setUp(
        <Slider min={0} max={100} name="volume" defaultValues={[50]} />,
      );

      const hiddenInput = getByTestId("slider-hidden-input-0") as HTMLInputElement;

      expect(hiddenInput).toHaveAttribute("type", "hidden");
      expect(hiddenInput).toHaveAttribute("name", "volume");
      expect(hiddenInput.value).toBe("50");
    });
  });

  describe("Pointer Interactions - Click on Track", () => {
    it("sets active state on pointerdown on track", { timeout: 10000 }, async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const root = getByTestId("slider-root");

      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 0 }, keys: "[MouseLeft>]" },
      ]);

      expect(root).toHaveAttribute("data-active");
    });

    it("changes value on click (pointerup before delay)", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[0]} onValuesChange={onValuesChange} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      // Mock getBoundingClientRect to return predictable values
      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Click at 50% of the slider
      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      // Value should update immediately (before delay expires)
      expect(thumb).toHaveAttribute("aria-valuenow", "50");
      expect(onValuesChange).toHaveBeenCalled();
    });

    it("calls onValuesCommit on click", async () => {
      const onValuesCommit = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[0]} onValuesCommit={onValuesCommit} />,
      );

      const root = getByTestId("slider-root");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(onValuesCommit).toHaveBeenCalledWith([50]);
    });

    it("snaps value to step on click", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={10} defaultValues={[0]} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Click at 47% (should snap to 50 with step=10)
      await user.pointer([
        { target: root, coords: { clientX: 47, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([
        { target: root, coords: { clientX: 47, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb).toHaveAttribute("aria-valuenow", "50");
    });

    it("should focus closest thumb on track click", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[20, 80]} />);

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Click near thumb1
      await user.pointer([
        { target: root, coords: { clientX: 75, clientY: 5 }, keys: "[MouseLeft]" },
      ]);

      expect(thumb1).toHaveFocus();

      // Click near thumb0
      await user.pointer([
        { target: root, coords: { clientX: 25, clientY: 5 }, keys: "[MouseLeft]" },
      ]);

      expect(thumb0).toHaveFocus();
    });

    it("should change the value of the closest thumb on track click", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[20, 80]} />);

      const root = getByTestId("slider-root");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 75, clientY: 5 }, keys: "[MouseLeft]" },
      ]);
      expect(root.querySelector('[aria-valuenow="75"]')).toBeInTheDocument();

      await user.pointer([
        { target: root, coords: { clientX: 25, clientY: 5 }, keys: "[MouseLeft]" },
      ]);
      expect(root.querySelector('[aria-valuenow="25"]')).toBeInTheDocument();
    });

    it("should change the value of the closest thumb on track drag", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[20, 80]} />);

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 75, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      await user.pointer([{ target: root, coords: { clientX: 70, clientY: 5 } }]);
      expect(thumb0).toHaveAttribute("aria-valuenow", "20");
      expect(thumb1).toHaveAttribute("aria-valuenow", "70");

      await user.pointer([{ target: root, coords: { clientX: 65, clientY: 5 } }]);
      expect(thumb0).toHaveAttribute("aria-valuenow", "20");
      expect(thumb1).toHaveAttribute("aria-valuenow", "65");

      await user.pointer([
        { target: root, coords: { clientX: 65, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);
      expect(thumb0).toHaveAttribute("aria-valuenow", "20");
      expect(thumb1).toHaveAttribute("aria-valuenow", "65");

      await user.pointer([
        { target: root, coords: { clientX: 10, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      await user.pointer([{ target: root, coords: { clientX: 15, clientY: 5 } }]);
      expect(thumb0).toHaveAttribute("aria-valuenow", "15");
      expect(thumb1).toHaveAttribute("aria-valuenow", "65");

      await user.pointer([
        { target: root, coords: { clientX: 20, clientY: 5 }, keys: "[MouseLeft]" },
      ]);
      expect(thumb0).toHaveAttribute("aria-valuenow", "20");
      expect(thumb1).toHaveAttribute("aria-valuenow", "65");

      await user.pointer([
        { target: root, coords: { clientX: 20, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);
      expect(thumb0).toHaveAttribute("aria-valuenow", "20");
      expect(thumb1).toHaveAttribute("aria-valuenow", "65");
    });
  });

  describe("Pointer Interactions - Drag Thumb", () => {
    it("sets active state on pointerdown on thumb", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(root).toHaveAttribute("data-active");
    });

    it("sets dragging state during drag", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      expect(root).toHaveAttribute("data-dragging");

      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);
      expect(root).toHaveAttribute("data-dragging");

      await user.pointer([
        { target: root, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);
      expect(root).not.toHaveAttribute("data-dragging");
    });

    it("updates value continuously during pointermove", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      onValuesChange.mockClear();

      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);
      expect(onValuesChange).toHaveBeenCalled();

      await user.pointer([{ target: root, coords: { clientX: 70, clientY: 5 } }]);
      expect(onValuesChange).toHaveBeenCalledTimes(2);
    });

    it("calls onValuesCommit only once on drag end", async () => {
      const onValuesCommit = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesCommit={onValuesCommit} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);
      await user.pointer([{ target: root, coords: { clientX: 70, clientY: 5 } }]);

      expect(onValuesCommit).not.toHaveBeenCalled();

      await user.pointer([
        { target: root, coords: { clientX: 70, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(onValuesCommit).toHaveBeenCalledTimes(1);
      expect(onValuesCommit).toHaveBeenCalledWith([70]);
    });

    it("focuses thumb on pointerdown", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(thumb).toHaveFocus();
    });

    it("selects the right thumb after crossing over another", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[30, 70]} />);

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Drag thumb0 past thumb1
      await user.pointer([
        { target: thumb0, coords: { clientX: 30, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 80, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 80, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb0).toHaveAttribute("aria-valuenow", "70");
      expect(thumb1).toHaveAttribute("aria-valuenow", "80");

      const thumb0New = getByTestId("slider-thumb-0");
      const thumb1New = getByTestId("slider-thumb-1");

      await user.pointer([
        { target: thumb0New, coords: { clientX: 70, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 10, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 10, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb0New).toHaveAttribute("aria-valuenow", "10");
      expect(thumb1New).toHaveAttribute("aria-valuenow", "80");
    });
  });

  describe("Pointer Interactions - Drag Delay Behavior", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("starts drag immediately if pointermove before delay", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} dragStartDelayInMilliseconds={150} />,
      );

      const root = getByTestId("slider-root");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Move immediately (before 150ms delay)
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);

      expect(root).toHaveAttribute("data-dragging");
    });

    it("treats as click if pointerup before delay expires", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          defaultValues={[0]}
          dragStartDelayInMilliseconds={150}
          onValuesChange={onValuesChange}
        />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Release before 150ms
      vi.advanceTimersByTime(100);
      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb).toHaveAttribute("aria-valuenow", "50");
      expect(onValuesChange).toHaveBeenCalled();
    });
  });

  describe("Pointer Interactions - State Attributes", () => {
    it("sets data-hover on pointerenter", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const root = getByTestId("slider-root");

      expect(root).not.toHaveAttribute("data-hover");

      await user.hover(root);

      expect(root).toHaveAttribute("data-hover");
    });

    it("removes data-hover on pointerleave", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const root = getByTestId("slider-root");

      await user.hover(root);
      expect(root).toHaveAttribute("data-hover");

      await user.unhover(root);
      expect(root).not.toHaveAttribute("data-hover");
    });

    it("transitions through states: idle → active → dragging → idle (starting from a thumb)", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      // Initial state
      expect(root).not.toHaveAttribute("data-active");
      expect(root).not.toHaveAttribute("data-dragging");

      // Pointerdown → active
      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(root).toHaveAttribute("data-active");
      expect(root).toHaveAttribute("data-dragging");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Pointermove → dragging
      await user.pointer([{ target: thumb, coords: { clientX: 60, clientY: 5 } }]);

      expect(root).toHaveAttribute("data-active");
      expect(root).toHaveAttribute("data-dragging");

      // Pointerup → idle
      await user.pointer([
        { target: thumb, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);
      expect(root).not.toHaveAttribute("data-active");
      expect(root).not.toHaveAttribute("data-dragging");
    });

    it("transitions through states: idle → active → dragging → idle (starting from the track)", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[20]} />);

      const root = getByTestId("slider-root");

      // Initial state
      expect(root).not.toHaveAttribute("data-active");
      expect(root).not.toHaveAttribute("data-dragging");

      // Pointerdown → active
      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(root).toHaveAttribute("data-active");

      // immediately, it's not counted as dragging
      expect(root).not.toHaveAttribute("data-dragging");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Pointermove → dragging
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);

      expect(root).toHaveAttribute("data-active");
      expect(root).toHaveAttribute("data-dragging");

      // Pointerup → idle
      await user.pointer([
        { target: root, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);
      expect(root).not.toHaveAttribute("data-active");
      expect(root).not.toHaveAttribute("data-dragging");
    });
  });

  describe("Keyboard Interactions - Arrow Keys", () => {
    it("increments value on ArrowUp", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });

    it("decrements value on ArrowDown", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowDown}");

      expect(thumb).toHaveAttribute("aria-valuenow", "49");
    });

    it("increments value on ArrowRight in LTR mode", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} dir="ltr" />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowRight}");

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });

    it("decrements value on ArrowLeft in LTR mode", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} dir="ltr" />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowLeft}");

      expect(thumb).toHaveAttribute("aria-valuenow", "49");
    });

    it("reverses ArrowRight/Left in RTL mode", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} dir="rtl" />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      // ArrowRight should decrement in RTL
      await user.keyboard("{ArrowRight}");
      expect(thumb).toHaveAttribute("aria-valuenow", "49");

      // ArrowLeft should increment in RTL
      await user.keyboard("{ArrowLeft}");
      expect(thumb).toHaveAttribute("aria-valuenow", "50");
    });

    it("multiplies movement with Shift+Arrow", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{Shift>}{ArrowUp}{/Shift}");

      expect(thumb).toHaveAttribute("aria-valuenow", "60");
    });

    it("respects step on keyboard interactions", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={10} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "60");
    });

    it("uses allowedValues on ArrowUp", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} allowedValues={[0, 15, 35, 60, 85, 100]} defaultValues={[15]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "35");
    });

    it("uses allowedValues on ArrowDown", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} allowedValues={[0, 15, 35, 60, 85, 100]} defaultValues={[60]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowDown}");

      expect(thumb).toHaveAttribute("aria-valuenow", "35");
    });

    it("uses allowedValues on ArrowRight in LTR mode", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 15, 35, 60, 85, 100]}
          defaultValues={[35]}
          dir="ltr"
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowRight}");

      expect(thumb).toHaveAttribute("aria-valuenow", "60");
    });

    it("uses allowedValues on ArrowLeft in LTR mode", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 15, 35, 60, 85, 100]}
          defaultValues={[60]}
          dir="ltr"
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowLeft}");

      expect(thumb).toHaveAttribute("aria-valuenow", "35");
    });

    it("uses allowedValues on Arrows in LTR mode (moving around)", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={30}
          allowedValues={[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]}
          defaultValues={[2, 7]}
          dir="ltr"
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowRight}");
      expect(thumb).toHaveAttribute("aria-valuenow", "3");

      await user.keyboard("{ArrowLeft}");
      expect(thumb).toHaveAttribute("aria-valuenow", "2");

      await user.keyboard("{ArrowLeft}");
      expect(thumb).toHaveAttribute("aria-valuenow", "2");

      await user.keyboard("{ArrowRight}");
      expect(thumb).toHaveAttribute("aria-valuenow", "3");

      await user.keyboard("{ArrowRight}");
      expect(thumb).toHaveAttribute("aria-valuenow", "5");

      await user.keyboard("{ArrowRight}");
      expect(thumb).toHaveAttribute("aria-valuenow", "7");

      await user.keyboard("{Tab}");
      await user.keyboard("{ArrowRight}");

      const thumb1 = getByTestId("slider-thumb-1");

      expect(thumb1).toHaveAttribute("aria-valuenow", "11");

      await user.keyboard("{ArrowRight}");
      expect(thumb1).toHaveAttribute("aria-valuenow", "13");
    });

    it("uses allowedValues in RTL mode", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 15, 35, 60, 85, 100]}
          defaultValues={[35]}
          dir="rtl"
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      // ArrowRight should decrement in RTL
      await user.keyboard("{ArrowRight}");
      expect(thumb).toHaveAttribute("aria-valuenow", "15");

      // ArrowLeft should increment in RTL
      await user.keyboard("{ArrowLeft}");
      expect(thumb).toHaveAttribute("aria-valuenow", "35");
    });

    it("uses allowedValues with Shift+Arrow", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={1000}
          allowedValues={[
            0, 5, 15, 30, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 750, 1000,
          ]}
          defaultValues={[15]}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      // Should move by 10 positions in allowedValues with Shift
      await user.keyboard("{Shift>}{ArrowUp}{/Shift}");

      // From 15 (index 2), moving 10 steps forward goes to 400 (index 12)
      expect(thumb).toHaveAttribute("aria-valuenow", "400");
    });

    it("uses allowedValues with Shift+Arrow (custom multiplier)", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={1000}
          allowedValues={[
            0, 5, 15, 30, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 750, 1000,
          ]}
          defaultValues={[15]}
          jumpMultiplier={5}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      // Should move by 5 positions in allowedValues with Shift (jumpMultiplier=5)
      await user.keyboard("{Shift>}{ArrowUp}{/Shift}");

      // From 15 (index 2), moving 5 steps forward goes to 150 (index 7)
      expect(thumb).toHaveAttribute("aria-valuenow", "150");
    });

    it("stops at allowedValues boundaries", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} allowedValues={[0, 25, 50, 75, 90]} defaultValues={[90]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      // Already at max allowed value, should not change
      expect(thumb).toHaveAttribute("aria-valuenow", "90");

      await user.keyboard("{ArrowDown}");

      // Should move to previous allowed value
      expect(thumb).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Keyboard Interactions - Special Keys", () => {
    it("jumps to min on Home", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{Home}");

      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });

    it("jumps to max on End", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{End}");

      expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("increments by multiplied step on PageUp", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} jumpMultiplier={10} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "60");
    });

    it("decrements by multiplied step on PageDown", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} jumpMultiplier={10} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageDown}");

      expect(thumb).toHaveAttribute("aria-valuenow", "40");
    });

    it("uses custom jumpMultiplier", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} jumpMultiplier={5} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "55");
    });

    it("uses allowedValues on Home, ignoring min", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} allowedValues={[10, 30, 50, 70, 90]} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{Home}");

      // Should jump to first allowed value, not min
      expect(thumb).toHaveAttribute("aria-valuenow", "10");
    });

    it("uses allowedValues on End, ignoring max", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} allowedValues={[10, 30, 50, 70, 90]} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{End}");

      // Should jump to last allowed value, not max
      expect(thumb).toHaveAttribute("aria-valuenow", "90");
    });

    it("uses allowedValues on PageUp", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={1000}
          allowedValues={[
            0, 5, 15, 30, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 750, 1000,
          ]}
          defaultValues={[15]}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      // Should move 10 positions forward in allowedValues: 15 -> 30 -> 50 -> 75 -> 100 -> 150 -> 200 -> 250 -> 300 -> 350 -> 400
      expect(thumb).toHaveAttribute("aria-valuenow", "400");
    });

    it("uses allowedValues on PageDown", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={1000}
          allowedValues={[
            0, 5, 15, 30, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 750, 1000,
          ]}
          defaultValues={[400]}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageDown}");

      // Should move 10 positions backward in allowedValues: 400 -> 350 -> 300 -> 250 -> 200 -> 150 -> 100 -> 75 -> 50 -> 30 -> 15
      expect(thumb).toHaveAttribute("aria-valuenow", "15");
    });

    it("uses allowedValues on PageUp (custom multiplier)", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 5, 10, 20, 35, 55, 80, 100]}
          defaultValues={[10]}
          jumpMultiplier={3}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      // Should move 3 positions forward in allowedValues: 10 -> 20 -> 35 -> 55
      expect(thumb).toHaveAttribute("aria-valuenow", "55");
    });

    it("uses allowedValues on PageDown (custom multiplier)", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 5, 10, 20, 35, 55, 80, 100]}
          defaultValues={[55]}
          jumpMultiplier={3}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageDown}");

      // Should move 3 positions backward in allowedValues: 55 -> 35 -> 20 -> 10
      expect(thumb).toHaveAttribute("aria-valuenow", "10");
    });

    it("clamps allowedValues PageUp at array end", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 20, 40, 60, 80, 100]}
          defaultValues={[80]}
          jumpMultiplier={5}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      // Should clamp to last allowed value (80 is at index 4, trying to move 5 steps forward clamps to 100)
      expect(thumb).toHaveAttribute("aria-valuenow", "100");
    });

    it("clamps allowedValues PageDown at array start", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          allowedValues={[0, 20, 40, 60, 80, 100]}
          defaultValues={[20]}
          jumpMultiplier={5}
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageDown}");

      // Should clamp to first allowed value (20 is at index 1, trying to move 5 steps backward clamps to 0)
      expect(thumb).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("Value Constraints", () => {
    it("snaps to step increments on pointer interactions", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={10} defaultValues={[0]} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 0, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 47, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 47, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb).toHaveAttribute("aria-valuenow", "50");
    });

    it("snaps to allowedValues", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} allowedValues={[0, 25, 50, 75, 100]} defaultValues={[0]} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 0, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 40, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 40, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      // Should snap to closest allowed value (50 is closer than 25)
      expect(thumb).toHaveAttribute("aria-valuenow", "50");
    });

    it("should ignore steps and minStepsBetweenThumbs when allowedValues is provided", async () => {
      const { user, getByTestId } = setUp(
        <Slider
          min={0}
          max={100}
          step={25}
          minStepsBetweenThumbs={3} // 75, but should be ignored because of allowedValues
          allowedValues={[0, 20, 40, 60, 80, 100]}
          defaultValues={[0]}
        />,
      );

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 20, clientY: 5 }, keys: "[MouseLeft]" },
      ]);

      expect(thumb0).toHaveAttribute("aria-valuenow", "20");

      await user.pointer([
        { target: root, coords: { clientX: 40, clientY: 5 }, keys: "[MouseLeft]" },
      ]);

      expect(thumb0).toHaveAttribute("aria-valuenow", "40");
    });

    it("enforces minStepsBetweenThumbs", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={10} minStepsBetweenThumbs={2} defaultValues={[30, 70]} />,
      );

      const thumb0 = getByTestId("slider-thumb-0");
      thumb0.focus();

      // Try to move thumb0 too close to thumb1
      // thumb0 is at 30, thumb1 is at 70
      // minStepsBetweenThumbs=2 means minimum distance is 2*10=20
      // So thumb0 can only go up to 50 (70-20)
      await user.keyboard("{ArrowUp}");
      expect(thumb0).toHaveAttribute("aria-valuenow", "40");

      await user.keyboard("{ArrowUp}");
      expect(thumb0).toHaveAttribute("aria-valuenow", "50");

      // This should be blocked
      await user.keyboard("{ArrowUp}");
      expect(thumb0).toHaveAttribute("aria-valuenow", "50");
    });

    it("should properly jump to the value respecting minStepsBetweenThumbs on sliding a thumb", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={10} minStepsBetweenThumbs={2} defaultValues={[30, 70]} />,
      );

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      expect(thumb0).toHaveAttribute("aria-valuenow", "30");
      expect(thumb1).toHaveAttribute("aria-valuenow", "70");

      // move thumb0 to 90

      await user.pointer([
        { target: thumb0, coords: { clientX: 30, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 90, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 90, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      const updatedThumb0 = getByTestId("slider-thumb-0");
      const updatedThumb1 = getByTestId("slider-thumb-1");

      expect(updatedThumb0).toHaveAttribute("aria-valuenow", "70");
      expect(updatedThumb1).toHaveAttribute("aria-valuenow", "90");
    });

    it("sorts multi-thumb values after updates", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[30, 70]} />);

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      expect(thumb0).toHaveAttribute("aria-valuenow", "30");
      expect(thumb1).toHaveAttribute("aria-valuenow", "70");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Drag thumb0 past thumb1
      await user.pointer([
        { target: thumb0, coords: { clientX: 30, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 80, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 80, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      // Values should be sorted
      const updatedThumb0 = getByTestId("slider-thumb-0");
      const updatedThumb1 = getByTestId("slider-thumb-1");

      const value0 = Number.parseInt(updatedThumb0.getAttribute("aria-valuenow") || "0", 10);
      const value1 = Number.parseInt(updatedThumb1.getAttribute("aria-valuenow") || "0", 10);

      expect(value0).toBeLessThanOrEqual(value1);
    });
  });

  describe("Callbacks", () => {
    it("fires onValuesChange during drag", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      onValuesChange.mockClear();

      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);

      expect(onValuesChange).toHaveBeenCalled();
    });

    it("fires onValuesChange during keyboard input", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      expect(onValuesChange).toHaveBeenCalledWith([51]);
    });

    it("fires onValuesCommit on drag end when value changed", async () => {
      const onValuesCommit = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesCommit={onValuesCommit} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(onValuesCommit).toHaveBeenCalledWith([60]);
    });

    it("fires onValuesCommit on keyboard input", async () => {
      const onValuesCommit = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesCommit={onValuesCommit} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      expect(onValuesCommit).toHaveBeenCalledWith([51]);
    });

    it("does NOT fire onValuesCommit if value unchanged", async () => {
      const onValuesCommit = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} defaultValues={[50]} onValuesCommit={onValuesCommit} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 50, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 50, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(onValuesCommit).not.toHaveBeenCalled();
    });
  });

  describe("Controlled vs Uncontrolled", () => {
    it("works as uncontrolled with defaultValues", async () => {
      const { user, getByTestId } = setUp(<Slider min={0} max={100} defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      expect(thumb).toHaveAttribute("aria-valuenow", "50");

      await user.keyboard("{ArrowUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });

    it("works as controlled with values prop", async () => {
      const { user, getByTestId } = setUp(
        <ControlledSlider min={0} max={100} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      expect(thumb).toHaveAttribute("aria-valuenow", "50");

      await user.keyboard("{ArrowUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "51");
    });

    it("updates when controlled values prop changes", () => {
      const { getByTestId, rerender } = setUp(<Slider min={0} max={100} values={[50]} />);

      const thumb = getByTestId("slider-thumb-0");
      expect(thumb).toHaveAttribute("aria-valuenow", "50");

      rerender(<Slider min={0} max={100} values={[75]} />);

      expect(thumb).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("Disabled State", () => {
    it("does not respond to pointer interactions when disabled", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider disabled min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb).toHaveAttribute("aria-valuenow", "50");
      expect(onValuesChange).not.toHaveBeenCalled();
    });

    it("does not respond to keyboard interactions when disabled", () => {
      const onValuesChange = vi.fn();
      const { getByTestId } = setUp(
        <Slider disabled min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const thumb = getByTestId("slider-thumb-0");

      // Thumb should not be focusable
      expect(thumb).toHaveAttribute("tabindex", "-1");
    });

    it("sets aria-disabled attribute", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} disabled defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("ReadOnly State", () => {
    it("allows thumbs to be focusable in readOnly mode", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} readOnly defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("tabindex", "0");
    });

    it("does not change values on pointer interactions in readOnly mode", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider readOnly min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);
      await user.pointer([
        { target: root, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      expect(thumb).toHaveAttribute("aria-valuenow", "50");
      expect(onValuesChange).not.toHaveBeenCalled();
    });

    it("focuses nearest thumb on track click but does not change value", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider readOnly min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      await user.pointer([
        { target: root, coords: { clientX: 75, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(thumb).toHaveFocus();
      expect(thumb).toHaveAttribute("aria-valuenow", "50");
      expect(onValuesChange).not.toHaveBeenCalled();
    });

    it("does not respond to keyboard value changes in readOnly mode", async () => {
      const onValuesChange = vi.fn();
      const { user, getByTestId } = setUp(
        <Slider readOnly min={0} max={100} defaultValues={[50]} onValuesChange={onValuesChange} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{ArrowUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "50");
      expect(onValuesChange).not.toHaveBeenCalled();
    });

    it("sets aria-readonly attribute", () => {
      const { getByTestId } = setUp(<Slider min={0} max={100} readOnly defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-readonly", "true");
    });
  });

  describe("Form Integration", () => {
    it("creates hidden inputs with indexed names for multiple thumbs", () => {
      const { getByTestId } = setUp(
        <Slider min={0} max={100} name="range" defaultValues={[25, 75]} />,
      );

      const hiddenInput0 = getByTestId("slider-hidden-input-0") as HTMLInputElement;
      const hiddenInput1 = getByTestId("slider-hidden-input-1") as HTMLInputElement;

      expect(hiddenInput0).toHaveAttribute("name", "range");
      expect(hiddenInput1).toHaveAttribute("name", "range");
      expect(hiddenInput0.value).toBe("25");
      expect(hiddenInput1.value).toBe("75");
    });

    it("updates hidden input values when slider values change", async () => {
      const { user, getByTestId } = setUp(
        <Slider name="volume" min={0} max={100} defaultValues={[50]} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      const hiddenInput = getByTestId("slider-hidden-input-0") as HTMLInputElement;

      expect(hiddenInput.value).toBe("50");

      thumb.focus();
      await user.keyboard("{ArrowUp}");

      expect(hiddenInput.value).toBe("51");
    });
  });

  describe("Value Indicator - Active Mode (Default)", () => {
    const SliderWithValueIndicator = (props: SliderProps) => {
      const { "data-testid": testId = "slider", ...restProps } = props;
      return (
        <SliderRoot {...restProps} data-testid={`${testId}-root`}>
          <div data-testid={`${testId}-track`}>
            <SliderRange data-testid={`${testId}-range`} />
          </div>
          {(restProps.values || restProps.defaultValues || [0]).map((_, index) => (
            <React.Fragment key={index}>
              <SliderThumb thumbIndex={index} data-testid={`${testId}-thumb-${index}`} />
              <SliderHiddenInput
                thumbIndex={index}
                data-testid={`${testId}-hidden-input-${index}`}
              />
              <SliderValueIndicatorRoot
                thumbIndex={index}
                data-testid={`${testId}-value-indicator-${index}`}
              >
                <SliderValueIndicatorLabel
                  thumbIndex={index}
                  data-testid={`${testId}-value-indicator-label-${index}`}
                />
              </SliderValueIndicatorRoot>
            </React.Fragment>
          ))}
        </SliderRoot>
      );
    };

    it("shows value indicator only when dragging in active mode", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="active"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");
      const indicator = getByTestId("slider-value-indicator-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Initially not shown
      expect(indicator).not.toHaveAttribute("data-value-indicator-shown");

      // Start dragging
      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Should be shown while dragging
      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Move during drag
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);

      // Should still be shown
      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Release
      await user.pointer([
        { target: root, coords: { clientX: 60, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      // Should not be shown after release in active mode
      expect(indicator).not.toHaveAttribute("data-value-indicator-shown");
    });

    it("shows value indicator when clicking track in active mode", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="active"
        />,
      );

      const root = getByTestId("slider-root");
      const indicator = getByTestId("slider-value-indicator-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Click and hold on track
      await user.pointer([
        { target: root, coords: { clientX: 75, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Should show indicator not immediately
      expect(indicator).not.toHaveAttribute("data-value-indicator-shown");

      // Move to drag
      await user.pointer([{ target: root, coords: { clientX: 70, clientY: 5 } }]);

      // Will be shown
      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Release
      await user.pointer([
        { target: root, coords: { clientX: 70, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      // Should not be shown after release
      expect(indicator).not.toHaveAttribute("data-value-indicator-shown");
    });
  });

  describe("Value Indicator - Hover Mode", () => {
    const SliderWithValueIndicator = (props: SliderProps) => {
      const { "data-testid": testId = "slider", ...restProps } = props;
      return (
        <SliderRoot {...restProps} data-testid={`${testId}-root`}>
          <div data-testid={`${testId}-track`}>
            <SliderRange data-testid={`${testId}-range`} />
          </div>
          {(restProps.values || restProps.defaultValues || [0]).map((_, index) => (
            <React.Fragment key={index}>
              <SliderThumb thumbIndex={index} data-testid={`${testId}-thumb-${index}`} />
              <SliderHiddenInput
                thumbIndex={index}
                data-testid={`${testId}-hidden-input-${index}`}
              />
              <SliderValueIndicatorRoot
                thumbIndex={index}
                data-testid={`${testId}-value-indicator-${index}`}
              >
                <SliderValueIndicatorLabel
                  thumbIndex={index}
                  data-testid={`${testId}-value-indicator-label-${index}`}
                />
              </SliderValueIndicatorRoot>
            </React.Fragment>
          ))}
        </SliderRoot>
      );
    };

    it("shows value indicator during drag in hover mode", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="hover"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");
      const indicator = getByTestId("slider-value-indicator-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Start dragging
      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Should be shown while dragging
      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Move during drag
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);

      // Should still be shown
      expect(indicator).toHaveAttribute("data-value-indicator-shown");
    });

    it("keeps indicator open when transitioning from drag to hover", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="hover"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");
      const indicator = getByTestId("slider-value-indicator-0");

      // Mock getBoundingClientRect for both root and thumb
      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      vi.spyOn(thumb, "getBoundingClientRect").mockReturnValue({
        left: 48,
        right: 52,
        width: 4,
        top: 3,
        bottom: 7,
        height: 4,
        x: 48,
        y: 3,
        toJSON: () => {},
      });

      // Start dragging
      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Release pointer while still over thumb
      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[/MouseLeft]" },
      ]);

      // Should remain shown because pointer is still over thumb
      expect(indicator).toHaveAttribute("data-value-indicator-shown");
    });

    it("keeps indicator open while dragging even when mouse leaves thumb in hover mode", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[50]}
          valueIndicatorTrigger="hover"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");
      const indicator = getByTestId("slider-value-indicator-0");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Start dragging from thumb
      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Simulate mouse leaving thumb element by triggering mouseleave
      // In actual usage, this would happen when dragging away from the thumb
      thumb.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));

      // Should still be shown because we're actively dragging
      expect(indicator).toHaveAttribute("data-value-indicator-shown");

      // Continue dragging
      await user.pointer([{ target: root, coords: { clientX: 60, clientY: 5 } }]);

      // Should still be shown
      expect(indicator).toHaveAttribute("data-value-indicator-shown");
    });
  });

  describe("Value Indicator - Multiple Thumbs", () => {
    const SliderWithValueIndicator = (props: SliderProps) => {
      const { "data-testid": testId = "slider", ...restProps } = props;
      return (
        <SliderRoot {...restProps} data-testid={`${testId}-root`}>
          <div data-testid={`${testId}-track`}>
            <SliderRange data-testid={`${testId}-range`} />
          </div>
          {(restProps.values || restProps.defaultValues || [0]).map((_, index) => (
            <React.Fragment key={index}>
              <SliderThumb thumbIndex={index} data-testid={`${testId}-thumb-${index}`} />
              <SliderHiddenInput
                thumbIndex={index}
                data-testid={`${testId}-hidden-input-${index}`}
              />
              <SliderValueIndicatorRoot
                thumbIndex={index}
                data-testid={`${testId}-value-indicator-${index}`}
              >
                <SliderValueIndicatorLabel
                  thumbIndex={index}
                  data-testid={`${testId}-value-indicator-label-${index}`}
                />
              </SliderValueIndicatorRoot>
            </React.Fragment>
          ))}
        </SliderRoot>
      );
    };

    it("shows only the dragged thumb's indicator in active mode", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[25, 75]}
          valueIndicatorTrigger="active"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const indicator0 = getByTestId("slider-value-indicator-0");
      const indicator1 = getByTestId("slider-value-indicator-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Start dragging first thumb
      await user.pointer([
        { target: thumb0, coords: { clientX: 25, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Only first indicator should be shown
      expect(indicator0).toHaveAttribute("data-value-indicator-shown");
      expect(indicator1).not.toHaveAttribute("data-value-indicator-shown");

      // Move during drag
      await user.pointer([{ target: root, coords: { clientX: 30, clientY: 5 } }]);

      // Still only first indicator shown
      expect(indicator0).toHaveAttribute("data-value-indicator-shown");
      expect(indicator1).not.toHaveAttribute("data-value-indicator-shown");
    });

    it("shows only one value indicator when thumb crosses over another thumb", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[30, 70]}
          valueIndicatorTrigger="active"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const indicator0 = getByTestId("slider-value-indicator-0");
      const indicator1 = getByTestId("slider-value-indicator-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Start dragging first thumb (at value 30)
      await user.pointer([
        { target: thumb0, coords: { clientX: 30, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Initially, only first indicator should be shown
      expect(indicator0).toHaveAttribute("data-value-indicator-shown");
      expect(indicator1).not.toHaveAttribute("data-value-indicator-shown");

      // Drag past the second thumb (value 70) to position 80
      await user.pointer([{ target: root, coords: { clientX: 80, clientY: 5 } }]);

      expect(indicator0).not.toHaveAttribute("data-value-indicator-shown");
      expect(indicator1).toHaveAttribute("data-value-indicator-shown");
    });

    it("shows only one value indicator when thumb crosses over another thumb in hover mode", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[30, 70]}
          valueIndicatorTrigger="hover"
        />,
      );

      const root = getByTestId("slider-root");
      const thumb0 = getByTestId("slider-thumb-0");
      const indicator0 = getByTestId("slider-value-indicator-0");
      const indicator1 = getByTestId("slider-value-indicator-1");

      vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
        left: 0,
        right: 100,
        width: 100,
        top: 0,
        bottom: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // Start dragging first thumb (at value 30)
      await user.pointer([
        { target: thumb0, coords: { clientX: 30, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      // Initially, only first indicator should be shown
      expect(indicator0).toHaveAttribute("data-value-indicator-shown");
      expect(indicator1).not.toHaveAttribute("data-value-indicator-shown");

      // Drag past the second thumb (value 70) to position 80
      await user.pointer([{ target: root, coords: { clientX: 80, clientY: 5 } }]);

      expect(indicator0).not.toHaveAttribute("data-value-indicator-shown");
      expect(indicator1).toHaveAttribute("data-value-indicator-shown");
    });
  });

  describe("Value Indicator - Disabled State", () => {
    const SliderWithValueIndicator = (props: SliderProps) => {
      const { "data-testid": testId = "slider", ...restProps } = props;
      return (
        <SliderRoot {...restProps} data-testid={`${testId}-root`}>
          <div data-testid={`${testId}-track`}>
            <SliderRange data-testid={`${testId}-range`} />
          </div>
          {(restProps.values || restProps.defaultValues || [0]).map((_, index) => (
            <React.Fragment key={index}>
              <SliderThumb thumbIndex={index} data-testid={`${testId}-thumb-${index}`} />
              <SliderHiddenInput
                thumbIndex={index}
                data-testid={`${testId}-hidden-input-${index}`}
              />
              <SliderValueIndicatorRoot
                thumbIndex={index}
                data-testid={`${testId}-value-indicator-${index}`}
              >
                <SliderValueIndicatorLabel
                  thumbIndex={index}
                  data-testid={`${testId}-value-indicator-label-${index}`}
                />
              </SliderValueIndicatorRoot>
            </React.Fragment>
          ))}
        </SliderRoot>
      );
    };

    it("does not show value indicator on hover when disabled", async () => {
      const { user, getByTestId } = setUp(
        <SliderWithValueIndicator
          min={0}
          max={100}
          defaultValues={[50]}
          disabled
          valueIndicatorTrigger="hover"
        />,
      );

      const thumb = getByTestId("slider-thumb-0");
      const indicator = getByTestId("slider-value-indicator-0");

      // Hover over thumb
      await user.hover(thumb);

      // Should not be shown when disabled
      expect(indicator).not.toHaveAttribute("data-value-indicator-shown");
    });
  });

  describe("Value Indicator - Data Attributes", () => {
    const SliderWithValueIndicator = (props: SliderProps) => {
      const { "data-testid": testId = "slider", ...restProps } = props;
      return (
        <SliderRoot {...restProps} data-testid={`${testId}-root`}>
          <div data-testid={`${testId}-track`}>
            <SliderRange data-testid={`${testId}-range`} />
          </div>
          {(restProps.values || restProps.defaultValues || [0]).map((_, index) => (
            <React.Fragment key={index}>
              <SliderThumb thumbIndex={index} data-testid={`${testId}-thumb-${index}`} />
              <SliderHiddenInput
                thumbIndex={index}
                data-testid={`${testId}-hidden-input-${index}`}
              />
              <SliderValueIndicatorRoot
                thumbIndex={index}
                data-testid={`${testId}-value-indicator-${index}`}
              >
                <SliderValueIndicatorLabel
                  thumbIndex={index}
                  data-testid={`${testId}-value-indicator-label-${index}`}
                />
              </SliderValueIndicatorRoot>
            </React.Fragment>
          ))}
        </SliderRoot>
      );
    };

    it("has correct CSS custom properties", () => {
      const { getByTestId } = setUp(
        <SliderWithValueIndicator min={0} max={100} defaultValues={[50]} />,
      );

      const indicator = getByTestId("slider-value-indicator-0");
      const style = indicator.getAttribute("style");

      // Should have the required CSS custom properties
      expect(style).toContain("--indicator-label-position");
      expect(style).toContain("--indicator-label-offset");
      expect(style).toContain("--thumb-offset");
    });
  });
});
