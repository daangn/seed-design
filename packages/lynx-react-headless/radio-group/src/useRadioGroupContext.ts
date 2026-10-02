import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseRadioGroupReturn } from "./useRadioGroup.js";

export interface UseRadioGroupContext extends UseRadioGroupReturn {}

const RadioGroupContext = createContext<UseRadioGroupContext | null>(null);

export const RadioGroupProvider: Provider<UseRadioGroupContext | null> = RadioGroupContext.Provider;

/**
 * `RadioGroupRoot`가 내려준 `useRadioGroup` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useRadioGroupContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseRadioGroupContext | null : UseRadioGroupContext {
  const context = useContext(RadioGroupContext);
  if (!context && strict) {
    throw new Error("useRadioGroupContext must be used within a RadioGroupRoot");
  }
  return context as UseRadioGroupContext;
}
