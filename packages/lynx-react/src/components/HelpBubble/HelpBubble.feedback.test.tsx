import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HelpBubbleCloseButton, HelpBubbleRoot } from "./HelpBubble";

describe("HelpBubble close feedback", () => {
  beforeEach(() => {
    const mainThread = lynxTestingEnv.mainThread.globalThis;
    const systemInfo = mainThread["SystemInfo"];
    const getComputedStyle = mainThread["__GetComputedStyleByKey"];
    mainThread["SystemInfo"] = { ...systemInfo, lynxSdkVersion: "3.6" };
    // 0.117.0의 테스트 런타임에는 Main Thread의 computed-style 브리지가 없습니다.
    mainThread["__GetComputedStyleByKey"] = (element: HTMLElement, property: string) =>
      element.style.getPropertyValue(property);
    return () => {
      mainThread["SystemInfo"] = systemInfo;
      mainThread["__GetComputedStyleByKey"] = getComputedStyle;
    };
  });

  it.each([
    { transform: undefined, finish: "touchend" },
    { transform: "translateX(8px)", finish: "touchend" },
    { transform: "translateX(8px)", finish: "touchcancel" },
  ] as const)(
    "scales the content and preserves the button transform on $finish ($transform)",
    async ({ transform, finish }) => {
      function Example({
        report,
        onOpenChange,
        onTap,
      }: {
        report: (attached: boolean) => void;
        onOpenChange: (open: boolean) => void;
        onTap: () => void;
      }) {
        const userRef = useMainThreadRef(null);
        function handleTouch() {
          "main thread";
          runOnBackground(report)(userRef.current !== null);
        }
        return (
          <HelpBubbleRoot defaultOpen onOpenChange={onOpenChange}>
            <HelpBubbleCloseButton
              accessibility-label="닫기"
              style={transform ? { transform } : undefined}
              main-thread:ref={userRef}
              main-thread:bindtouchstart={handleTouch}
              bindtap={onTap}
            />
          </HelpBubbleRoot>
        );
      }
      const report = vi.fn();
      const onOpenChange = vi.fn();
      const onTap = vi.fn();
      const { container } = render(
        <Example report={report} onOpenChange={onOpenChange} onTap={onTap} />,
        { enableMainThread: true, enableBackgroundThread: true },
      );
      await waitSchedule();
      const button = container.querySelector<HTMLElement>(".seed-help-bubble__closeButton")!;
      const content = button.querySelector<HTMLElement>(".seed-help-bubble__closeButtonContent")!;

      content.style.width = "40px";
      content.style.height = "40px";
      fireEvent.touchstart(button, {});
      await waitSchedule();
      expect(report.mock.calls).toEqual([[true]]);
      expect([...elementTree.animationMap.values()]).toMatchObject([
        { element: content, keyframes: [expect.anything(), { transform: "scale(0.95)" }] },
      ]);

      fireEvent[finish](button, {});
      await waitSchedule();
      expect([...elementTree.animationMap.values()]).toMatchObject([
        { element: content, keyframes: [expect.anything(), { transform: "scale(1)" }] },
      ]);
      expect(button.style.transform).toBe(transform ?? "");

      fireEvent(content, new Event("bindEvent:tap", { bubbles: true }));
      await waitSchedule();
      expect(onTap).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    },
  );
});
