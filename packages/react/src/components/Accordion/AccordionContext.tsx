"use client";

import { createContext, useContext } from "react";
import type { UseAccordionReturn } from "./useAccordion";

export interface AccordionContext extends UseAccordionReturn {}

const AccordionCtx = createContext<AccordionContext | null>(null);

export const AccordionProvider = AccordionCtx.Provider;

export function useAccordionContext(): AccordionContext {
  const context = useContext(AccordionCtx);
  if (!context) {
    throw new Error("useAccordionContext must be used within an AccordionRoot");
  }
  return context;
}

export interface AccordionItemContext {
  value: string;
  open: boolean;
  disabled: boolean;
}

const AccordionItemCtx = createContext<AccordionItemContext | null>(null);

export const AccordionItemProvider = AccordionItemCtx.Provider;

export function useAccordionItemContext(): AccordionItemContext {
  const context = useContext(AccordionItemCtx);
  if (!context) {
    throw new Error("useAccordionItemContext must be used within an AccordionItem");
  }
  return context;
}
