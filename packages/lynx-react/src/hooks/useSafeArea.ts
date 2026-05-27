import { useMemo } from "@lynx-js/react";
import type { GlobalProps } from "@lynx-js/types";

type SafeAreaEdge = "top" | "bottom";

declare module "@lynx-js/types" {
  interface GlobalProps {
    safeAreaInsetTop?: number;
    safeAreaInsetBottom?: number;
  }
}

interface LynxGlobal {
  lynx?: {
    __globalProps?: GlobalProps;
  };
}

const safeAreaProp: Record<SafeAreaEdge, "safeAreaInsetTop" | "safeAreaInsetBottom"> = {
  top: "safeAreaInsetTop",
  bottom: "safeAreaInsetBottom",
};

function getGlobalProps(): GlobalProps | undefined {
  return (globalThis as LynxGlobal).lynx?.__globalProps;
}

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
  const globalProps = getGlobalProps();
  const safeAreaInsetTop = globalProps?.[safeAreaProp.top];
  const safeAreaInsetBottom = globalProps?.[safeAreaProp.bottom];

  return useMemo(
    () => ({
      safeAreaInsetTop: resolveSafeAreaInset("top", safeAreaInsetTop),
      safeAreaInsetBottom: resolveSafeAreaInset("bottom", safeAreaInsetBottom),
    }),
    [safeAreaInsetTop, safeAreaInsetBottom],
  );
}
