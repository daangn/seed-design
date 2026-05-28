import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { useSeedRootProps } from "../useSeedRootProps";

interface TestLynxGlobal {
  SystemInfo?: {
    platform?: "Android" | "iOS" | "Harmony" | "windows" | "macOS";
  };
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetBottom?: number;
      theme?: string;
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

function setLynxGlobals({
  globalProps,
  platform,
}: {
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>;
  platform: NonNullable<TestLynxGlobal["SystemInfo"]>["platform"];
}) {
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
    global.SystemInfo = {
      ...global.SystemInfo,
      platform,
    };
  }
}

describe("useSeedRootProps", () => {
  it("returns root theme/platform classes and safe area CSS variables", () => {
    setLynxGlobals({
      globalProps: {
        safeAreaInsetTop: 62,
        safeAreaInsetBottom: 34,
        theme: "dark",
      },
      platform: "iOS",
    });

    const { result } = renderHook(() => useSeedRootProps({ colorMode: "system", safeArea: true }));

    expect(result.current).toEqual({
      className: "seed-user-color-scheme-dark seed-platform-ios",
      style: {
        "--seed-safe-area-top": "62px",
        "--seed-safe-area-bottom": "34px",
      },
    });
  });

  it("can opt out of safe area CSS variables", () => {
    setLynxGlobals({
      globalProps: {
        safeAreaInsetTop: 62,
        safeAreaInsetBottom: 34,
        theme: "dark",
      },
      platform: "Android",
    });

    const { result } = renderHook(() =>
      useSeedRootProps({ colorMode: "light-only", safeArea: false }),
    );

    expect(result.current).toEqual({
      className: "seed-user-color-scheme-light seed-platform-android",
      style: undefined,
    });
  });
});
