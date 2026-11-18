import { useContext, useMemo } from "@lynx-js/react";

import { SafeAreaContext } from "./SafeAreaProvider.jsx";

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
 * Provider가 없으면 모든 방향에 `"0px"`를 반환합니다.
 */
export function useSafeArea(): UseSafeAreaReturn {
  const insets = useContext(SafeAreaContext);

  return useMemo(
    () => ({
      safeAreaInsetTop: `${insets?.top ?? 0}px`,
      safeAreaInsetRight: `${insets?.right ?? 0}px`,
      safeAreaInsetBottom: `${insets?.bottom ?? 0}px`,
      safeAreaInsetLeft: `${insets?.left ?? 0}px`,
    }),
    [insets],
  );
}
