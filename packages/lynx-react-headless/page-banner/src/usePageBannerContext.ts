import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UsePageBannerReturn } from "./usePageBanner.js";

export interface UsePageBannerContext extends UsePageBannerReturn {}

const PageBannerContext = createContext<UsePageBannerContext | null>(null);

export const PageBannerProvider: Provider<UsePageBannerContext | null> = PageBannerContext.Provider;

/**
 * PageBannerRoot가 내려준 `usePageBanner` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function usePageBannerContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UsePageBannerContext | null : UsePageBannerContext {
  const context = useContext(PageBannerContext);
  if (!context && strict) {
    throw new Error("usePageBannerContext must be used within a PageBannerRoot");
  }
  return context as UsePageBannerContext;
}
