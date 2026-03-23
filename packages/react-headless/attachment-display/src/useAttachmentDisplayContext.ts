import { createContext, useContext } from "react";
import type { UseAttachmentDisplayReturn } from "./useAttachmentDisplay";
import type { DisplayItemEntry } from "./types";

// =============================================================================
// AttachmentDisplay Context
// =============================================================================

export type UseAttachmentDisplayContext = UseAttachmentDisplayReturn;

const AttachmentDisplayContext = createContext<UseAttachmentDisplayContext | null>(null);

export const AttachmentDisplayProvider = AttachmentDisplayContext.Provider;

export function useAttachmentDisplayContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAttachmentDisplayContext | null : UseAttachmentDisplayContext {
  const context = useContext(AttachmentDisplayContext);
  if (!context && strict) {
    throw new Error("useAttachmentDisplayContext must be used within an AttachmentDisplay");
  }

  return context as UseAttachmentDisplayContext;
}

// =============================================================================
// AttachmentDisplayItem Context
// =============================================================================

export type AttachmentDisplayItemContext = DisplayItemEntry;

const ItemContext = createContext<AttachmentDisplayItemContext | null>(null);

export const AttachmentDisplayItemProvider = ItemContext.Provider;

export function useAttachmentDisplayItemContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? AttachmentDisplayItemContext | null : AttachmentDisplayItemContext {
  const context = useContext(ItemContext);
  if (!context && strict) {
    throw new Error("useAttachmentDisplayItemContext must be used within an AttachmentDisplayItem");
  }

  return context as AttachmentDisplayItemContext;
}
