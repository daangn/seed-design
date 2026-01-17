import { selectBox } from "@seed-design/css/recipes/select-box";
import { createContext, useCallback, useContext, useState } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

export const { PropsProvider, ClassNamesProvider, withContext, useProps, useClassNames } =
  createSlotRecipeContext(selectBox);

interface FooterStateContextValue {
  isFooterRendered: boolean;
  footerRef: (node: HTMLDivElement | null) => void;
}

const FooterStateContext = createContext<FooterStateContextValue | null>(null);

// TODO: rename
export function useFooterState() {
  const [isFooterRendered, setIsFooterRendered] = useState(false);
  const footerRef = useCallback((node: HTMLDivElement | null) => {
    setIsFooterRendered(!!node);
  }, []);

  return { isFooterRendered, footerRef };
}

export const FooterStateProvider = FooterStateContext.Provider;

export function useFooterStateContext() {
  return useContext(FooterStateContext);
}
