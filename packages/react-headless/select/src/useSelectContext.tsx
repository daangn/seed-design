import { createContext, useContext } from "react";
import type { UseSelectReturn } from "./useSelect";

export interface UseSelectContext extends UseSelectReturn {}

const SelectContext = createContext<UseSelectContext | null>(null);

export const SelectProvider = SelectContext.Provider;

export function useSelectContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSelectContext | null : UseSelectContext {
  const context = useContext(SelectContext);
  if (!context && strict) {
    throw new Error("useSelectContext must be used within a Select");
  }

  return context as UseSelectContext;
}
