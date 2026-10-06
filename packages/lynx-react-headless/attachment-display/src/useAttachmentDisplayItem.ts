import { useMemo } from "@lynx-js/react";
import type { DisplayItemEntry } from "./types.js";
import { useAttachmentDisplayContext } from "./useAttachmentDisplayContext.js";

export type UseAttachmentDisplayItemReturn = DisplayItemEntry & {
  /** `thumbnailUrl`이 있을 때만 있습니다. `alt`는 `name`입니다. */
  imageProps?: { src: string; alt?: string };
  /** Root가 `readOnly`이면 삭제하지 않습니다. `disabled`에서는 삭제합니다. */
  removeButtonProps: { bindtap: () => void };
};

/**
 * @platform Lynx
 *
 * 첨부 항목 하나의 미리보기·삭제 연결을 만듭니다. 결과를 `AttachmentDisplayItemProvider`로 내려
 * item 파트가 읽게 합니다. `AttachmentDisplayRoot` 안에서 호출합니다.
 */
export function useAttachmentDisplayItem(entry: DisplayItemEntry): UseAttachmentDisplayItemReturn {
  const { readOnly, removeEntry } = useAttachmentDisplayContext();

  return useMemo(
    () => ({
      ...entry,
      imageProps: entry.thumbnailUrl ? { src: entry.thumbnailUrl, alt: entry.name } : undefined,
      removeButtonProps: {
        bindtap: () => {
          "background only";
          if (!readOnly) removeEntry(entry.id);
        },
      },
    }),
    [entry, readOnly, removeEntry],
  );
}
