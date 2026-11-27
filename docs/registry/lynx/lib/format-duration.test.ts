import { afterEach, beforeEach, describe, expect, it, spyOn, type Mock } from "bun:test";
import { formatDuration, formatDurationLabel } from "./format-duration";

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [59, "0:59"],
    [60, "1:00"],
    [125, "2:05"],
    [3599, "59:59"],
    [3600, "1:00:00"],
    [3725, "1:02:05"],
    [86400, "24:00:00"],
    [90185, "25:03:05"],
  ])("formats %p seconds as %p", (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  it("drops fractions of a second", () => {
    expect(formatDuration(5.999)).toBe("0:05");
    expect(formatDuration(3599.9)).toBe("59:59");
  });

  describe("invalid input", () => {
    let warn: Mock<typeof console.warn>;

    beforeEach(() => {
      warn = spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      warn.mockRestore();
    });

    it.each([[-1], [-0.5], [Number.NaN], [Number.POSITIVE_INFINITY], [Number.NEGATIVE_INFINITY]])(
      "clamps %p to 0:00 and warns",
      (seconds) => {
        expect(formatDuration(seconds)).toBe("0:00");
        expect(warn).toHaveBeenCalledTimes(1);
      },
    );

    it("does not warn for valid input", () => {
      formatDuration(0);
      formatDuration(42);

      expect(warn).not.toHaveBeenCalled();
    });

    it("does not warn in production", () => {
      const original = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      try {
        expect(formatDuration(-1)).toBe("0:00");
        expect(warn).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = original;
      }
    });
  });
});

const labelCases = [
  [0, "0초"],
  [5, "5초"],
  [60, "1분"],
  [125, "2분 5초"],
  [3599, "59분 59초"],
  [3600, "1시간"],
  [3605, "1시간 5초"],
  [3725, "1시간 2분 5초"],
  [90185, "25시간 3분 5초"],
  [5.999, "5초"],
  [-1, "0초"],
  [Number.NaN, "0초"],
  [Number.POSITIVE_INFINITY, "0초"],
] as const;

describe("formatDurationLabel", () => {
  it.each(labelCases)("reads %p seconds as %p", (seconds, expected) => {
    expect(formatDurationLabel(seconds)).toBe(expected);
  });
});
