import { createContext, useContext } from "react";
import type { UseTabsCarouselReturn } from "./useTabsCarousel";

export interface UseTabsCarouselContext extends UseTabsCarouselReturn {}

const TabsCarouselContext = createContext<UseTabsCarouselContext | null>(null);

export const TabsCarouselProvider = TabsCarouselContext.Provider;

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
