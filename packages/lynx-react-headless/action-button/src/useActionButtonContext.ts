import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseActionButtonReturn } from "./useActionButton.js";

export interface UseActionButtonContext extends UseActionButtonReturn {}

const ActionButtonContext = createContext<UseActionButtonContext | null>(null);

export const ActionButtonProvider: Provider<UseActionButtonContext | null> =
  ActionButtonContext.Provider;

/**
 * ActionButtonRoot가 내려준 `useActionButton` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useActionButtonContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseActionButtonContext | null : UseActionButtonContext {
  const context = useContext(ActionButtonContext);
  if (!context && strict) {
    throw new Error("useActionButtonContext must be used within an ActionButtonRoot");
  }
  return context as UseActionButtonContext;
}
