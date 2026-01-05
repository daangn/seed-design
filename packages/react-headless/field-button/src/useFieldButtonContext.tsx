import { createContext, useContext } from "react";
import type { UseFieldButtonReturn } from "./useFieldButton";

export interface UseFieldButtonContext extends UseFieldButtonReturn {}

const FieldButtonContext = createContext<UseFieldButtonContext | null>(null);

export const FieldButtonProvider = FieldButtonContext.Provider;

export function useFieldButtonContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFieldButtonContext | null : UseFieldButtonContext {
  const context = useContext(FieldButtonContext);
  if (!context && strict) {
    throw new Error("useFieldButtonContext must be used within a FieldButton");
  }

  return context as UseFieldButtonContext;
}
