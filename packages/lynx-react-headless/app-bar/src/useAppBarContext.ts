import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseAppBarReturn } from "./useAppBar.js";

export interface UseAppBarContext extends UseAppBarReturn {}

const AppBarContext = createContext<UseAppBarContext | null>(null);

export const AppBarProvider: Provider<UseAppBarContext | null> = AppBarContext.Provider;

/**
 * AppBarRoot가 내려준 `useAppBar` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useAppBarContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAppBarContext | null : UseAppBarContext {
  const context = useContext(AppBarContext);
  if (!context && strict) {
    throw new Error("useAppBarContext must be used within an AppBarRoot");
  }
  return context as UseAppBarContext;
}
