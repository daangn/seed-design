import { createContext, useContext } from "react";
import type { UseFieldsetReturn } from "./useFieldset";

export interface UseFieldsetContext extends UseFieldsetReturn {}

const FieldsetContext = createContext<UseFieldsetContext | null>(null);

export const FieldsetProvider = FieldsetContext.Provider;

export function useFieldsetContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFieldsetContext | null : UseFieldsetContext {
  const context = useContext(FieldsetContext);
  if (!context && strict) {
    throw new Error("useFieldsetContext must be used within a Fieldset");
  }

  return context as UseFieldsetContext;
}
