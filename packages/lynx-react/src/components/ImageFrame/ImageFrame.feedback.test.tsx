import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageFrameReactionButton } from "./ImageFrame";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ImageFrameReactionButton feedback", () => {
  it("restores main-thread taps after disabled without registering an empty worklet", async () => {
    // Testing-library stores one handler per event key; background taps are tested separately.
    const mainThreadTap = vi.fn();
    const mainThreadWarn = vi
      .spyOn(lynxTestingEnv.mainThread.globalThis["console"], "warn")
      .mockImplementation(() => {});

    function Example({ disabled }: { disabled: boolean }) {
      function handleMainThreadTap() {
        "main thread";
        runOnBackground(mainThreadTap)();
      }
      return (
        <ImageFrameReactionButton disabled={disabled} main-thread:bindtap={handleMainThreadTap} />
      );
    }

    const view = render(<Example disabled={false} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const button = view.container.querySelector(".seed-image-frame-reaction-button__root");
    if (!button) throw new Error("Missing reaction button");

    fireEvent.tap(button, {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(1);

    view.rerender(<Example disabled />);
    await waitSchedule();
    fireEvent.tap(button, {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(1);

    view.rerender(<Example disabled={false} />);
    await waitSchedule();
    fireEvent.tap(button, {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(2);
    expect(button.getAttribute("accessibility-value")).toBe("not pressed");
    expect(mainThreadWarn).not.toHaveBeenCalled();
  });

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
