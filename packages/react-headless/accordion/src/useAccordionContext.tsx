import { createContext, useContext } from "react";
import type { UseAccordionReturn } from "./useAccordion";

export interface UseAccordionContext extends UseAccordionReturn {
  registerItem: (item: HTMLElement) => void;
  unregisterItem: (item: HTMLElement) => void;
  getTriggerElements: () => HTMLElement[];
}

const AccordionContext = createContext<UseAccordionContext | null>(null);

export const AccordionProvider = AccordionContext.Provider;

export function useAccordionContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAccordionContext | null : UseAccordionContext {
  const context = useContext(AccordionContext);
  if (!context && strict) {
    throw new Error("useAccordionContext must be used within an AccordionRoot");
  }
  return context as UseAccordionContext;
}
