import { describe, expect, it } from "vitest";

import {
  calculateScaleFeedback,
  isReducedMotion,
} from "../utils/calculate-scale-feedback";

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
