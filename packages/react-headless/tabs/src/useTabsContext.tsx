import { createContext, useContext } from "react";
import type { UseTabsReturn } from "./useTabs";

export interface UseTabsContext extends UseTabsReturn {}

const TabsContext = createContext<UseTabsContext | null>(null);

export const TabsProvider = TabsContext.Provider;

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
