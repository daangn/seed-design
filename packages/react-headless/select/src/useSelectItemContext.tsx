import { createContext, type ReactNode, useContext } from "react";
import type { GetItemPropsReturn } from "./useSelect";

export interface UseSelectItemContext extends GetItemPropsReturn {
  /**
   * The item's rich display label. Registered by `SelectItem` and passed straight
   * down here from its own props (no round-trip through the root registry), so a
   * styled `ItemLabel` can render it as its default children.
   */
  label?: ReactNode;
  /**
   * The item's icon. Same direct pass-down as `label`; a styled `ItemPrefixIcon`
   * reads it from here instead of being handed the icon explicitly.
   */
  icon?: ReactNode;
}

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
