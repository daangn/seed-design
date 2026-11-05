import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseAccordionReturn } from "./useAccordion.js";

export interface UseAccordionContext extends UseAccordionReturn {}

const AccordionContext = createContext<UseAccordionContext | null>(null);

export const AccordionProvider: Provider<UseAccordionContext | null> = AccordionContext.Provider;

/**
 * AccordionRoot가 내려준 `useAccordion` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
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
