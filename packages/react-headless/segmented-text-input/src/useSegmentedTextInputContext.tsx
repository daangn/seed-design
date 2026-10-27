import { createContext, useContext } from "react";
import type { UseSegmentedTextInputReturn } from "./useSegmentedTextInput";

export interface UseSegmentedTextInputContext extends UseSegmentedTextInputReturn {}

const SegmentedTextInputContext = createContext<UseSegmentedTextInputContext | null>(null);

export const SegmentedTextInputProvider = SegmentedTextInputContext.Provider;

export function useSegmentedTextInputContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedTextInputContext | null : UseSegmentedTextInputContext {
  const context = useContext(SegmentedTextInputContext);
  if (!context && strict) {
    throw new Error("useSegmentedTextInputContext must be used within a SegmentedTextInput");
  }

  return context as UseSegmentedTextInputContext;
}
