import { createContext, useContext } from "react";
import type { UseCheckboxReturn } from "./useCheckbox";

export interface UseCheckboxContext extends UseCheckboxReturn {}

const CheckboxContext = createContext<UseCheckboxContext | null>(null);

export const CheckboxProvider = CheckboxContext.Provider;

export function useCheckboxContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseCheckboxContext | null : UseCheckboxContext {
  const context = useContext(CheckboxContext);
  if (!context && strict) {
    throw new Error("useCheckboxContext must be used within a Checkbox");
  }

  return context as UseCheckboxContext;
}
