import { createContext, useContext } from "react";
import type { UseFieldReturn } from "./useField";

export interface UseFieldContext extends UseFieldReturn {}

const FieldContext = createContext<UseFieldContext | null>(null);

export const FieldProvider = FieldContext.Provider;

export function useFieldContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFieldContext | null : UseFieldContext {
  const context = useContext(FieldContext);
  if (!context && strict) {
    throw new Error("useFieldContext must be used within a Field");
  }

  return context as UseFieldContext;
}
