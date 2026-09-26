import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";

import * as Slider from "./Slider.namespace";
import {
  hasMinimumSteps,
  normalizeValue,
  normalizeValues,
  percentageForValue,
  valueForPercentage,
} from "./Slider.utils";

vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => {
  const actual = await importOriginal<typeof LynxUiCommon>();
  return {
    ...actual,
    getRectByRef: vi.fn(() => Promise.resolve({ left: 10, width: 100 })),
  };
});

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
  it("exposes adjustable thumb accessibility and indicator labels", () => {
    const { container } = render(
      <Slider.Root defaultValues={[40]} getAccessibilityLabel={(index) => `Price ${index + 1}`}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb />
            <Slider.ValueIndicatorRoot>
              <Slider.ValueIndicatorLabel />
            </Slider.ValueIndicatorRoot>
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    const thumb = container.querySelector(".seed-slider__thumb");
    const label = container.querySelector("text");
    expect(thumb).toHaveAttribute("accessibility-role-description", "adjustable");
    expect(thumb).toHaveAttribute("accessibility-label", "Price 1");
    expect(thumb).toHaveAttribute("accessibility-value", "minimum 0, maximum 100, current 40");
    expect(label).toHaveTextContent("40");
  });

  it("reports controlled touch updates and commits once at touch end", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const view = render(
      <Slider.Root values={[20]} onValuesChange={onValuesChange} onValuesCommit={onValuesCommit}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    await waitSchedule();
    const root = view.container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 60 }] });
    await waitSchedule();
    fireEvent.touchmove(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
    fireEvent.touchend(root, { eventType: "catchEvent", changedTouches: [{ pageX: 80 }] });
    await waitSchedule();
    expect(onValuesChange).toHaveBeenCalled();
    expect(onValuesCommit).toHaveBeenCalledTimes(1);
    expect(onValuesCommit).toHaveBeenLastCalledWith([70]);
  });

  it("coalesces touch moves to the latest value once per frame", async () => {
    const onValuesChange = vi.fn();
    const view = render(
      <Slider.Root defaultValues={[20]} onValuesChange={onValuesChange}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    await waitSchedule();
    const root = view.container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 30 }] });
    fireEvent.touchmove(root, { eventType: "catchEvent", touches: [{ pageX: 40 }] });
    fireEvent.touchmove(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });

    expect(onValuesChange).not.toHaveBeenCalled();
    await waitSchedule();
    expect(onValuesChange).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenLastCalledWith([70]);
  });

  it("commits a quick first tap after track measurement", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const view = render(
      <Slider.Root
        defaultValues={[20]}
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    const root = view.container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
    fireEvent.touchend(root, { eventType: "catchEvent", changedTouches: [{ pageX: 80 }] });
    await waitSchedule();
    expect(onValuesChange).toHaveBeenLastCalledWith([70]);
    expect(onValuesCommit).toHaveBeenCalledTimes(1);
    expect(onValuesCommit).toHaveBeenLastCalledWith([70]);
  });

  it("clears a finished interaction when measurement fails", async () => {
    const getRect = vi.mocked(getRectByRef);
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    getRect.mockRejectedValue(new Error("measurement failed"));

    try {
      const view = render(
        <Slider.Root values={[20]} onValuesChange={onValuesChange} onValuesCommit={onValuesCommit}>
          <Slider.Control>
            <Slider.Track>
              <Slider.Thumb />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>,
      );
      const root = view.container.querySelector(".seed-slider__root");
      if (!root) throw new Error("Expected slider root");
      fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
      fireEvent.touchend(root, { eventType: "catchEvent", changedTouches: [{ pageX: 80 }] });
      await waitSchedule();

      getRect.mockResolvedValue({
        left: 10,
        top: 0,
        width: 100,
        height: 20,
        right: 110,
        bottom: 20,
      });
      view.rerender(
        <Slider.Root
          values={[20, 40]}
          onValuesChange={onValuesChange}
          onValuesCommit={onValuesCommit}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Thumb />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>,
      );
      await waitSchedule();

      expect(onValuesChange).not.toHaveBeenCalled();
      expect(onValuesCommit).not.toHaveBeenCalled();
    } finally {
      getRect.mockReset();
      getRect.mockResolvedValue({
        left: 10,
        top: 0,
        width: 100,
        height: 20,
        right: 110,
        bottom: 20,
      });
    }
  });

  it("cancels an unmeasured interaction without committing delayed updates", async () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const view = render(
      <Slider.Root
        defaultValues={[20]}
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    const root = view.container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
    fireEvent.touchcancel(root, { eventType: "catchEvent" });
    await waitSchedule();
    expect(onValuesChange).not.toHaveBeenCalled();
    expect(onValuesCommit).not.toHaveBeenCalled();
  });

  it("does not update or commit a disabled slider", () => {
    const onValuesChange = vi.fn();
    const onValuesCommit = vi.fn();
    const { container } = render(
      <Slider.Root
        defaultValues={[20]}
        disabled
        onValuesChange={onValuesChange}
        onValuesCommit={onValuesCommit}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    const root = container.querySelector(".seed-slider__root");
    if (!root) throw new Error("Expected slider root");
    fireEvent.touchstart(root, { eventType: "catchEvent", touches: [{ pageX: 80 }] });
    fireEvent.touchend(root, { eventType: "catchEvent", changedTouches: [{ pageX: 80 }] });
    expect(onValuesChange).not.toHaveBeenCalled();
    expect(onValuesCommit).not.toHaveBeenCalled();
    expect(container.querySelector(".seed-slider__thumb")).toHaveAttribute(
      "accessibility-traits",
      "disabled",
    );
  });
});
