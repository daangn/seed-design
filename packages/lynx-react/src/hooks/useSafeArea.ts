import { useMemo } from "@lynx-js/react";

type SafeAreaEdge = "top" | "bottom";

declare module "@lynx-js/types" {
  interface GlobalProps {
    safeAreaInsetTop?: number;
    safeAreaInsetBottom?: number;
  }
}

const safeAreaProp: Record<SafeAreaEdge, "safeAreaInsetTop" | "safeAreaInsetBottom"> = {
  top: "safeAreaInsetTop",
  bottom: "safeAreaInsetBottom",
};

function getSafeAreaEnvInset(edge: SafeAreaEdge): string {
  return `env(safe-area-inset-${edge})`;
}

function normalizeSafeAreaValue(value: number | undefined): string | undefined {
  if (typeof value !== "number" || value <= 0 || !Number.isFinite(value)) {
    return undefined;
  }

  return `${value}px`;
}

function resolveSafeAreaInset(edge: SafeAreaEdge, value: number | undefined): string {
  return normalizeSafeAreaValue(value) ?? getSafeAreaEnvInset(edge);
}

export interface UseSafeAreaReturn {
  safeAreaInsetTop: string;
  safeAreaInsetBottom: string;
}

/**
 * Lynx 앱에서 top/bottom safe area inset 값을 반환합니다.
 *
 * `lynx.__globalProps.safeAreaInsetTop`과 `safeAreaInsetBottom`을 우선 사용하고,
 * host가 값을 제공하지 않으면 Lynx CSS `env(safe-area-inset-*)` 값을 fallback으로
 * 반환합니다.
 */
export function useSafeArea(): UseSafeAreaReturn {
  const safeAreaInsetTop = lynx.__globalProps?.[safeAreaProp.top];
  const safeAreaInsetBottom = lynx.__globalProps?.[safeAreaProp.bottom];

  return useMemo(
    () => ({
      safeAreaInsetTop: resolveSafeAreaInset("top", safeAreaInsetTop),
      safeAreaInsetBottom: resolveSafeAreaInset("bottom", safeAreaInsetBottom),
    }),
    [safeAreaInsetTop, safeAreaInsetBottom],
  );
}
