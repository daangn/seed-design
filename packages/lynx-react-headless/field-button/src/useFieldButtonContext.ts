import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseFieldButtonReturn } from "./useFieldButton.js";

export interface UseFieldButtonContext extends UseFieldButtonReturn {}

const FieldButtonContext = createContext<UseFieldButtonContext | null>(null);

export const FieldButtonProvider: Provider<UseFieldButtonContext | null> =
  FieldButtonContext.Provider;

/**
 * `FieldButtonRoot`가 내려준 `useFieldButton` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useFieldButtonContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFieldButtonContext | null : UseFieldButtonContext {
  const context = useContext(FieldButtonContext);
  if (!context && strict) {
    throw new Error("useFieldButtonContext must be used within a FieldButtonRoot");
  }
  return context as UseFieldButtonContext;
}
