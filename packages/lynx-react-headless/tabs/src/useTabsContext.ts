import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseTabsReturn } from "./useTabs.js";

export interface UseTabsContext extends UseTabsReturn {}

const TabsContext = createContext<UseTabsContext | null>(null);

export const TabsProvider: Provider<UseTabsContext | null> = TabsContext.Provider;

/**
 * `TabsRoot`가 내려준 `useTabs` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useTabsContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTabsContext | null : UseTabsContext {
  const context = useContext(TabsContext);
  if (!context && strict) {
    throw new Error("useTabsContext must be used within a Tabs");
  }
  return context as UseTabsContext;
}
