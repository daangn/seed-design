import "@testing-library/jest-dom";
import { act, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as Slider from "./Slider.namespace.js";
import { useSliderContext } from "./useSliderContext.js";
import {
  hasMinimumSteps,
  normalizeValue,
  normalizeValues,
  percentageForValue,
  valueForPercentage,
} from "./utils.js";

interface Rect {
  left: number;
  width: number;
}

const geometry = vi.hoisted(() => ({ getRectByRef: vi.fn() }));
vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => {
  const actual = await importOriginal<typeof LynxUiCommon>();
  return { ...actual, getRectByRef: geometry.getRectByRef };
});

let rootRect: Rect;
let thumbRect: Rect;

function elementForRef(current: unknown): Element | null {
  if (!current || typeof current !== "object" || !("refAttr" in current)) return null;
  const refAttr = current.refAttr;
  if (!Array.isArray(refAttr)) return null;
  return elementTree.root?.querySelector(`[react-ref-${refAttr[0]}-${refAttr[1]}]`) ?? null;
}

beforeEach(() => {
  rootRect = { left: 10, width: 100 };
  thumbRect = { left: 0, width: 20 };
  geometry.getRectByRef.mockReset();
  geometry.getRectByRef.mockImplementation(async (ref: { current: unknown }) => {
    const element = elementForRef(ref.current);
    const rect = element?.classList.contains("thumb") ? thumbRect : rootRect;
    return { ...rect, top: 0, height: 20, right: rect.left + rect.width, bottom: 20 };
  });
});

function query(selector: string): Element {
  const element = elementTree.root?.querySelector(selector);
  if (!element) throw new Error(`Expected ${selector} to be rendered.`);
  return element;
}

function touch(type: "touchstart" | "touchmove" | "touchend", pageX: number) {
  const key = type === "touchend" ? "changedTouches" : "touches";
  fireEvent[type](query(".root"), { eventType: "catchEvent", [key]: [{ pageX }] });
}

function SingleThumb(props: Slider.RootProps) {
  return (
    <Slider.Root className="root" {...props}>
      <Slider.Range className="range" />
      <Slider.Thumb className="thumb" thumbIndex={0} />
    </Slider.Root>
  );
}

describe("Slider utilities", () => {
  it("normalizes to bounds and step increments", () => {
    expect(normalizeValue(14, 0, 100, 10)).toBe(10);
    expect(normalizeValue(140, 0, 100, 10)).toBe(100);
    expect(normalizeValues([70, -2, 31], 0, 100, 10)).toEqual([0, 30, 70]);
  });

  it("uses allowed values instead of step snapping", () => {
    expect(normalizeValue(34, 0, 100, 10, [5, 35, 90])).toBe(35);
    expect(normalizeValues([89, 6], 0, 100, 1, [5, 35, 90])).toEqual([5, 90]);
    expect(normalizeValue(-8, 0, 100, 10, [-10, 50])).toBe(-10);
  });

  it("enforces minimum steps and converts RTL geometry", () => {
    expect(hasMinimumSteps([10, 30], 2, 10)).toBe(true);
    expect(hasMinimumSteps([10, 20], 2, 10)).toBe(false);
    expect(hasMinimumSteps([10, 10], 1, 0)).toBe(false);
    expect(hasMinimumSteps([0.1, 0.3], 2, 0.1)).toBe(true);
    expect(valueForPercentage(25, 0, 100, "ltr")).toBe(25);
    expect(valueForPercentage(25, 0, 100, "rtl")).toBe(75);
    expect(percentageForValue(25, 0, 100)).toBe(25);
  });
});

