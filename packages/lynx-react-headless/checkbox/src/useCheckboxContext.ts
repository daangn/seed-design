import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseCheckboxReturn } from "./useCheckbox.js";

export interface UseCheckboxContext extends UseCheckboxReturn {}

const CheckboxContext = createContext<UseCheckboxContext | null>(null);

export const CheckboxProvider: Provider<UseCheckboxContext | null> = CheckboxContext.Provider;

/**
 * `CheckboxRoot`가 내려준 `useCheckbox` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useCheckboxContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseCheckboxContext | null : UseCheckboxContext {
  const context = useContext(CheckboxContext);
  if (!context && strict) {
    throw new Error("useCheckboxContext must be used within a CheckboxRoot");
  }
  return context as UseCheckboxContext;
}
