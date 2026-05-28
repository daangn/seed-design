import { useMemo } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";
import { getSeedClassName, type ColorMode } from "../utils/get-seed-class-name";
import { useSafeArea } from "./useSafeArea";

export interface UseSeedRootPropsOptions {
  colorMode?: ColorMode;
  safeArea?: boolean;
}

export interface UseSeedRootPropsReturn {
  className: string;
  style?: SeedRootStyle;
}

type SeedRootStyle = CSSProperties &
  Record<"--seed-safe-area-top" | "--seed-safe-area-bottom", string>;

/**
 * Lynx 앱의 root `<page>` 요소에 필요한 SEED props를 반환합니다.
 *
 * 테마/플랫폼 className과 safe area CSS 변수를 한 번에 주입해,
 * 하위 컴포넌트가 `var(--seed-safe-area-top)` /
 * `var(--seed-safe-area-bottom)` 값을 사용할 수 있게 합니다.
 */
export function useSeedRootProps(options?: UseSeedRootPropsOptions): UseSeedRootPropsReturn {
  const { colorMode = "system", safeArea = true } = options ?? {};
  const { safeAreaInsetTop, safeAreaInsetBottom } = useSafeArea();

  return useMemo(
    () => ({
      className: getSeedClassName({ colorMode }),
      style: safeArea
        ? ({
            "--seed-safe-area-top": safeAreaInsetTop,
            "--seed-safe-area-bottom": safeAreaInsetBottom,
          } as SeedRootStyle)
        : undefined,
    }),
    [colorMode, safeArea, safeAreaInsetTop, safeAreaInsetBottom],
  );
}
