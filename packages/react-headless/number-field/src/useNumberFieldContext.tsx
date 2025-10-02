import { createContext, useContext } from "react";
import type { UseNumberFieldReturn } from "./useNumberField";

export interface UseNumberFieldContext extends UseNumberFieldReturn {}

const NumberFieldContext = createContext<UseNumberFieldContext | null>(null);

export const NumberFieldProvider = NumberFieldContext.Provider;

export function useNumberFieldContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseNumberFieldContext | null : UseNumberFieldContext {
  const context = useContext(NumberFieldContext);
  if (!context && strict) {
    throw new Error("useNumberFieldContext must be used within a NumberField");
  }

  return context as UseNumberFieldContext;
}

