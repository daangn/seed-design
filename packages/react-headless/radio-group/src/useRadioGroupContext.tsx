import { createContext, useContext } from "react";
import type { UseRadioGroupReturn } from "./useRadioGroup";

export interface UseRadioGroupContext extends UseRadioGroupReturn {}

const RadioGroupContext = createContext<UseRadioGroupContext | null>(null);

export const RadioGroupProvider = RadioGroupContext.Provider;

export function useRadioGroupContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseRadioGroupContext | null : UseRadioGroupContext {
  const context = useContext(RadioGroupContext);
  if (!context && strict) {
    throw new Error("useRadioGroupContext must be used within a RadioGroup");
  }

  return context as UseRadioGroupContext;
}
