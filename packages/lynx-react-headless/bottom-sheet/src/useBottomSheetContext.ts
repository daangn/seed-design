import { createContext, useContext, type Provider, type RefObject } from "@lynx-js/react";
import type { SheetRootRef } from "@lynx-js/lynx-ui-sheet";

export interface UseBottomSheetContext {
  /** `SheetRoot`의 imperative handle입니다. 시트가 mount되기 전에도 `open()`을 호출할 수 있습니다. */
  rootRef: RefObject<SheetRootRef | null>;
  /** Root의 `skipAnimation` 값입니다. */
  skipAnimation: boolean;
}

const BottomSheetContext = createContext<UseBottomSheetContext | null>(null);

export const BottomSheetProvider: Provider<UseBottomSheetContext | null> =
  BottomSheetContext.Provider;

/**
 * BottomSheetRoot가 내려준 imperative handle과 `skipAnimation`을 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useBottomSheetContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseBottomSheetContext | null : UseBottomSheetContext {
  const context = useContext(BottomSheetContext);
  if (!context && strict) {
    throw new Error("useBottomSheetContext must be used within a BottomSheetRoot");
  }
  return context as UseBottomSheetContext;
}
