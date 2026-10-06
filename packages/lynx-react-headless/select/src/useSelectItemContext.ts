import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSelectItemReturn } from "./useSelectItem.js";

export interface UseSelectItemContext extends UseSelectItemReturn {}

const SelectItemContext = createContext<UseSelectItemContext | null>(null);

export const SelectItemProvider: Provider<UseSelectItemContext | null> = SelectItemContext.Provider;

/**
 * SelectItem이 내려준 `useSelectItem` 결과(`selected`·`disabled`·`pressed`·표시 정보)를 하위 요소에서
 * 읽습니다. `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSelectItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSelectItemContext | null : UseSelectItemContext {
  const context = useContext(SelectItemContext);
  if (!context && strict) {
    throw new Error("useSelectItemContext must be used within a SelectItem");
  }
  return context as UseSelectItemContext;
}
