import { createContext, useContext, useSyncExternalStore, type Provider } from "@lynx-js/react";
import type { PopoverPositionSnapshot, UsePopoverReturn } from "./usePopover.js";

export interface UsePopoverContext extends UsePopoverReturn {}

const PopoverContext = createContext<UsePopoverContext | null>(null);

export const PopoverProvider: Provider<UsePopoverContext | null> = PopoverContext.Provider;

/**
 * PopoverRoot가 내려준 `usePopover` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function usePopoverContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UsePopoverContext | null : UsePopoverContext {
  const context = useContext(PopoverContext);
  if (!context && strict) {
    throw new Error("usePopoverContext must be used within a PopoverRoot");
  }
  return context as UsePopoverContext;
}

/**
 * 가까운 Popover의 위치와 측정 rect를 구독합니다. 열린 동안 매 frame 바뀔 수 있으므로 위치를 그리는
 * 요소에서만 읽습니다. `selector`가 같은 값을 반환하면 다시 렌더링하지 않으므로 필요한 값만 고르세요.
 */
export function usePopoverPosition(): PopoverPositionSnapshot;
export function usePopoverPosition<T>(selector: (snapshot: PopoverPositionSnapshot) => T): T;
export function usePopoverPosition<T>(
  selector: (snapshot: PopoverPositionSnapshot) => T = (snapshot) => snapshot as T,
): T {
  const { positionStore } = usePopoverContext();
  return useSyncExternalStore(positionStore.subscribe, () => selector(positionStore.getSnapshot()));
}
