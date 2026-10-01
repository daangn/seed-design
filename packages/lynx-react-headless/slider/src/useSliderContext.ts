import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSliderReturn } from "./useSlider.js";

export interface UseSliderContext extends UseSliderReturn {}

const SliderContext = createContext<UseSliderContext | null>(null);

export const SliderProvider: Provider<UseSliderContext | null> = SliderContext.Provider;

/**
 * `SliderRoot`가 내려준 `useSlider` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSliderContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSliderContext | null : UseSliderContext {
  const context = useContext(SliderContext);
  if (!context && strict) {
    throw new Error("useSliderContext must be used within a SliderRoot");
  }
  return context as UseSliderContext;
}
