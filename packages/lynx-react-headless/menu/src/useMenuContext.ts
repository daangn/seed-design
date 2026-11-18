import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseMenuReturn } from "./useMenu.js";

export interface UseMenuContext extends UseMenuReturn {}

const MenuContext = createContext<UseMenuContext | null>(null);

export const MenuProvider: Provider<UseMenuContext | null> = MenuContext.Provider;

/**
 * MenuRoot가 내려준 `useMenu` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useMenuContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseMenuContext | null : UseMenuContext {
  const context = useContext(MenuContext);
  if (!context && strict) {
    throw new Error("useMenuContext must be used within a MenuRoot");
  }
  return context as UseMenuContext;
}
