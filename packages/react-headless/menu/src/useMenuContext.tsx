import { createContext, useContext } from "react";
import type { UseMenuReturn } from "./useMenu";

export interface UseMenuContext extends UseMenuReturn {}

const MenuContext = createContext<UseMenuContext | null>(null);

export const MenuProvider = MenuContext.Provider;

export function useMenuContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseMenuContext | null : UseMenuContext {
  const context = useContext(MenuContext);
  if (!context && strict) {
    throw new Error("useMenuContext must be used within a Menu");
  }

  return context as UseMenuContext;
}
