import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseRadioGroupItemReturn } from "./useRadioGroupItem.js";

export interface UseRadioGroupItemContext extends UseRadioGroupItemReturn {}

const RadioGroupItemContext = createContext<UseRadioGroupItemContext | null>(null);

export const RadioGroupItemProvider: Provider<UseRadioGroupItemContext | null> =
  RadioGroupItemContext.Provider;

/**
 * `RadioGroupItem`이 내려준 `useRadioGroupItem` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useRadioGroupItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseRadioGroupItemContext | null : UseRadioGroupItemContext {
  const context = useContext(RadioGroupItemContext);
  if (!context && strict) {
    throw new Error("useRadioGroupItemContext must be used within a RadioGroupItem");
  }
  return context as UseRadioGroupItemContext;
}
