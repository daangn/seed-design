import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSelectReturn } from "./useSelect.js";

export interface UseSelectContext extends UseSelectReturn {}

const SelectContext = createContext<UseSelectContext | null>(null);

export const SelectProvider: Provider<UseSelectContext | null> = SelectContext.Provider;

/**
 * SelectRoot가 내려준 `useSelect` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSelectContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSelectContext | null : UseSelectContext {
  const context = useContext(SelectContext);
  if (!context && strict) {
    throw new Error("useSelectContext must be used within a SelectRoot");
  }
  return context as UseSelectContext;
}
