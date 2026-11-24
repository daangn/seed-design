import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { measureCommits } from "@seed-design/lynx-vitest-config/commits";
import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { mergeProps } from "../utils/merge-props";
import { ActionButton } from "../components/ActionButton";

import { useScaleFeedback } from "./useScaleFeedback";

function ScaleFeedbackTarget({ onTouchStart }: { onTouchStart: () => void }) {
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    onTouchStart,
  });

  return <view id="spread-target" {...scaleFeedbackTriggerProps} {...scaleFeedbackTargetProps} />;
}

describe("useScaleFeedback Main Thread integration", () => {
  it("keeps ActionButton's pressed state and user Main Thread handler together", async () => {
    function Example({ report }: { report: () => void }) {
      function handleTouch() {
        "main thread";
        runOnBackground(report)();
      }
      return <ActionButton main-thread:bindtouchstart={handleTouch}>Press</ActionButton>;
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const target = container.querySelector(".seed-action-button__root")!;
    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
    expect(target.className).toContain("pressed_true");
    fireEvent.touchend(target, {});
    await waitSchedule();
    expect(target.className).not.toContain("pressed_true");
  });

  it("preserves user Main Thread handlers and refs alongside feedback callbacks", async () => {
    function Example({ report }: { report: (value: string) => void }) {
      const userRef = useMainThreadRef(null);
      const feedback = useScaleFeedback({ onTouchStart: () => report("feedback") });
      function userTouch() {
        "main thread";
        runOnBackground(report)(userRef.current ? "user-attached" : "missing-ref");
      }
      return (
        <view
          id="combined"
          {...mergeProps(feedback.scaleFeedbackTriggerProps, feedback.scaleFeedbackTargetProps, {
            "main-thread:ref": userRef,
            "main-thread:bindtouchstart": userTouch,
          })}
        />
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    fireEvent.touchstart(container.querySelector("#combined")!, {});
    await waitSchedule();
    expect(report.mock.calls).toEqual([["user-attached"], ["feedback"]]);
  });
  it("does not retransmit spread props on an unchanged rerender and updates callbacks", async () => {
    const first = vi.fn();
    const next = vi.fn();
    const view = render(<ScaleFeedbackTarget onTouchStart={first} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const commits = await measureCommits(() =>
      view.rerender(<ScaleFeedbackTarget onTouchStart={first} />),
    );
    expect(commits.total).toBeGreaterThan(0);
    expect(commits.nonEmpty).toBe(0);
    const target = view.container.querySelector("#spread-target");
    if (!target) throw new Error("Missing scale feedback target");
    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(first).toHaveBeenCalledTimes(1);
    view.rerender(<ScaleFeedbackTarget onTouchStart={next} />);
    await waitSchedule();
    fireEvent.touchstart(target, {});
    await waitSchedule();
    expect(first).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
