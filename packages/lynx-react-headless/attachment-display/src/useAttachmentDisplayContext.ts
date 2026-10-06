import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseAttachmentDisplayReturn } from "./useAttachmentDisplay.js";
import type { UseAttachmentDisplayItemReturn } from "./useAttachmentDisplayItem.js";

export interface UseAttachmentDisplayContext extends UseAttachmentDisplayReturn {}

const AttachmentDisplayContext = createContext<UseAttachmentDisplayContext | null>(null);

export const AttachmentDisplayProvider: Provider<UseAttachmentDisplayContext | null> =
  AttachmentDisplayContext.Provider;

/**
 * `AttachmentDisplayRoot`가 내려준 `useAttachmentDisplay` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useAttachmentDisplayContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAttachmentDisplayContext | null : UseAttachmentDisplayContext {
  const context = useContext(AttachmentDisplayContext);
  if (!context && strict) {
    throw new Error("useAttachmentDisplayContext must be used within an AttachmentDisplayRoot");
  }
  return context as UseAttachmentDisplayContext;
}

export type AttachmentDisplayItemContext = UseAttachmentDisplayItemReturn;

const ItemContext = createContext<AttachmentDisplayItemContext | null>(null);

/** item 파트(`ItemImage`·`ItemRemoveButton` 등)에 `useAttachmentDisplayItem` 결과를 제공합니다. */
export const AttachmentDisplayItemProvider: Provider<AttachmentDisplayItemContext | null> =
  ItemContext.Provider;

/**
 * `AttachmentDisplayItemProvider`가 내려준 item 상태를 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useAttachmentDisplayItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? AttachmentDisplayItemContext | null : AttachmentDisplayItemContext {
  const context = useContext(ItemContext);
  if (!context && strict) {
    throw new Error(
      "useAttachmentDisplayItemContext must be used within an AttachmentDisplayItemProvider",
    );
  }
  return context as AttachmentDisplayItemContext;
}
