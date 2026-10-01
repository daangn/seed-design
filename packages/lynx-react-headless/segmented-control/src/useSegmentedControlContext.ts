import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSegmentedControlReturn } from "./useSegmentedControl.js";

export interface UseSegmentedControlContext extends UseSegmentedControlReturn {}

const SegmentedControlContext = createContext<UseSegmentedControlContext | null>(null);

export const SegmentedControlProvider: Provider<UseSegmentedControlContext | null> =
  SegmentedControlContext.Provider;

/**
 * `SegmentedControlRoot`가 내려준 `useSegmentedControl` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSegmentedControlContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedControlContext | null : UseSegmentedControlContext {
  const context = useContext(SegmentedControlContext);
  if (!context && strict) {
    throw new Error("useSegmentedControlContext must be used within a SegmentedControlRoot");
  }
  return context as UseSegmentedControlContext;
}
