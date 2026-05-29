import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { useSafeArea } from "./useSafeArea";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetBottom?: number;
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
      safeAreaInsetBottom: "env(safe-area-inset-bottom)",
    });
  });

  it("uses flat globalProps values before env fallback", () => {
    setGlobalProps({
      safeAreaInsetTop: 48,
      safeAreaInsetBottom: 35,
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "48px",
      safeAreaInsetBottom: "35px",
    });
  });

  it("falls back to Lynx env values when host flat global props are zero", () => {
    setGlobalProps({
      safeAreaInsetTop: 0,
      safeAreaInsetBottom: 0,
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "env(safe-area-inset-top)",
      safeAreaInsetBottom: "env(safe-area-inset-bottom)",
    });
  });
});
