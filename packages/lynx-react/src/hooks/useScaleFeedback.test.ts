import {
  feedbackScaleDuration,
  feedbackScaleTimingFunction,
} from "@seed-design/lynx-css/scale-feedback";
import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { calculateScaleFeedback, isReducedMotion } from "../utils/calculate-scale-feedback";
import { createScaleFeedbackAnimation } from "../utils/animate-scale-feedback";
import { useScaleFeedback } from "./useScaleFeedback";

describe("useScaleFeedback", () => {
  it("keeps the animation target from being flattened", () => {
    const { result } = renderHook(() => useScaleFeedback());

    expect(result.current.scaleFeedbackTargetProps.flatten).toBe(false);
  });
});

describe("calculateScaleFeedback", () => {
  it.each([
    { width: 32, height: 32, expected: 30 / 32 },
    { width: 120, height: 48, expected: 46 / 48 },
    { width: 343, height: 48, expected: (343 / 4 - 2) / (343 / 4) },
    { width: 22, height: 22, expected: 22 / 24 },
  ])("calculates the scale for $width x $height", ({ width, height, expected }) => {
    expect(calculateScaleFeedback(width, height)).toBeCloseTo(expected);
  });
});

describe("isReducedMotion", () => {
  it("only disables motion for the exact reduced value", () => {
    expect(isReducedMotion("reduced")).toBe(true);
    expect(isReducedMotion("preferred")).toBe(false);
    expect(isReducedMotion(undefined)).toBe(false);
    expect(isReducedMotion(null)).toBe(false);
    expect(isReducedMotion("unknown")).toBe(false);
  });
});

describe("createScaleFeedbackAnimation", () => {
  it("uses the current transform and Rootage motion values", () => {
    expect(
      createScaleFeedbackAnimation(
        "matrix(0.97, 0, 0, 0.97, 0, 0)",
        30 / 32,
        feedbackScaleDuration,
      ),
    ).toEqual({
      keyframes: [
        { transform: "matrix(0.97, 0, 0, 0.97, 0, 0)" },
        { transform: `scale(${30 / 32})` },
      ],
      options: {
        duration: feedbackScaleDuration,
        easing: feedbackScaleTimingFunction,
        fill: "forwards",
      },
    });
  });

  it("falls back to the resting transform when the computed value is empty", () => {
    expect(createScaleFeedbackAnimation("", 1, 0).keyframes).toEqual([
      { transform: "scale(1)" },
      { transform: "scale(1)" },
    ]);
  });
});
