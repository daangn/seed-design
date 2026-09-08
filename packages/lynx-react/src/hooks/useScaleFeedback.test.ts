import { runOnMainThread } from "@lynx-js/react";
import { renderHook, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, expectTypeOf, it } from "vitest";

import { calculateScaleFeedback, isReducedMotion } from "../utils/calculate-scale-feedback";
import { useScaleFeedback, type UseScaleFeedbackOptions } from "./useScaleFeedback";

describe("useScaleFeedback", () => {
  it("keeps the animation target from being flattened", () => {
    const { result } = renderHook(() => useScaleFeedback());

    expect(result.current.scaleFeedbackTargetProps.flatten).toBe(false);
  });

  it("uses exact touch event callbacks", () => {
    expectTypeOf<UseScaleFeedbackOptions>().toMatchTypeOf<{
      onTouchStart?: () => void;
      onTouchEnd?: () => void;
      onTouchCancel?: () => void;
    }>();
    expectTypeOf<UseScaleFeedbackOptions>().not.toHaveProperty("onPressStart");
    expectTypeOf<UseScaleFeedbackOptions>().not.toHaveProperty("onPressEnd");
    expectTypeOf<UseScaleFeedbackOptions>().not.toHaveProperty("onPressCancel");
  });
});

describe("calculateScaleFeedback", () => {
  it.each([
    { width: 32, height: 32, expected: 30 / 32 },
    { width: 120, height: 48, expected: 46 / 48 },
    { width: 343, height: 48, expected: (343 / 4 - 2) / (343 / 4) },
    { width: 22, height: 22, expected: 22 / 24 },
  ])("calculates the scale for $width x $height", async ({ width, height, expected }) => {
    renderHook(() => undefined);
    await waitSchedule();
    const scale = runOnMainThread(calculateScaleFeedback)(width, height);
    await waitSchedule();
    expect(await scale).toBeCloseTo(expected);
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
