import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { HelpBubbleCloseButton, HelpBubbleRoot } from "../HelpBubble";

describe("HelpBubble close feedback", () => {
  it("composes the scale target ref and touch handler while preserving dismissal", async () => {
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
    const target = container.querySelector(".seed-help-bubble__closeButton")!;
    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(report.mock.calls).toEqual([[true]]);
    fireEvent.touchcancel(target, {});
    await waitSchedule();
    fireEvent.tap(target, {});
    await waitSchedule();
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
