import { createContext, useContext } from "react";
import type { GetItemPropsReturn } from "./useRadioGroup";

export interface UseRadioGroupItemContext extends GetItemPropsReturn {}

const RadioGroupItemContext = createContext<UseRadioGroupItemContext | null>(null);

export const RadioGroupItemProvider = RadioGroupItemContext.Provider;

export function useRadioGroupItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseRadioGroupItemContext | null : UseRadioGroupItemContext {
  const context = useContext(RadioGroupItemContext);
  if (!context && strict) {
    throw new Error("useRadioGroupItemContext must be used within a RadioGroupItem");
  }

  return context as UseRadioGroupItemContext;
}
