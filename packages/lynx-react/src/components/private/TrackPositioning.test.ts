import { describe, expect, it } from "vitest";

import { getTrackPosition } from "./TrackPositioning";

const dimensions = { trackWidth: 300, thumbWidth: 24, labelWidth: 100 };

describe("getTrackPosition", () => {
  it("sticks the label to track edges while its arrow follows the thumb", () => {
    expect(getTrackPosition({ ...dimensions, progress: 0 })).toEqual({
      thumbCenter: 12,
      labelLeft: 0,
      arrowCenter: 12,
    });
    expect(getTrackPosition({ ...dimensions, progress: 0.5 })).toEqual({
      thumbCenter: 150,
      labelLeft: 100,
      arrowCenter: 50,
    });
    expect(getTrackPosition({ ...dimensions, progress: 1 })).toEqual({
      thumbCenter: 288,
      labelLeft: 200,
      arrowCenter: 88,
    });
  });

  it("mirrors both label and arrow in RTL for independently sized indicators", () => {
    const ltr = getTrackPosition({ ...dimensions, progress: 0.2, labelWidth: 160 });
    const rtl = getTrackPosition({
      ...dimensions,
      progress: 0.2,
      labelWidth: 160,
      direction: "rtl",
    });

    expect(rtl.thumbCenter).toBeCloseTo(300 - ltr.thumbCenter);
    expect(rtl.labelLeft).toBeCloseTo(300 - 160 - ltr.labelLeft);
    expect(rtl.arrowCenter).toBeCloseTo(160 - ltr.arrowCenter);
    expect(rtl.labelLeft + rtl.arrowCenter).toBeCloseTo(rtl.thumbCenter);
  });

  it("centers an oversized label without losing its arrow target", () => {
    expect(getTrackPosition({ ...dimensions, progress: 0, labelWidth: 400 })).toEqual({
      thumbCenter: 12,
      labelLeft: -50,
      arrowCenter: 62,
    });
  });

  it("clamps an out-of-range value even when the thumb is wider than the track", () => {
    expect(
      getTrackPosition({ progress: 2, trackWidth: 20, thumbWidth: 24, labelWidth: 10 }),
    ).toEqual({
      thumbCenter: 10,
      labelLeft: 5,
      arrowCenter: 5,
    });
  });
});
