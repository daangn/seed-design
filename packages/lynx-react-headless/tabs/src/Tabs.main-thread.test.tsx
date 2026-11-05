import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Tabs from "./Tabs.namespace.js";
import { useTabsContext } from "./useTabsContext.js";
import { useTabsIndicator } from "./useTabsIndicator.js";

// dual-thread render는 이후 single-thread render의 ref 식별자와 섞이므로 별도 파일에서 실행한다.

function fireBindEvent(element: Element, eventName: string, detail: unknown) {
  const init = { eventType: "bindEvent", eventName, detail };
  const event = createEvent(`bindEvent:${eventName}`, element, init);
  Object.assign(event, init);
  fireEvent(element, event);
}

function getTrigger(container: HTMLElement, label: string) {
  const trigger = container.querySelector<HTMLElement>(
    `[accessibility-role-description="tab"][accessibility-label="${label}"]`,
  );
  if (!trigger) throw new Error(`Expected trigger for ${label} to exist.`);
  return trigger;
}

function getProbeState(container: HTMLElement, testId: string): unknown {
  const probe = container.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (!probe) throw new Error("Expected state probe.");
  return JSON.parse(probe.textContent ?? "null");
}

function ContextProbe() {
  const { value, visualValue } = useTabsContext();
  return <text data-testid="context">{JSON.stringify({ value, visualValue })}</text>;
}

function IndicatorProbe() {
  const { indicatorProps, transitionsEnabled } = useTabsIndicator();
  return (
    <text data-testid="indicator-style">
      {JSON.stringify({ style: indicatorProps.style, transitionsEnabled })}
    </text>
  );
}

describe("Tabs headless main-thread indicator", () => {
  it("keeps measured, selected and settled indicator geometry consistent with main-thread offsets", async () => {
    const onSettle = vi.fn();
    const { container, getByTestId } = render(
      <Tabs.Root defaultValue="two">
        <Tabs.List>
          <Tabs.Trigger value="one">one</Tabs.Trigger>
          <Tabs.Trigger value="two">two</Tabs.Trigger>
          <Tabs.Indicator data-testid="indicator" />
        </Tabs.List>
        <Tabs.Carousel swipeable onSettle={onSettle}>
          <Tabs.CarouselCamera>
            <Tabs.Content value="one">
              <text>One</text>
            </Tabs.Content>
            <Tabs.Content value="two">
              <text>Two</text>
            </Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
        <IndicatorProbe />
        <ContextProbe />
      </Tabs.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();
    expect(getProbeState(container, "indicator-style")).toEqual({
      style: { transform: "translateX(0px)", width: "0px" },
      transitionsEnabled: false,
    });

    fireBindEvent(getTrigger(container, "one"), "layoutchange", { width: 80, left: 999 });
    fireBindEvent(getTrigger(container, "two"), "layoutchange", { width: 100, left: 999 });
    await waitSchedule();
    const secondStyle = { transform: "translateX(80px)", width: "100px" };
    expect(getProbeState(container, "indicator-style")).toEqual({
      style: secondStyle,
      transitionsEnabled: true,
    });
    expect(getTrigger(container, "two")).toHaveAttribute("accessibility-value", "selected");

    fireEvent.tap(getTrigger(container, "one"));
    await waitSchedule();
    const firstStyle = { transform: "translateX(0px)", width: "80px" };
    expect(getProbeState(container, "indicator-style")).toEqual({
      style: firstStyle,
      transitionsEnabled: true,
    });

    const indicator = getByTestId("indicator");
    const pager = container.querySelector("viewpager")!;
    // 실제 MT setter 입력을 관찰하고 원래 setter도 실행한다.
    const addInlineStyle = vi.spyOn(lynxTestingEnv.mainThread.globalThis, "__AddInlineStyle");
    try {
      fireBindEvent(pager, "offsetchange", { offset: 0.5 });
      await waitSchedule();
      expect(addInlineStyle.mock.calls).toEqual([
        [indicator, "transform", "translateX(40px)"],
        [indicator, "width", "90px"],
      ]);
      expect(getProbeState(container, "indicator-style")).toEqual({
        style: firstStyle,
        transitionsEnabled: true,
      });
      expect(getProbeState(container, "context")).toEqual({ value: "one", visualValue: "one" });

      fireBindEvent(pager, "willchange", { index: 1, isDragged: true });
      await waitSchedule();
      addInlineStyle.mockClear();
      fireBindEvent(pager, "offsetchange", { offset: 1 });
      await waitSchedule();
      expect(addInlineStyle.mock.calls).toEqual([
        [indicator, "transform", secondStyle.transform],
        [indicator, "width", secondStyle.width],
      ]);
      fireBindEvent(pager, "change", { index: 1, isDragged: true });
      await waitSchedule();
      expect(getProbeState(container, "indicator-style")).toEqual({
        style: secondStyle,
        transitionsEnabled: true,
      });
      expect(getProbeState(container, "context")).toEqual({ value: "two", visualValue: "two" });
      expect(onSettle).toHaveBeenCalledTimes(1);
    } finally {
      addInlineStyle.mockRestore();
    }
  });
});
