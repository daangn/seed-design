import { createContext, useContext } from "react";
import type { UseSegmentedControlReturn } from "./useSegmentedControl";

export interface UseSegmentedControlContext extends UseSegmentedControlReturn {}

const SegmentedControlContext = createContext<UseSegmentedControlContext | null>(null);

export const SegmentedControlProvider = SegmentedControlContext.Provider;

export function useSegmentedControlContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedControlContext | null : UseSegmentedControlContext {
  const context = useContext(SegmentedControlContext);
  if (!context && strict) {
    throw new Error("useSegmentedControlContext must be used within a SegmentedControl");
  }

  return context as UseSegmentedControlContext;
}
