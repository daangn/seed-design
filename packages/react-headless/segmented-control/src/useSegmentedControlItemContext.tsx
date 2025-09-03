import { createContext, useContext } from "react";
import type { GetItemPropsReturn } from "./useSegmentedControl";

export interface UseSegmentedControlItemContext extends GetItemPropsReturn {}

const SegmentedControlItemContext = createContext<UseSegmentedControlItemContext | null>(null);

export const SegmentedControlItemProvider = SegmentedControlItemContext.Provider;

export function useSegmentedControlItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedControlItemContext | null : UseSegmentedControlItemContext {
  const context = useContext(SegmentedControlItemContext);
  if (!context && strict) {
    throw new Error("useSegmentedControlItemContext must be used within a SegmentedControlItem");
  }

  return context as UseSegmentedControlItemContext;
}
