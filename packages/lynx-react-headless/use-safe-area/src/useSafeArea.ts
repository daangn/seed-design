import { useMemo } from "@lynx-js/react";

type SafeAreaEdge = "top" | "right" | "bottom" | "left";

declare module "@lynx-js/types" {
  interface GlobalProps {
    safeAreaInsetTop?: number;
    safeAreaInsetRight?: number;
    safeAreaInsetBottom?: number;
    safeAreaInsetLeft?: number;
  }
}

function normalizeSafeAreaValue(edge: SafeAreaEdge, value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;

  // TODO: confirm why a host-provided 0 falls back to `env()` on top and bottom. The reason isn't
  // recorded anywhere, and a host that subtracts insets its parent already consumed (Android
  // Compose) passes 0 on purpose, which `env()` may then override with the window's inset.
  if (value === 0 && (edge === "top" || edge === "bottom")) return undefined;

  return `${value}px`;
}

const resolveSafeAreaInset = (edge: SafeAreaEdge, value: number | undefined) =>
  normalizeSafeAreaValue(edge, value) ?? `env(safe-area-inset-${edge})`;

export interface UseSafeAreaReturn {
  safeAreaInsetTop: string;
  safeAreaInsetRight: string;
  safeAreaInsetBottom: string;
  safeAreaInsetLeft: string;
}

/**
 * Lynx 앱에서 top/right/bottom/left safe area inset 값을 반환합니다.
 *
 * `lynx.__globalProps.safeAreaInset*` 값을 우선 사용하고, host가 값을 제공하지 않으면
 * Lynx CSS `env(safe-area-inset-*)` 값을 fallback으로 반환합니다. top/bottom은 host가
 * `0`을 제공해도 fallback합니다.
 */
export function useSafeArea(): UseSafeAreaReturn {
  const globalProps = lynx.__globalProps;
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
