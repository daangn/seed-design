import { useMemo } from "@lynx-js/react";

import { getSafeAreaInset } from "../utils/safe-area";

type SafeAreaValue = number | string | null | undefined;

interface LynxGlobalProps {
  safeAreaInsets?: {
    top?: SafeAreaValue;
    bottom?: SafeAreaValue;
  };
  safeAreaInsetTop?: SafeAreaValue;
  safeAreaInsetBottom?: SafeAreaValue;
}

interface LynxGlobal {
  lynx?: {
    __globalProps?: LynxGlobalProps;
  };
}

export interface UseSafeAreaReturn {
  safeAreaInsetTop: string;
  safeAreaInsetBottom: string;
}

function getGlobalProps() {
  return (globalThis as LynxGlobal).lynx?.__globalProps;
}

/**
 * Returns top/bottom safe area inset values for Lynx apps.
 *
 * Host-provided positive `lynx.__globalProps` values are preferred. Missing,
 * empty, or zero-like values fall back to Lynx's CSS env variables.
 */
export function useSafeArea(): UseSafeAreaReturn {
  const globalProps = getGlobalProps();
  const safeAreaInsetsTop = globalProps?.safeAreaInsets?.top;
  const safeAreaInsetsBottom = globalProps?.safeAreaInsets?.bottom;
  const safeAreaInsetTop = globalProps?.safeAreaInsetTop;
  const safeAreaInsetBottom = globalProps?.safeAreaInsetBottom;

  return useMemo(
    () => ({
      safeAreaInsetTop: getSafeAreaInset("top"),
      safeAreaInsetBottom: getSafeAreaInset("bottom"),
    }),
    [safeAreaInsetsTop, safeAreaInsetsBottom, safeAreaInsetTop, safeAreaInsetBottom],
  );
}
