import { createContext, useContext, type ReactElement, type ReactNode } from "@lynx-js/react";

import type { ColorMode } from "../utils/get-seed-class-name";

const ColorModeContext = createContext<ColorMode>("system");

export interface ColorModeProviderProps {
  /** 하위 트리의 색상 모드. 하위 트리 view의 `seed-color-mode-*-only` className과 같은 값을 넘긴다. */
  colorMode: ColorMode;
  children?: ReactNode;
}

/**
 * 하위 트리의 색상 모드만 덮어쓴다. 앱 전체의 색상 모드는 `SeedProvider`의 `colorMode`로 넘긴다.
 *
 * CSS 변수는 className으로 테마를 따르지만, Liquid Glass tint처럼 JS에서 테마를 정하는 곳은 이 값을 쓴다.
 * 하위 트리에 `seed-color-mode-light-only`·`seed-color-mode-dark-only` className을 줬다면 같은 값으로 감싼다.
 *
 * @example
 * ```tsx
 * <ColorModeProvider colorMode="dark-only">
 *   <view className="seed-color-mode-dark-only">
 *     <Chip.Button>칩</Chip.Button>
 *   </view>
 * </ColorModeProvider>
 * ```
 */
export function ColorModeProvider({ colorMode, children }: ColorModeProviderProps): ReactElement {
  return <ColorModeContext.Provider value={colorMode}>{children}</ColorModeContext.Provider>;
}

/** 가장 가까운 `ColorModeProvider`·`SeedProvider`의 색상 모드. 없으면 `"system"`이다. */
export function useColorMode(): ColorMode {
  return useContext(ColorModeContext);
}
