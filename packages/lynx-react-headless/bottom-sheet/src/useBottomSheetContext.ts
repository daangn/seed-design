import { createContext, useContext, type Provider, type RefObject } from "@lynx-js/react";
import type { SheetLayerSize, SheetRootRef } from "./engine";

/**
 * 사용자 동작으로 열림 상태가 바뀐 원인입니다. Trigger는 `"trigger"`, CloseButton은 `"closeButton"`,
 * Backdrop 탭은 `"interactOutside"`, 시트를 끌어 닫거나 닫히는 중에 다시 끌어 올리면 `"drag"`입니다.
 */
export type BottomSheetOpenChangeReason = "trigger" | "closeButton" | "interactOutside" | "drag";

export interface BottomSheetOpenChangeDetails {
  reason: BottomSheetOpenChangeReason;
}

export interface UseBottomSheetContext {
  /**
   * Root ref와 같은 imperative handle입니다. 이 handle로 바꾼 열림 상태는 `onOpenChange`로 알리지 않습니다.
   */
  rootRef: RefObject<SheetRootRef | null>;
  /** Root의 `skipAnimation` 값입니다. */
  skipAnimation: boolean;
  /**
   * 사용자 동작으로 열림 상태를 바꿉니다. 상태가 바뀌면 `details`와 함께 `onOpenChange`를 한 번 호출합니다.
   * `open`을 제어하면 `onOpenChange`만 호출하고 시트는 바뀐 `open` 값을 따릅니다.
   */
  setOpen: (open: boolean, details: BottomSheetOpenChangeDetails) => void;
  /**
   * Positioner 레이어를 측정한 크기(px)입니다. `vh`·`vw`는 LynxView 기준이라 레이어와 다를 수 있으므로
   * 레이어 기준 길이는 이 값으로 계산합니다. 측정 전이나 Positioner가 mount되지 않은 동안 축 값은
   * `undefined`입니다.
   */
  layerSize: SheetLayerSize;
}

const BottomSheetContext = createContext<UseBottomSheetContext | null>(null);

export const BottomSheetProvider: Provider<UseBottomSheetContext | null> =
  BottomSheetContext.Provider;

/**
 * BottomSheetRoot가 내려준 imperative handle, `skipAnimation`, `setOpen`을 하위 요소에서 읽습니다.
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
