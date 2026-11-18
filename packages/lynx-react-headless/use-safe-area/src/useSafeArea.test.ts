import { createElement, type ReactNode } from "@lynx-js/react";
import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { SafeAreaProvider, type SafeAreaInsets } from "./SafeAreaProvider.jsx";
import { useSafeArea } from "./useSafeArea.js";

function withInsets(...layers: SafeAreaInsets[]) {
  return ({ children }: { children: ReactNode }) =>
    layers.reduceRight<ReactNode>(
      (node, insets) => createElement(SafeAreaProvider, { insets }, node),
      children,
    );
}

describe("useSafeArea", () => {
  it("returns 0px for every edge without a provider", () => {
    const { result } = renderHook(() => useSafeArea());

    expect(result.current).toEqual({
      safeAreaInsetTop: "0px",
      safeAreaInsetRight: "0px",
      safeAreaInsetBottom: "0px",
      safeAreaInsetLeft: "0px",
    });
  });

  it("uses provider insets", () => {
    const { result } = renderHook(() => useSafeArea(), {
      wrapper: withInsets({ top: 0, right: 12, bottom: 21, left: 0 }),
    });

    expect(result.current).toEqual({
      safeAreaInsetTop: "0px",
      safeAreaInsetRight: "12px",
      safeAreaInsetBottom: "21px",
      safeAreaInsetLeft: "0px",
    });
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
