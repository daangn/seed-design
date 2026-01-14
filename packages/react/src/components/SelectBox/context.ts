import { selectBox } from "@seed-design/css/recipes/select-box";
import { selectBoxGroup } from "@seed-design/css/recipes/select-box-group";
import { createContext, useContext } from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

export const { PropsProvider: GroupPropsProvider } = createRecipeContext(selectBoxGroup);
export const { PropsProvider, ClassNamesProvider, withContext, useProps, useClassNames } =
  createSlotRecipeContext(selectBox);

export interface ItemContextValue {
  /**
   * Controls when the footer is visible.
   * - `always`: Footer is always visible
   * - `when-selected`: Footer is only visible when the item is selected
   * @default "when-selected"
   */
  footerVisibility: "always" | "when-selected";

  id: string;
}

const ItemContext = createContext<ItemContextValue | null>(null);

export const ItemContextProvider = ItemContext.Provider;

export function useItemContext() {
  return useContext(ItemContext);
}

export const getFooterId = (id: string) => `select-box:${id}:footer`;
