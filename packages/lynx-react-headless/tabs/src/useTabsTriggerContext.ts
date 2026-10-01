import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseTabsTriggerReturn } from "./useTabsTrigger.js";

export interface UseTabsTriggerContext extends UseTabsTriggerReturn {}

const TabsTriggerContext = createContext<UseTabsTriggerContext | null>(null);

export const TabsTriggerProvider: Provider<UseTabsTriggerContext | null> =
  TabsTriggerContext.Provider;

/**
 * `TabsTrigger`의 선택·disabled·눌림 상태와 native props를 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useTabsTriggerContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTabsTriggerContext | null : UseTabsTriggerContext {
  const context = useContext(TabsTriggerContext);
  if (!context && strict) {
    throw new Error("useTabsTriggerContext must be used within a TabsTrigger");
  }
  return context as UseTabsTriggerContext;
}
