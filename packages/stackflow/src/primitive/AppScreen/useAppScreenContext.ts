import { createContext, useContext } from "react";
import type { UseAppScreenReturn } from "./useAppScreen";

export interface UseAppScreenContext extends UseAppScreenReturn {}

const AppScreenContext = createContext<UseAppScreenContext | null>(null);

export const AppScreenProvider = AppScreenContext.Provider;

export function useAppScreenContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAppScreenContext | null : UseAppScreenContext {
  const context = useContext(AppScreenContext);
  if (!context && strict) {
    throw new Error("useAppScreenContext must be used within a AppScreen");
  }

  return context as UseAppScreenContext;
}
