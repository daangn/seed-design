import { render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { ScaleFeedback } from "./ScaleFeedback";

describe("ScaleFeedback", () => {
  it("renders no wrapper around its child", async () => {
    const { container } = render(
      <ScaleFeedback>
        <view id="target" />
      </ScaleFeedback>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    const target = container.querySelector("#target");
    expect(target).not.toBeNull();
    expect(container.children).toHaveLength(1);
  });
});
