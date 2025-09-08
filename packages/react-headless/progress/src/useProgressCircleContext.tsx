import { createContext, useContext } from "react";
import type { UseProgressCircleReturn } from "./useProgress";

export interface UseProgressCircleContext extends UseProgressCircleReturn {}

const ProgressCircleContext = createContext<UseProgressCircleContext | null>(null);

export const ProgressCircleProvider = ProgressCircleContext.Provider;

export function useProgressCircleContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseProgressCircleContext | null : UseProgressCircleContext {
  const context = useContext(ProgressCircleContext);
  if (!context && strict) {
    throw new Error("useProgressCircleContext must be used within a ProgressCircle");
  }

  return context as UseProgressCircleContext;
}
