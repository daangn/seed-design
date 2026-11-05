import { createContext, useContext } from "react";
import type { UseSideNavigationReturn } from "./useSideNavigation";

export interface UseSideNavigationContext extends UseSideNavigationReturn {}

const SideNavigationContext = createContext<UseSideNavigationContext | null>(null);

export const SideNavigationProvider = SideNavigationContext.Provider;

export function useSideNavigationContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSideNavigationContext | null : UseSideNavigationContext {
  const context = useContext(SideNavigationContext);
  if (!context && strict) {
    throw new Error("useSideNavigationContext must be used within a SideNavigationRoot");
  }

  return context as UseSideNavigationContext;
}
