import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { ReactionButton } from "./ReactionButton";

describe("ReactionButton feedback integration", () => {
  it("preserves the user's Main Thread ref and touch handler and clears press on cancel", async () => {
    function Example({ report }: { report: (attached: boolean) => void }) {
      const userRef = useMainThreadRef(null);
      function handleTouch() {
        "main thread";
        runOnBackground(report)(userRef.current !== null);
      }
      return (
        <ReactionButton main-thread:ref={userRef} main-thread:bindtouchstart={handleTouch}>
          좋아요
        </ReactionButton>
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const target = container.querySelector(".seed-reaction-button__root")!;
    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(report.mock.calls).toEqual([[true]]);
    expect(target.classList.contains("seed-reaction-button__root--pressed_true")).toBe(true);
    fireEvent.touchcancel(target, {});
    await waitSchedule();
    expect(target.classList.contains("seed-reaction-button__root--pressed_true")).toBe(false);
  });

  it.each([
    "disabled",
    "loading",
  ] as const)("does not enter pressed state while %s", async (state) => {
    const { container } = render(<ReactionButton {...{ [state]: true }}>좋아요</ReactionButton>, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const target = container.querySelector(".seed-reaction-button__root")!;
    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(target.classList.contains("seed-reaction-button__root--pressed_true")).toBe(false);
  });
});
