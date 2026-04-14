import { createContext, useContext } from "react";
import type { GetItemPropsReturn } from "./useMenu";

export interface UseMenuItemContext extends GetItemPropsReturn {}

const MenuItemContext = createContext<UseMenuItemContext | null>(null);

export const MenuItemProvider = MenuItemContext.Provider;

export function useMenuItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseMenuItemContext | null : UseMenuItemContext {
  const context = useContext(MenuItemContext);
  if (!context && strict) {
    throw new Error("useMenuItemContext must be used within a MenuItem");
  }

  return context as UseMenuItemContext;
}
