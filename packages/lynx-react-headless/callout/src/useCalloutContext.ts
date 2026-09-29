import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseCalloutReturn } from "./useCallout.js";

export interface UseCalloutContext extends UseCalloutReturn {}

const CalloutContext = createContext<UseCalloutContext | null>(null);

export const CalloutProvider: Provider<UseCalloutContext | null> = CalloutContext.Provider;

/**
 * CalloutRoot가 내려준 `useCallout` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useCalloutContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseCalloutContext | null : UseCalloutContext {
  const context = useContext(CalloutContext);
  if (!context && strict) {
    throw new Error("useCalloutContext must be used within a CalloutRoot");
  }
  return context as UseCalloutContext;
}
