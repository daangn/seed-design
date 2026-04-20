import { createContext, useContext } from "react";

export interface UseAccordionItemContext {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
}

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
