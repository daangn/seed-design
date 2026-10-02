import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { ImageFrameReactionButton } from "../ImageFrame";

describe("ImageFrameReactionButton feedback", () => {
  it("preserves the caller main-thread ref and touch handlers alongside Scale Feedback", async () => {
    function Example({ report }: { report: (attached: boolean) => void }) {
      const userRef = useMainThreadRef(null);
      function handleTouch() {
        "main thread";
        runOnBackground(report)(userRef.current !== null);
      }
      return (
        <ImageFrameReactionButton
          main-thread:ref={userRef}
          main-thread:bindtouchstart={handleTouch}
        />
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const button = container.querySelector(".seed-image-frame-reaction-button__root");
    if (!button) throw new Error("Missing reaction button");
    fireEvent.touchstart(button, {});
    await waitSchedule();
    expect(report.mock.calls).toEqual([[true]]);
    fireEvent.touchcancel(button, {});
    await waitSchedule();
    expect(button.getAttribute("accessibility-value")).toBe("not pressed");
  });
});
