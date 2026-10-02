import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { ReactionButton } from "./ReactionButton";

describe("ReactionButton feedback integration", () => {
  it("preserves the user's Main Thread ref and touch handler", async () => {
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
  });

  it("runs the Main Thread tap only while interactive", async () => {
    function Example({ loading, report }: { loading: boolean; report: () => void }) {
      function handleTap() {
        "main thread";
        runOnBackground(report)();
      }
      return (
        <ReactionButton loading={loading} main-thread:bindtap={handleTap}>
          좋아요
        </ReactionButton>
      );
    }
    const report = vi.fn();
    const { container, rerender } = render(<Example loading={false} report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const target = container.querySelector(".seed-reaction-button__root")!;
    fireEvent.tap(target, {});
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);

    rerender(<Example loading report={report} />);
    await waitSchedule();
    fireEvent.tap(target, {});
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
  });
});
