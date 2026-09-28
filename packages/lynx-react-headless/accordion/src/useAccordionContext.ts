import * as React from "@lynx-js/react";
import type { UseAccordionReturn } from "./useAccordion.js";
import type { UseAccordionItemReturn } from "./useAccordionItem.js";

export const AccordionContext = React.createContext<UseAccordionReturn | null>(null);
export const AccordionItemContext = React.createContext<UseAccordionItemReturn | null>(null);

export function useAccordionContext(consumer: string): UseAccordionReturn {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <AccordionRoot/>.`);
  return context;
}

export function useAccordionItemContext(consumer: string): UseAccordionItemReturn {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <AccordionItem/>.`);
  return context;
}
