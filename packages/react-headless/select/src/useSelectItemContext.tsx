import { createContext, useContext } from "react";
import type { GetItemPropsReturn } from "./useSelect";

export interface UseSelectItemContext extends GetItemPropsReturn {}

const SelectItemContext = createContext<UseSelectItemContext | null>(null);

export const SelectItemProvider = SelectItemContext.Provider;

export function useSelectItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSelectItemContext | null : UseSelectItemContext {
  const context = useContext(SelectItemContext);
  if (!context && strict) {
    throw new Error("useSelectItemContext must be used within a SelectItem");
  }

  return context as UseSelectItemContext;
}
