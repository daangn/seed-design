import { createRef } from "@lynx-js/react";
import { render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { ScaleFeedback } from "./ScaleFeedback";

describe("ScaleFeedback", () => {
  it("forwards the consumer ref and clears it on unmount", async () => {
    const ref = createRef<unknown>();
    const { unmount } = render(
      <ScaleFeedback ref={ref}>
        <view />
      </ScaleFeedback>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    expect(ref.current).toBeTruthy();
    unmount();
    await waitSchedule();
    expect(ref.current).toBeNull();
  });

  it("renders its child inside one native feedback target", async () => {
    const { container } = render(
      <ScaleFeedback>
        <view id="target" />
      </ScaleFeedback>,
      { enableMainThread: true, enableBackgroundThread: false },
    );
    await waitSchedule();

    const target = container.querySelector("#target");
    const feedbackTarget = container.children[0];

    expect(target).not.toBeNull();
    expect(container.children).toHaveLength(1);
    expect(feedbackTarget).not.toBe(target);
    expect(feedbackTarget.children).toHaveLength(1);
  });
});
