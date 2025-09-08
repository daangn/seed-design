import { createContext, useContext } from "react";
import type { UseAppBarReturn } from "./useAppBar";

export interface UseAppBarContext extends UseAppBarReturn {}

const AppBarContext = createContext<UseAppBarContext | null>(null);

export const AppBarProvider = AppBarContext.Provider;

export function useAppBarContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAppBarContext | null : UseAppBarContext {
  const context = useContext(AppBarContext);
  if (!context && strict) {
    throw new Error("useAppBarContext must be used within a AppBar");
  }

  return context as UseAppBarContext;
}
