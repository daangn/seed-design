import { useContext, useMemo } from "@lynx-js/react";

import { warnDeprecatedGlobalProp } from "./deprecated-global-props.js";
import { SafeAreaContext } from "./SafeAreaProvider.jsx";
import { useHostGlobalProps } from "./use-host-global-props.js";

type SafeAreaEdge = "top" | "right" | "bottom" | "left";

declare module "@lynx-js/types" {
  interface GlobalProps {
    /**
     * @deprecated 당근 앱 호스트 전용 키다. `SafeAreaProvider`의 `insets`나
     * `@seed-design/lynx-react`의 `SeedProvider`에 `safeAreaInsets`를 넘긴다. 다음 메이저 버전에서 제거한다.
     */
    safeAreaInsetTop?: number;
    /** @deprecated `safeAreaInsetTop`과 같다. */
    safeAreaInsetRight?: number;
    /** @deprecated `safeAreaInsetTop`과 같다. */
    safeAreaInsetBottom?: number;
    /** @deprecated `safeAreaInsetTop`과 같다. */
    safeAreaInsetLeft?: number;
  }
}

function normalizeSafeAreaValue(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;

  return `${value}px`;
}

// TODO(next major): global props 읽기와 `env()` fallback을 제거하고 Provider 값만 쓴다.
function resolveDeprecatedSafeAreaInset(
  edge: SafeAreaEdge,
  key: string,
  value: number | undefined,
) {
  const normalized = normalizeSafeAreaValue(value);
  if (normalized === undefined) return `env(safe-area-inset-${edge})`;

  warnDeprecatedGlobalProp(key);
  return normalized;
}

export interface UseSafeAreaReturn {
  safeAreaInsetTop: string;
  safeAreaInsetRight: string;
  safeAreaInsetBottom: string;
  safeAreaInsetLeft: string;
}

/**
 * Lynx 앱에서 top/right/bottom/left safe area inset 값을 반환합니다.
 *
 * 가장 가까운 `SafeAreaProvider`(또는 `SeedProvider`의 `safeAreaInsets`) 값을 `px` 문자열로 반환합니다.
 * Provider가 없으면 deprecated 경로로 global props의 `safeAreaInset*` 값을 쓰고, 그 값도 없으면
 * Lynx CSS `env(safe-area-inset-*)`를 반환합니다. `0`은 유효한 값으로 보고 `"0px"`를 반환합니다.
 */
export function useSafeArea(): UseSafeAreaReturn {
  const insets = useContext(SafeAreaContext);
  const globalProps = useHostGlobalProps();
  const safeAreaInsetTop = globalProps?.safeAreaInsetTop;
  const safeAreaInsetRight = globalProps?.safeAreaInsetRight;
  const safeAreaInsetBottom = globalProps?.safeAreaInsetBottom;
  const safeAreaInsetLeft = globalProps?.safeAreaInsetLeft;

  return useMemo(() => {
    if (insets) {
      return {
        safeAreaInsetTop: `${insets.top}px`,
        safeAreaInsetRight: `${insets.right}px`,
        safeAreaInsetBottom: `${insets.bottom}px`,
        safeAreaInsetLeft: `${insets.left}px`,
      };
    }

    return {
      safeAreaInsetTop: resolveDeprecatedSafeAreaInset("top", "safeAreaInsetTop", safeAreaInsetTop),
      safeAreaInsetRight: resolveDeprecatedSafeAreaInset(
        "right",
        "safeAreaInsetRight",
        safeAreaInsetRight,
      ),
      safeAreaInsetBottom: resolveDeprecatedSafeAreaInset(
        "bottom",
        "safeAreaInsetBottom",
        safeAreaInsetBottom,
      ),
      safeAreaInsetLeft: resolveDeprecatedSafeAreaInset(
        "left",
        "safeAreaInsetLeft",
        safeAreaInsetLeft,
      ),
    };
  }, [insets, safeAreaInsetTop, safeAreaInsetRight, safeAreaInsetBottom, safeAreaInsetLeft]);
}
