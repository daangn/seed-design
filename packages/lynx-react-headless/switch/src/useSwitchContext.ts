import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSwitchReturn } from "./useSwitch.js";

export interface UseSwitchContext extends UseSwitchReturn {}

const SwitchContext = createContext<UseSwitchContext | null>(null);

export const SwitchProvider: Provider<UseSwitchContext | null> = SwitchContext.Provider;

/**
 * `SwitchRoot`가 내려준 `useSwitch` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSwitchContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSwitchContext | null : UseSwitchContext {
  const context = useContext(SwitchContext);
  if (!context && strict) {
    throw new Error("useSwitchContext must be used within a SwitchRoot");
  }
  return context as UseSwitchContext;
}
