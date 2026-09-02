import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { useScaleFeedback } from "./useScaleFeedback";

function ScaleFeedbackTarget({ onTouchStart }: { onTouchStart: () => void }) {
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    onTouchStart,
  });

  return <view id="spread-target" {...scaleFeedbackTriggerProps} {...scaleFeedbackTargetProps} />;
}

describe("useScaleFeedback Main Thread integration", () => {
  it("runs the exact Background Thread callback from its Main Thread handler", async () => {
    const onTouchStart = vi.fn();
    const { container } = render(<ScaleFeedbackTarget onTouchStart={onTouchStart} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();

    const target = container.querySelector("#spread-target");
    expect(target).not.toBeNull();
    fireEvent.touchstart(target!, {});
    await waitSchedule();

    expect(onTouchStart).toHaveBeenCalledTimes(1);
  });
});