describe("Slider", () => {
  it("exposes adjustable thumb accessibility and indicator labels without styles", () => {
    render(
      <Slider.Root defaultValues={[40]} getAccessibilityLabel={(index) => `Price ${index + 1}`}>
        <Slider.Thumb className="thumb" thumbIndex={0} />
        <Slider.ValueIndicatorRoot thumbIndex={0}>
          <Slider.ValueIndicatorLabel thumbIndex={0} />
        </Slider.ValueIndicatorRoot>
      </Slider.Root>,
    );
    const thumb = query(".thumb");
    expect(thumb).toHaveAttribute("accessibility-role-description", "adjustable");
    expect(thumb).toHaveAttribute("accessibility-label", "Price 1");
    expect(thumb).toHaveAttribute("accessibility-value", "minimum 0, maximum 100, current 40");
    expect(query("text")).toHaveTextContent("40");
  });

  it("reports controlled touch updates and commits once at touch end", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    render(
      <SingleThumb values={[20]} onValuesChange={onValuesChange} onValuesCommit={onValuesCommit} />,
    );
    await waitSchedule();
    touch("touchstart", 60);
    await waitSchedule();
    touch("touchmove", 80);
    touch("touchend", 80);
    await waitSchedule();
    expect(onValuesChange).toHaveBeenCalled();
    expect(onValuesCommit).toHaveBeenCalledTimes(1);
    expect(onValuesCommit).toHaveBeenLastCalledWith([70]);
    expect(query(".thumb")).toHaveAttribute(
      "accessibility-value",
      "minimum 0, maximum 100, current 20",
    );
  });

  it("coalesces touch moves to the latest value once per frame", async () => {
    const onValuesChange = vi.fn();
    render(<SingleThumb defaultValues={[20]} onValuesChange={onValuesChange} />);
    await waitSchedule();
    fireEvent.touchstart(query(".thumb"), { touches: [{ pageX: 30 }] });
    touch("touchstart", 30);
    touch("touchmove", 40);
    touch("touchmove", 80);

    expect(onValuesChange).not.toHaveBeenCalled();
    await waitSchedule();
    expect(onValuesChange).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenLastCalledWith([70]);
  });

  it("moves the nearest thumb and keeps the minimum distance between thumbs", async () => {
    const onValuesCommit = vi.fn();
    render(
      <Slider.Root
        className="root"
        defaultValues={[20, 60]}
        step={10}
        minStepsBetweenThumbs={2}
        onValuesCommit={onValuesCommit}
      >
        <Slider.Thumb className="thumb" thumbIndex={0} />
        <Slider.Thumb thumbIndex={1} />
      </Slider.Root>,
    );
    await waitSchedule();
    touch("touchstart", 85);
    touch("touchend", 85);
    await waitSchedule();
    expect(onValuesCommit).toHaveBeenLastCalledWith([20, 80]);

    touch("touchstart", 25);
    touch("touchend", 70);
    await waitSchedule();
    expect(onValuesCommit).toHaveBeenLastCalledWith([60, 80]);

    touch("touchstart", 75);
    touch("touchend", 85);
    await waitSchedule();
    expect(onValuesCommit).toHaveBeenCalledTimes(2);
  });

  it("commits a quick first tap after delayed measurement", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    render(
      <SingleThumb
        defaultValues={[20]}
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      />,
    );
    touch("touchstart", 80);
    touch("touchend", 80);
    await waitSchedule();
    expect(onValuesChange).toHaveBeenLastCalledWith([70]);
    expect(onValuesCommit).toHaveBeenCalledTimes(1);
    expect(onValuesCommit).toHaveBeenLastCalledWith([70]);
  });

  it("clears a finished interaction when measurement fails", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    geometry.getRectByRef.mockRejectedValue(new Error("measurement failed"));
    const view = render(
      <SingleThumb values={[20]} onValuesChange={onValuesChange} onValuesCommit={onValuesCommit} />,
    );
    touch("touchstart", 80);
    touch("touchend", 80);
    await waitSchedule();

    geometry.getRectByRef.mockResolvedValue({ left: 10, top: 0, width: 100, height: 20 });
    view.rerender(
      <SingleThumb
        values={[20, 40]}
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      />,
    );
    await waitSchedule();

    expect(onValuesChange).not.toHaveBeenCalled();
    expect(onValuesCommit).not.toHaveBeenCalled();
  });

  it("cancels an unmeasured interaction without committing delayed updates", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    render(
      <SingleThumb
        defaultValues={[20]}
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      />,
    );
    touch("touchstart", 80);
    fireEvent.touchcancel(query(".root"), { eventType: "catchEvent" });
    await waitSchedule();
    expect(onValuesChange).not.toHaveBeenCalled();
    expect(onValuesCommit).not.toHaveBeenCalled();
  });

  it("does not update or commit a disabled or read-only slider", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const view = render(
      <SingleThumb
        defaultValues={[20]}
        disabled
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      />,
    );
    await waitSchedule();
    touch("touchstart", 80);
    touch("touchend", 80);
    expect(query(".thumb")).toHaveAttribute("accessibility-traits", "disabled");

    view.rerender(
      <SingleThumb
        defaultValues={[20]}
        readOnly
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      />,
    );
    await waitSchedule();
    touch("touchstart", 80);
    touch("touchend", 80);
    await waitSchedule();
    expect(onValuesChange).not.toHaveBeenCalled();
    expect(onValuesCommit).not.toHaveBeenCalled();
  });

  it("re-measures the root after a resize before converting touches", async () => {
    const onValuesCommit = vi.fn();
    render(<SingleThumb defaultValues={[20]} onValuesCommit={onValuesCommit} />);
    await waitSchedule();

    rootRect = { left: 10, width: 200 };
    act(() => fireEvent.layoutchange(query(".root"), { detail: { width: 200 } }));
    await waitSchedule();
    touch("touchstart", 110);
    touch("touchend", 110);
    await waitSchedule();
    expect(onValuesCommit).toHaveBeenLastCalledWith([50]);
  });

  // jsdom은 inline style의 CSS 변수를 버리므로 위치 변수는 공개 getter의 반환값으로 확인합니다.
  it("keeps thumb position independent of measurement and updates the indicator after resizes", async () => {
    const styles: Array<{ thumb: unknown; indicator: unknown }> = [];
    function Probe() {
      const { getThumbProps, getValueIndicatorProps } = useSliderContext();
      styles.push({
        thumb: getThumbProps(0).style,
        indicator: getValueIndicatorProps(0).rootProps.style,
      });
      return null;
    }
    render(
      <Slider.Root className="root" defaultValues={[100]}>
        <Slider.Thumb className="thumb" thumbIndex={0} />
        <Slider.ValueIndicatorRoot className="indicator" thumbIndex={0} />
        <Probe />
      </Slider.Root>,
    );
    const firstThumbStyle = { "--slider-thumb-left": "100%", "--slider-thumb-offset-ratio": -0.5 };
    expect(styles[0]?.thumb).toEqual(firstThumbStyle);
    await waitSchedule();

    rootRect = { left: 10, width: 200 };
    thumbRect = { left: 0, width: 30 };
    act(() => fireEvent.layoutchange(query(".root"), { detail: { width: 200 } }));
    await waitSchedule();
    act(() => fireEvent.layoutchange(query(".indicator"), { detail: { width: 60 } }));
    expect(styles.at(-1)).toMatchObject({
      thumb: firstThumbStyle,
      indicator: { "--slider-value-indicator-offset": "-30px", "--slider-thumb-offset": "-15px" },
    });
  });

  it("keeps user handlers, styles and forwarded refs", async () => {
    const onThumbTouchStart = vi.fn();
    const onRootLayout = vi.fn();
    const thumbRef = vi.fn();
    render(
      <Slider.Root className="root" defaultValues={[40]} bindlayoutchange={onRootLayout}>
        <Slider.Thumb
          ref={thumbRef}
          className="thumb"
          thumbIndex={0}
          style={{ opacity: 0.5 }}
          accessibility-label="custom"
          bindtouchstart={onThumbTouchStart}
        />
      </Slider.Root>,
    );
    await waitSchedule();
    fireEvent.touchstart(query(".thumb"), { touches: [{ pageX: 30 }] });
    act(() => fireEvent.layoutchange(query(".root"), { detail: { width: 100 } }));

    const thumb = query(".thumb");
    expect(onThumbTouchStart).toHaveBeenCalledTimes(1);
    expect(onRootLayout).toHaveBeenCalledTimes(1);
    expect(thumbRef).toHaveBeenCalledWith(expect.anything());
    expect(thumb).toHaveAttribute("accessibility-label", "custom");
    expect(thumb.getAttribute("style")).toContain("opacity: 0.5");
  });
});
