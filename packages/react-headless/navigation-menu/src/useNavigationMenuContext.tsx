import { createContext, useContext } from "react";
import type { UseNavigationMenuReturn } from "./useNavigationMenu";

export interface UseNavigationMenuContext extends UseNavigationMenuReturn {}

const NavigationMenuContext = createContext<UseNavigationMenuContext | null>(null);

export const NavigationMenuProvider = NavigationMenuContext.Provider;

export function useNavigationMenuContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseNavigationMenuContext | null : UseNavigationMenuContext {
  const context = useContext(NavigationMenuContext);
  if (!context && strict) {
    throw new Error("useNavigationMenuContext must be used within a NavigationMenu");
  }

  return context as UseNavigationMenuContext;
}
