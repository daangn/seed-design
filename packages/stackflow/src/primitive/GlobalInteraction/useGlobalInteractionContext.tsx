import { createContext, useContext } from "react";
import type { UseGlobalInteractionReturn } from "./useGlobalInteraction";

export interface UseGlobalInteractionContext extends UseGlobalInteractionReturn {}

const GlobalInteractionContext = createContext<UseGlobalInteractionContext | null>(null);

export const GlobalInteractionProvider = GlobalInteractionContext.Provider;

export function useGlobalInteractionContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseGlobalInteractionContext | null : UseGlobalInteractionContext {
  const context = useContext(GlobalInteractionContext);
  if (!context && strict) {
    throw new Error("useGlobalInteractionContext must be used within a GlobalInteractionProvider");
  }

  return context as UseGlobalInteractionContext;
}
