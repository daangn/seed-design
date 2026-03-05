import { createContext, useContext } from "react";
import type { UseMiddleTruncateReturn } from "./useMiddleTruncate";

export interface UseMiddleTruncateContext extends UseMiddleTruncateReturn {}

const MiddleTruncateContext = createContext<UseMiddleTruncateContext | null>(null);

export const MiddleTruncateProvider = MiddleTruncateContext.Provider;

export function useMiddleTruncateContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseMiddleTruncateContext | null : UseMiddleTruncateContext {
  const context = useContext(MiddleTruncateContext);
  if (!context && strict) {
    throw new Error("useMiddleTruncateContext must be used within a MiddleTruncateRoot");
  }

  return context as UseMiddleTruncateContext;
}
