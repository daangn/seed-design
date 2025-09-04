import { createContext, useContext } from "react";
import type { UseSwitchReturn } from "./useSwitch";

export interface UseSwitchContext extends UseSwitchReturn {}

const SwitchContext = createContext<UseSwitchContext | null>(null);

export const SwitchProvider = SwitchContext.Provider;

export function useSwitchContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSwitchContext | null : UseSwitchContext {
  const context = useContext(SwitchContext);
  if (!context && strict) {
    throw new Error("useSwitchContext must be used within a Switch");
  }

  return context as UseSwitchContext;
}
