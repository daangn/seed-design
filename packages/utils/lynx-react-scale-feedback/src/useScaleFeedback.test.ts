import { createElement, runOnMainThread, type ReactNode } from "@lynx-js/react";
import { renderHook, waitSchedule } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { calculateScaleFeedback, isReducedMotion } from "./calculate-scale-feedback";
import { resetDeprecatedMotionWarning } from "./deprecated-global-props";
import { PreferredMotionContext } from "./PreferredMotionContext";
import { useScaleFeedback, type UseScaleFeedbackOptions } from "./useScaleFeedback";

interface TestLynxGlobal {
  lynx?: { __globalProps?: Record<string, unknown> };
  lynxTestingEnv?: {
    backgroundThread: { globalThis: TestLynxGlobal };
    mainThread: { globalThis: TestLynxGlobal };
  };
}

function setGlobalProps(globalProps: Record<string, unknown>) {
  const env = (globalThis as unknown as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as unknown as TestLynxGlobal,
    env?.backgroundThread.globalThis,
    env?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    global.lynx = { ...global.lynx, __globalProps: globalProps };
  }
}

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

describe("useScaleFeedback deprecated motion global prop", () => {
  afterEach(() => {
    setGlobalProps({});
    resetDeprecatedMotionWarning();
    vi.restoreAllMocks();
  });

  it("warns once when it falls back to GlobalProps.motion", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    setGlobalProps({ motion: "reduced" });

    renderHook(() => useScaleFeedback());
    renderHook(() => useScaleFeedback());

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("lynx.__globalProps.motion");
  });

  it("uses the provider value without reading GlobalProps.motion", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    setGlobalProps({ motion: "reduced" });

    renderHook(() => useScaleFeedback(), {
      wrapper: ({ children }: { children: ReactNode }) =>
        createElement(PreferredMotionContext.Provider, { value: "default" }, children),
    });

    expect(warn).not.toHaveBeenCalled();
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
