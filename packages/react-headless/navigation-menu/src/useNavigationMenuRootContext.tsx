import { createContext, useContext } from "react";
import type { UseNavigationMenuRootReturn } from "./useNavigationMenu";

export interface UseNavigationMenuRootContext extends UseNavigationMenuRootReturn {}

const NavigationMenuRootContext = createContext<UseNavigationMenuRootContext | null>(null);

export const NavigationMenuRootProvider = NavigationMenuRootContext.Provider;

export function useNavigationMenuRootContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseNavigationMenuRootContext | null : UseNavigationMenuRootContext {
  const context = useContext(NavigationMenuRootContext);
  if (!context && strict) {
    throw new Error("useNavigationMenuRootContext must be used within a NavigationMenuRoot");
  }

  return context as UseNavigationMenuRootContext;
}
