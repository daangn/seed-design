import { createContext, useContext } from "react";
import type { UseTooltipReturn } from "./useTooltip";

export interface UseTooltipContext extends UseTooltipReturn {}

const TooltipContext = createContext<UseTooltipContext | null>(null);

export const TooltipProvider = TooltipContext.Provider;

export function useTooltipContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTooltipContext | null : UseTooltipContext {
  const context = useContext(TooltipContext);
  if (!context && strict) {
    throw new Error("useTooltipContext must be used within a Tooltip");
  }

  return context as UseTooltipContext;
}
