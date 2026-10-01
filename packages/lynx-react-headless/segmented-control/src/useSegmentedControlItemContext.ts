import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseSegmentedControlItemReturn } from "./useSegmentedControlItem.js";

export interface UseSegmentedControlItemContext extends UseSegmentedControlItemReturn {}

const SegmentedControlItemContext = createContext<UseSegmentedControlItemContext | null>(null);

export const SegmentedControlItemProvider: Provider<UseSegmentedControlItemContext | null> =
  SegmentedControlItemContext.Provider;

/**
 * `SegmentedControlItem`이 내려준 `useSegmentedControlItem` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSegmentedControlItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedControlItemContext | null : UseSegmentedControlItemContext {
  const context = useContext(SegmentedControlItemContext);
  if (!context && strict) {
    throw new Error("useSegmentedControlItemContext must be used within a SegmentedControlItem");
  }
  return context as UseSegmentedControlItemContext;
}
