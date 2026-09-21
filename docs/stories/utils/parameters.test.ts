import { describe, expect, test } from "bun:test";
import { breakpointNames, breakpoints } from "@seed-design/css/breakpoints";
import { VISUAL_VIEWPORT_PARAMETERS, withVisualTestParameters } from "./parameters";

describe("visual test provider parameters", () => {
  test("keeps Chromatic and Kapture configuration in independent provider trees", () => {
    const parameters = withVisualTestParameters({ theme: "dark" as const });

    expect(parameters.kapture.diff.pixelColorThreshold).toBe(parameters.chromatic.diffThreshold);
    expect(parameters.kapture.captureDelayMs).toBe(parameters.chromatic.delay);
    expect(parameters.chromatic.pauseAnimationAtEnd).toBe(true);
    expect(parameters.kapture.animationState).toBe("end");
    expect(parameters.kapture).not.toHaveProperty("diffThreshold");
    expect(parameters.chromatic).not.toHaveProperty("captureDelayMs");
    expect(parameters.theme).toBe("dark");
  });

  test("maps responsive captures independently for both providers", () => {
    const viewports = VISUAL_VIEWPORT_PARAMETERS.kapture.captureViewports;
    expect(viewports.map(({ name }) => name).sort()).toEqual(["lg", "md", "sm"]);
    for (const viewport of viewports) {
      expect(viewport.width).toBe(breakpoints[viewport.name]);
      expect(Number.isInteger(viewport.height)).toBe(true);
      expect(viewport.height).toBeGreaterThan(0);
    }
    expect(VISUAL_VIEWPORT_PARAMETERS.chromatic.modes).toEqual(
      Object.fromEntries(breakpointNames.map((name) => [name, { viewport: name }])),
    );
  });

  test("preserves caller overrides without overwriting the other provider or defaults", () => {
    const defaults = structuredClone(withVisualTestParameters({}));
    const kapture = { captureDelayMs: 123 };
    const parameters = withVisualTestParameters({ kapture, theme: "light", custom: "kept" });
    expect(parameters.kapture).toEqual(kapture);
    expect(parameters.chromatic).toEqual(defaults.chromatic);
    expect(parameters.custom).toBe("kept");
    const chromatic = { delay: 456 };
    expect(withVisualTestParameters({ chromatic }).chromatic).toEqual(chromatic);
    expect(withVisualTestParameters({ chromatic }).kapture).toEqual(defaults.kapture);
    expect(withVisualTestParameters({})).toEqual(defaults);
  });
});
