import { createContext, useContext } from "react";
import type { UseToggleTipReturn } from "./useToggleTip";

export interface UseToggleTipContext extends UseToggleTipReturn {}

const ToggleTipContext = createContext<UseToggleTipContext | null>(null);

export const ToggleTipProvider = ToggleTipContext.Provider;

export function useToggleTipContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseToggleTipContext | null : UseToggleTipContext {
  const context = useContext(ToggleTipContext);
  if (!context && strict) {
    throw new Error("useToggleTipContext must be used within a ToggleTip");
  }

  return context as UseToggleTipContext;
}
