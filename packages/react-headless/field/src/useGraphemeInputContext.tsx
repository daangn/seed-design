import { createContext, useContext } from "react";
import type { UseGraphemeInputReturn } from "./useGraphemeInput";

export interface UseGraphemeInputContext extends UseGraphemeInputReturn {}

const GraphemeInputContext = createContext<UseGraphemeInputContext | null>(null);

export const GraphemeInputProvider = GraphemeInputContext.Provider;

export function useGraphemeInputContext<T extends boolean | undefined = true>({
  strict = true,
}: { strict?: T } = {}): T extends false
  ? UseGraphemeInputContext | null
  : UseGraphemeInputContext {
  const context = useContext(GraphemeInputContext);
  if (!context && strict) {
    throw new Error("useGraphemeInputContext must be used within a GraphemeInput");
  }

  return context as UseGraphemeInputContext;
}
