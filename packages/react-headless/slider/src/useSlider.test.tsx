import "@testing-library/jest-dom/vitest";
import { cleanup, render, type RenderResult } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import { useSlider, type UseSliderProps } from "./useSlider";
import { Primitive } from "@seed-design/react-primitive";

afterEach(cleanup);

function setUp(jsx: React.ReactElement): { user: UserEvent } & RenderResult {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

// Test wrapper component that uses useSlider hook
interface SliderProps extends UseSliderProps {
  "data-testid"?: string;
}

const Slider = (props: SliderProps) => {
  const testId = props["data-testid"] || "slider";
  const api = useSlider(props);
  const values = api.values;

  return (
    <Primitive.div
      ref={api.refs.root as React.RefObject<HTMLDivElement>}
      {...api.rootProps}
      data-testid={`${testId}-root`}
    >
      <Primitive.div data-testid={`${testId}-track`}>
        <Primitive.div {...api.getRangeProps()} data-testid={`${testId}-range`} />
      </Primitive.div>
      {values.map((_, index) => (
        <React.Fragment key={index}>
          <Primitive.div
            ref={api.getThumbRef()}
            {...api.getThumbProps(index)}
            data-testid={`${testId}-thumb-${index}`}
          />
          <Primitive.input
            {...api.getHiddenInputProps(index)}
            data-testid={`${testId}-hidden-input-${index}`}
          />
        </React.Fragment>
      ))}
    </Primitive.div>
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
      const { getByTestId } = setUp(<Slider />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toBeInTheDocument();
      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveAttribute("role", "slider");
    });

    it("renders multiple thumbs", () => {
      const { getByTestId } = setUp(<Slider defaultValues={[0, 50, 100]} />);

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
      const { getByTestId } = setUp(<Slider disabled />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toHaveAttribute("data-disabled");
      expect(thumb).toHaveAttribute("aria-disabled", "true");
      expect(thumb).toHaveAttribute("tabindex", "-1");
    });

    it("sets readonly state attributes", () => {
      const { getByTestId } = setUp(<Slider readOnly />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      expect(root).toHaveAttribute("data-readonly");
      expect(thumb).toHaveAttribute("aria-readonly", "true");
    });

    it("sets invalid state attributes", () => {
      const { getByTestId } = setUp(<Slider invalid />);

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
        <Slider defaultValues={[0, 100]} getAriaLabel={(index) => `Thumb ${index + 1}`} />,
      );

      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      expect(thumb0).toHaveAttribute("aria-label", "Thumb 1");
      expect(thumb1).toHaveAttribute("aria-label", "Thumb 2");
    });

    it("uses custom aria-labelledby via getAriaLabelledby", () => {
      const { getByTestId } = setUp(
        <Slider defaultValues={[0, 100]} getAriaLabelledby={(index) => `label-${index}`} />,
      );

      const thumb0 = getByTestId("slider-thumb-0");
      const thumb1 = getByTestId("slider-thumb-1");

      expect(thumb0).toHaveAttribute("aria-labelledby", "label-0");
      expect(thumb1).toHaveAttribute("aria-labelledby", "label-1");
    });

    it("uses custom aria-valuetext via getAriaValuetext", () => {
      const { getByTestId } = setUp(
        <Slider defaultValues={[50]} getAriaValuetext={(value) => `${value}%`} />,
      );

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-valuetext", "50%");
    });

    it("creates hidden inputs with correct attributes", () => {
      const { getByTestId } = setUp(<Slider name="volume" defaultValues={[50]} />);

      const hiddenInput = getByTestId("slider-hidden-input-0") as HTMLInputElement;

      expect(hiddenInput).toHaveAttribute("type", "hidden");
      expect(hiddenInput).toHaveAttribute("name", "volume");
      expect(hiddenInput.value).toBe("50");
    });
  });

  describe("Pointer Interactions - Click on Track", () => {
    it("sets active state on pointerdown on track", { timeout: 10000 }, async () => {
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

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

      expect(onValuesCommit).toHaveBeenCalledWith({
        values: [50],
        valueIndex: 0,
      });
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
  });

  describe("Pointer Interactions - Drag Thumb", () => {
    it("sets active state on pointerdown on thumb", async () => {
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

      const root = getByTestId("slider-root");
      const thumb = getByTestId("slider-thumb-0");

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(root).toHaveAttribute("data-active");
    });

    it("sets dragging state during drag", async () => {
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

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
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      await user.pointer([
        { target: thumb, coords: { clientX: 50, clientY: 5 }, keys: "[MouseLeft>]" },
      ]);

      expect(thumb).toHaveFocus();
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
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

      const root = getByTestId("slider-root");

      expect(root).not.toHaveAttribute("data-hover");

      await user.hover(root);

      expect(root).toHaveAttribute("data-hover");
    });

    it("removes data-hover on pointerleave", async () => {
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

      const root = getByTestId("slider-root");

      await user.hover(root);
      expect(root).toHaveAttribute("data-hover");

      await user.unhover(root);
      expect(root).not.toHaveAttribute("data-hover");
    });

    it("transitions through states: idle → active → dragging → idle (starting from a thumb)", async () => {
      const { user, getByTestId } = setUp(<Slider defaultValues={[50]} />);

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
      const { user, getByTestId } = setUp(<Slider defaultValues={[20]} />);

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
        <Slider min={0} max={100} step={1} defaultValues={[50]} multiplierOnPageKey={10} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "60");
    });

    it("decrements by multiplied step on PageDown", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} multiplierOnPageKey={10} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageDown}");

      expect(thumb).toHaveAttribute("aria-valuenow", "40");
    });

    it("uses custom multiplierOnPageKey", async () => {
      const { user, getByTestId } = setUp(
        <Slider min={0} max={100} step={1} defaultValues={[50]} multiplierOnPageKey={5} />,
      );

      const thumb = getByTestId("slider-thumb-0");
      thumb.focus();

      await user.keyboard("{PageUp}");

      expect(thumb).toHaveAttribute("aria-valuenow", "55");
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
      const { getByTestId } = setUp(<Slider disabled defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("ReadOnly State", () => {
    it("allows thumbs to be focusable in readOnly mode", () => {
      const { getByTestId } = setUp(<Slider readOnly defaultValues={[50]} />);

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
      const { getByTestId } = setUp(<Slider readOnly defaultValues={[50]} />);

      const thumb = getByTestId("slider-thumb-0");

      expect(thumb).toHaveAttribute("aria-readonly", "true");
    });
  });

  describe("Form Integration", () => {
    it("creates hidden inputs with indexed names for multiple thumbs", () => {
      const { getByTestId } = setUp(<Slider name="range" defaultValues={[25, 75]} />);

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
});
