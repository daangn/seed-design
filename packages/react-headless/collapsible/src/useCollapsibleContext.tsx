import { createContext, useContext } from "react";
import type { UseCollapsibleReturn } from "./useCollapsible";

export interface UseCollapsibleContext extends UseCollapsibleReturn {}

const CollapsibleContext = createContext<UseCollapsibleContext | null>(null);

export const CollapsibleProvider = CollapsibleContext.Provider;

export function useCollapsibleContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseCollapsibleContext | null : UseCollapsibleContext {
  const context = useContext(CollapsibleContext);
  if (!context && strict) {
    throw new Error("useCollapsibleContext must be used within a CollapsibleRoot");
  }

  return context as UseCollapsibleContext;
}
