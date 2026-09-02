import { render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { ScaleFeedback } from "./ScaleFeedback";

describe("ScaleFeedback", () => {
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
