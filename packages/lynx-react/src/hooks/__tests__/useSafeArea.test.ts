import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { useSafeArea } from "../useSafeArea";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsets?: {
        top?: number | string | null;
        bottom?: number | string | null;
      };
      safeAreaInsetTop?: number | string | null;
      safeAreaInsetBottom?: number | string | null;
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
  const globals = [
    globalThis as TestLynxGlobal,
    (globalThis as TestLynxGlobal).lynxTestingEnv!.backgroundThread.globalThis,
    (globalThis as TestLynxGlobal).lynxTestingEnv!.mainThread.globalThis,
  ];

  for (const global of globals) {
    global.lynx = {
      ...global.lynx,
      __globalProps: globalProps,
    };
  }
}

describe("useSafeArea", () => {
  it("falls back to Lynx env values", () => {
    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "env(safe-area-inset-top)",
      safeAreaInsetBottom: "env(safe-area-inset-bottom)",
    });
  });

  it("uses globalProps safeAreaInsets when available", () => {
    setGlobalProps({
      safeAreaInsets: {
        top: 47,
        bottom: 34,
      },
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "47px",
      safeAreaInsetBottom: "34px",
    });
  });

  it("uses flat globalProps values as fallback", () => {
    setGlobalProps({
      safeAreaInsetTop: "48",
      safeAreaInsetBottom: "35px",
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "48px",
      safeAreaInsetBottom: "35px",
    });
  });
});
