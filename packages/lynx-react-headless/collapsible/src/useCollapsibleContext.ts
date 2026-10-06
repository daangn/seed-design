import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseCollapsibleReturn } from "./useCollapsible.js";

export interface UseCollapsibleContext extends UseCollapsibleReturn {}

const CollapsibleContext = createContext<UseCollapsibleContext | null>(null);

export const CollapsibleProvider: Provider<UseCollapsibleContext | null> =
  CollapsibleContext.Provider;

/**
 * `CollapsibleRoot`나 `CollapsibleProvider`가 내려준 `useCollapsible` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useCollapsibleContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseCollapsibleContext | null : UseCollapsibleContext {
  const context = useContext(CollapsibleContext);
  if (!context && strict) {
    throw new Error("useCollapsibleContext must be used within a CollapsibleRoot");
  }
  return context as UseCollapsibleContext;
}
