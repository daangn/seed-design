import { describe, expect, it, vi } from "vitest";

import type { LynxViewProps } from "../../types";
import { mergeScaleFeedbackProps } from "./mergeScaleFeedbackProps";

describe("mergeScaleFeedbackProps", () => {
  it("keeps the child mounted as a native animation target", () => {
    const result = mergeScaleFeedbackProps({ flatten: true }, {});

    expect(result.flatten).toBe(false);
  });

  it("preserves unrelated child props", () => {
    const result = mergeScaleFeedbackProps({ id: "target", className: "child" }, {});

    expect(result).toMatchObject({ id: "target", className: "child" });
  });

  it("uses the composed Main Thread handlers", () => {
    const childTouchStart = vi.fn();
    const composedTouchStart = vi.fn();
    const result = mergeScaleFeedbackProps(
      {
        "main-thread:bindtouchstart":
          childTouchStart as LynxViewProps["main-thread:bindtouchstart"],
      },
      {
        "main-thread:bindtouchstart":
          composedTouchStart as LynxViewProps["main-thread:bindtouchstart"],
      },
    );

    expect(result["main-thread:bindtouchstart"]).toBe(composedTouchStart);
  });
});
