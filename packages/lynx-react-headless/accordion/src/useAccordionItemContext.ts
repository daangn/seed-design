import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseAccordionItemReturn } from "./useAccordionItem.js";

export interface UseAccordionItemContext extends UseAccordionItemReturn {}

const AccordionItemContext = createContext<UseAccordionItemContext | null>(null);

export const AccordionItemProvider: Provider<UseAccordionItemContext | null> =
  AccordionItemContext.Provider;

/**
 * AccordionItem이 내려준 `useAccordionItem` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
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
