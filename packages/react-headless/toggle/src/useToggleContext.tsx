import { createContext, useContext } from "react";
import type { UseToggleReturn } from "./useToggle";

export interface UseToggleContext extends UseToggleReturn {}

const ToggleContext = createContext<UseToggleContext | null>(null);

export const ToggleProvider = ToggleContext.Provider;

export function useToggleContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseToggleContext | null : UseToggleContext {
  const context = useContext(ToggleContext);
  if (!context && strict) {
    throw new Error("useToggleContext must be used within a Toggle");
  }

  return context as UseToggleContext;
}
