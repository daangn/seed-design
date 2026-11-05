import { createContext, useContext } from "react";
import type { UseQuantityPickerReturn } from "./useQuantityPicker";

const QuantityPickerContext = createContext<UseQuantityPickerReturn | null>(null);

export const QuantityPickerProvider = QuantityPickerContext.Provider;

export function useQuantityPickerContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseQuantityPickerReturn | null : UseQuantityPickerReturn {
  const context = useContext(QuantityPickerContext);

  if (!context && strict) {
    throw new Error("useQuantityPickerContext must be used within a QuantityPickerRoot.");
  }

  return context as UseQuantityPickerReturn;
}
