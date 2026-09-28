import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { useSafeArea } from "./useSafeArea";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetRight?: number;
      safeAreaInsetBottom?: number;
      safeAreaInsetLeft?: number;
    };
  };
  lynxTestingEnv?: {
    backgroundThread: {
      globalThis: TestLynxGlobal;
    };
    mainThread: {
      globalThis: TestLynxGlobal;
    };
  };
}

function setGlobalProps(
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>,
) {
  const lynxTestingEnv = (globalThis as TestLynxGlobal).lynxTestingEnv;

  if (!lynxTestingEnv) {
    throw new Error("Expected Lynx testing environment globals to be available.");
  }

  const globals = [
    globalThis as TestLynxGlobal,
    lynxTestingEnv.backgroundThread.globalThis,
    lynxTestingEnv.mainThread.globalThis,
  ];

  for (const global of globals) {
    global.lynx = {
      ...global.lynx,
      __globalProps: globalProps,
    };
  }
}

describe("useSafeArea", () => {
  it("falls back to Lynx env values when host flat global props are missing", () => {
    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "env(safe-area-inset-top)",
      safeAreaInsetRight: "env(safe-area-inset-right)",
      safeAreaInsetBottom: "env(safe-area-inset-bottom)",
      safeAreaInsetLeft: "env(safe-area-inset-left)",
    });
  });

  it("uses flat globalProps values before env fallback", () => {
    setGlobalProps({
      safeAreaInsetTop: 48,
      safeAreaInsetRight: 62,
      safeAreaInsetBottom: 35,
      safeAreaInsetLeft: 59,
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "48px",
      safeAreaInsetRight: "62px",
      safeAreaInsetBottom: "35px",
      safeAreaInsetLeft: "59px",
    });
  });

  it("falls back to Lynx env values only for top and bottom when host flat global props are zero", () => {
    setGlobalProps({
      safeAreaInsetTop: 0,
      safeAreaInsetRight: 0,
      safeAreaInsetBottom: 0,
      safeAreaInsetLeft: 0,
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "env(safe-area-inset-top)",
      safeAreaInsetRight: "0px",
      safeAreaInsetBottom: "env(safe-area-inset-bottom)",
      safeAreaInsetLeft: "0px",
    });
  });
});
