import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSegmentedTextInputReturn } from "./useSegmentedTextInput.js";

export interface UseSegmentedTextInputContext extends UseSegmentedTextInputReturn {}

const SegmentedTextInputContext = createContext<UseSegmentedTextInputContext | null>(null);

export const SegmentedTextInputProvider: Provider<UseSegmentedTextInputContext | null> =
  SegmentedTextInputContext.Provider;

/**
 * `SegmentedTextInputRoot`가 내려준 `useSegmentedTextInput` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSegmentedTextInputContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedTextInputContext | null : UseSegmentedTextInputContext {
  const context = useContext(SegmentedTextInputContext);
  if (!context && strict) {
    throw new Error("SegmentedTextInput parts must be used within SegmentedTextInputRoot.");
  }
  return context as UseSegmentedTextInputContext;
}
