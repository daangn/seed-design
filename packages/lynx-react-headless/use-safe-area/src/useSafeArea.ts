import { useGlobalProps, useMemo } from "@lynx-js/react";
import type { GlobalProps } from "@lynx-js/types";

type SafeAreaEdge = "top" | "right" | "bottom" | "left";

declare module "@lynx-js/types" {
  interface GlobalProps {
    safeAreaInsetTop?: number;
    safeAreaInsetRight?: number;
    safeAreaInsetBottom?: number;
    safeAreaInsetLeft?: number;
  }
}

function normalizeSafeAreaValue(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;

  return `${value}px`;
}

const resolveSafeAreaInset = (edge: SafeAreaEdge, value: number | undefined) =>
  normalizeSafeAreaValue(value) ?? `env(safe-area-inset-${edge})`;

export interface UseSafeAreaReturn {
  safeAreaInsetTop: string;
  safeAreaInsetRight: string;
  safeAreaInsetBottom: string;
  safeAreaInsetLeft: string;
}

/**
 * Lynx 앱에서 top/right/bottom/left safe area inset 값을 반환합니다.
 *
 * `useGlobalProps()`로 구독한 `safeAreaInset*` 값을 우선 사용하고, host가 값을 제공하지 않으면
 * Lynx CSS `env(safe-area-inset-*)` 값을 fallback으로 반환합니다. host가 제공한 `0`은 유효한
 * 값으로 보고 `"0px"`를 반환합니다.
 */
export function useSafeArea(): UseSafeAreaReturn {
  const globalProps = useGlobalProps() as GlobalProps | undefined;
  const safeAreaInsetTop = globalProps?.safeAreaInsetTop;
  const safeAreaInsetRight = globalProps?.safeAreaInsetRight;
  const safeAreaInsetBottom = globalProps?.safeAreaInsetBottom;
  const safeAreaInsetLeft = globalProps?.safeAreaInsetLeft;

  return useMemo(
    () => ({
      safeAreaInsetTop: resolveSafeAreaInset("top", safeAreaInsetTop),
      safeAreaInsetRight: resolveSafeAreaInset("right", safeAreaInsetRight),
      safeAreaInsetBottom: resolveSafeAreaInset("bottom", safeAreaInsetBottom),
      safeAreaInsetLeft: resolveSafeAreaInset("left", safeAreaInsetLeft),
    }),
    [safeAreaInsetTop, safeAreaInsetRight, safeAreaInsetBottom, safeAreaInsetLeft],
  );
}
