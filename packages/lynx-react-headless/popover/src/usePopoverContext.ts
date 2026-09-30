import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UsePopoverReturn } from "./usePopover.js";

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
