import { createContext, useContext } from "react";
import type { UseAccordionItemReturn } from "./useAccordionItem";

export interface UseAccordionItemContext extends UseAccordionItemReturn {}

const AccordionItemContext = createContext<UseAccordionItemContext | null>(null);

export const AccordionItemProvider = AccordionItemContext.Provider;

export function useAccordionItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAccordionItemContext | null : UseAccordionItemContext {
  const context = useContext(AccordionItemContext);
  if (!context && strict) {
    throw new Error("useAccordionItemContext must be used within an AccordionItem");
  }
  return context as UseAccordionItemContext;
}

export function useAccordionItemStateProps() {
  const { stateProps } = useAccordionItemContext();

  return {
    stateProps,
  };
}
