import { createContext, useContext } from "react";
import type { UseNavigationMenuItemReturn } from "./useNavigationMenu";

export interface UseNavigationMenuItemContext extends UseNavigationMenuItemReturn {}

const NavigationMenuItemContext = createContext<UseNavigationMenuItemContext | null>(null);

export const NavigationMenuItemProvider = NavigationMenuItemContext.Provider;

export function useNavigationMenuItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseNavigationMenuItemContext | null : UseNavigationMenuItemContext {
  const context = useContext(NavigationMenuItemContext);
  if (!context && strict) {
    throw new Error("useNavigationMenuItemContext must be used within a NavigationMenuItem");
  }

  return context as UseNavigationMenuItemContext;
}
