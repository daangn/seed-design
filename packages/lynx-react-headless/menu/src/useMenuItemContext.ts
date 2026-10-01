import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseMenuItemReturn } from "./useMenuItem.js";

export interface UseMenuItemContext extends UseMenuItemReturn {}

const MenuItemContext = createContext<UseMenuItemContext | null>(null);

export const MenuItemProvider: Provider<UseMenuItemContext | null> = MenuItemContext.Provider;

/**
 * MenuItem이 내려준 `useMenuItem` 결과(`disabled`·`pressed`)를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
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
