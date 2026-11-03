import { createElement, type ReactNode } from "@lynx-js/react";
import { act, renderHook } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SafeAreaProvider, type SafeAreaInsets } from "./SafeAreaProvider.jsx";
import { resetDeprecatedSafeAreaWarnings } from "./deprecated-global-props.js";
import { useSafeArea } from "./useSafeArea.js";

interface TestLynxGlobal {
  lynx?: {
    getJSModule?(name: "GlobalEventEmitter"): {
      emit(eventName: string, args?: unknown[]): void;
    };
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

function emitGlobalPropsChanged() {
  const backgroundLynx = (globalThis as TestLynxGlobal).lynxTestingEnv?.backgroundThread.globalThis
    .lynx;

  if (!backgroundLynx?.getJSModule) {
    throw new Error("Expected Lynx background thread globals to be available.");
  }

  backgroundLynx.getJSModule("GlobalEventEmitter").emit("onGlobalPropsChanged");
}

function withInsets(...layers: SafeAreaInsets[]) {
  return ({ children }: { children: ReactNode }) =>
    layers.reduceRight<ReactNode>(
      (node, insets) => createElement(SafeAreaProvider, { insets }, node),
      children,
    );
}

describe("useSafeArea", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setGlobalProps({});
    resetDeprecatedSafeAreaWarnings();
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

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

  it("uses host-provided zero values instead of env fallback", () => {
    setGlobalProps({
      safeAreaInsetTop: 0,
      safeAreaInsetRight: 0,
      safeAreaInsetBottom: 0,
      safeAreaInsetLeft: 0,
    });

    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "0px",
      safeAreaInsetRight: "0px",
      safeAreaInsetBottom: "0px",
      safeAreaInsetLeft: "0px",
    });
  });

  it("re-renders with updated flat globalProps when the host emits onGlobalPropsChanged", () => {
    setGlobalProps({
      safeAreaInsetTop: 48,
      safeAreaInsetRight: 0,
      safeAreaInsetBottom: 35,
      safeAreaInsetLeft: 0,
    });

    const { result } = renderHook(() => useSafeArea());

    act(() => {
      setGlobalProps({
        safeAreaInsetTop: 24,
        safeAreaInsetRight: 62,
        safeAreaInsetBottom: 21,
        safeAreaInsetLeft: 59,
      });
      emitGlobalPropsChanged();
    });

    expect(result.current).toEqual({
      safeAreaInsetTop: "24px",
      safeAreaInsetRight: "62px",
      safeAreaInsetBottom: "21px",
      safeAreaInsetLeft: "59px",
    });
  });

  it("warns once per deprecated global prop key that is actually used", () => {
    setGlobalProps({ safeAreaInsetTop: 48, safeAreaInsetBottom: 35 });

    const { rerender } = renderHook(() => useSafeArea());
    rerender();

    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      expect.stringContaining("lynx.__globalProps.safeAreaInsetTop"),
      expect.stringContaining("lynx.__globalProps.safeAreaInsetBottom"),
    ]);
  });

  it("uses provider insets before global props and env without warning", () => {
    setGlobalProps({ safeAreaInsetTop: 48, safeAreaInsetBottom: 35 });

    const { result } = renderHook(() => useSafeArea(), {
      wrapper: withInsets({ top: 0, right: 12, bottom: 21, left: 0 }),
    });

    expect(result.current).toEqual({
      safeAreaInsetTop: "0px",
      safeAreaInsetRight: "12px",
      safeAreaInsetBottom: "21px",
      safeAreaInsetLeft: "0px",
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it("uses the nearest provider", () => {
    const { result } = renderHook(() => useSafeArea(), {
      wrapper: withInsets(
        { top: 47, right: 0, bottom: 34, left: 0 },
        { top: 0, right: 0, bottom: 0, left: 0 },
      ),
    });

    expect(result.current.safeAreaInsetTop).toBe("0px");
    expect(result.current.safeAreaInsetBottom).toBe("0px");
  });
});
