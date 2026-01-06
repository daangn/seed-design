import { createContext, useContext } from "react";
import type { UseSnackbarReturn } from "./useSnackbar";

export interface UseSnackbarContext extends UseSnackbarReturn {}

const SnackbarContext = createContext<UseSnackbarContext | null>(null);

export const SnackbarProvider = SnackbarContext.Provider;

export function useSnackbarContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSnackbarContext | null : UseSnackbarContext {
  const context = useContext(SnackbarContext);
  if (!context && strict) {
    throw new Error("useSnackbarContext must be used within a SnackbarProvider");
  }

  return context as UseSnackbarContext;
}
