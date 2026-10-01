import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseQuantityPickerReturn } from "./useQuantityPicker.js";

export interface UseQuantityPickerContext extends UseQuantityPickerReturn {}

const QuantityPickerContext = createContext<UseQuantityPickerContext | null>(null);

export const QuantityPickerProvider: Provider<UseQuantityPickerContext | null> =
  QuantityPickerContext.Provider;

/**
 * `QuantityPickerRoot`가 내려준 `useQuantityPicker` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useQuantityPickerContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseQuantityPickerContext | null : UseQuantityPickerContext {
  const context = useContext(QuantityPickerContext);
  if (!context && strict) {
    throw new Error("useQuantityPickerContext must be used within a QuantityPickerRoot");
  }
  return context as UseQuantityPickerContext;
}
