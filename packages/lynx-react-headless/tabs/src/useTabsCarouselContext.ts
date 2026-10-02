import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseTabsCarouselReturn } from "./useTabsCarousel.js";

export interface UseTabsCarouselContext extends UseTabsCarouselReturn {}

const TabsCarouselContext = createContext<UseTabsCarouselContext | null>(null);

export const TabsCarouselProvider: Provider<UseTabsCarouselContext | null> =
  TabsCarouselContext.Provider;

/**
 * `TabsCarousel`의 swipe 설정과 콜백을 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useTabsCarouselContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTabsCarouselContext | null : UseTabsCarouselContext {
  const context = useContext(TabsCarouselContext);
  if (!context && strict) {
    throw new Error("useTabsCarouselContext must be used within a TabsCarousel");
  }
  return context as UseTabsCarouselContext;
}
