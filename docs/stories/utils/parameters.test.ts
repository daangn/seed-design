import { describe, expect, test } from "bun:test";
import { breakpointNames } from "@seed-design/css/breakpoints";
import { VISUAL_VIEWPORT_PARAMETERS, withVisualTestParameters } from "./parameters";

describe("visual test provider parameters", () => {
  test("keeps Chromatic and Kapture configuration in independent provider trees", () => {
    const parameters = withVisualTestParameters({ theme: "dark" as const });

    expect(parameters.chromatic).toEqual({
      diffThreshold: 0.2,
      delay: 300,
      pauseAnimationAtEnd: true,
    });
    expect(parameters.kapture).toEqual({
      diff: { pixelColorThreshold: 0.2 },
      captureDelayMs: 300,
      animationState: "end",
    });
    expect(parameters.theme).toBe("dark");
  });

  test("maps responsive captures independently for both providers", () => {
    expect(VISUAL_VIEWPORT_PARAMETERS.kapture.captureViewports).toEqual([...breakpointNames]);
    expect(Object.keys(VISUAL_VIEWPORT_PARAMETERS.chromatic.modes)).toEqual([...breakpointNames]);
  });
});
