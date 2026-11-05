import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseToggleReturn } from "./useToggle.js";

export interface UseToggleContext extends UseToggleReturn {}

const ToggleContext = createContext<UseToggleContext | null>(null);

export const ToggleProvider: Provider<UseToggleContext | null> = ToggleContext.Provider;

/**
 * ToggleRoot가 내려준 `useToggle` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useToggleContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseToggleContext | null : UseToggleContext {
  const context = useContext(ToggleContext);
  if (!context && strict) {
    throw new Error("useToggleContext must be used within a ToggleRoot");
  }
  return context as UseToggleContext;
}
