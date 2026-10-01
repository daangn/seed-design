import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseFieldReturn } from "./useField.js";

export interface UseFieldContext extends UseFieldReturn {}

const FieldContext = createContext<UseFieldContext | null>(null);

export const FieldProvider: Provider<UseFieldContext | null> = FieldContext.Provider;

/**
 * `FieldRoot`가 내려준 `useField` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환하므로 Field 없이도 쓰이는 입력에 사용합니다.
 */
export function useFieldContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseFieldContext | null : UseFieldContext {
  const context = useContext(FieldContext);
  if (!context && strict) {
    throw new Error("useFieldContext must be used within a FieldRoot");
  }
  return context as UseFieldContext;
}
