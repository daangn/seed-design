import { buttonProps } from "@seed-design/dom-utils";
import type { DisplayItemEntry } from "./types";
import { useAttachmentDisplayContext } from "./useAttachmentDisplayContext";

export type UseAttachmentDisplayItemReturn = ReturnType<typeof useAttachmentDisplayItem>;

export function useAttachmentDisplayItem(entry: DisplayItemEntry) {
  const { removeEntry, readOnly } = useAttachmentDisplayContext();

  return {
    ...entry,

    imageProps: {
      src: entry.thumbnailUrl,
      alt: "",
    } satisfies React.ImgHTMLAttributes<HTMLImageElement>,

    // Root `disabled` is intentionally NOT propagated here — disabled still allows pruning
    // already-displayed entries. Root `readOnly` does block removal so the value is preserved.
    removeButtonProps: buttonProps({
      type: "button",
      disabled: readOnly,
      onClick: () => {
        if (readOnly) return;
        removeEntry(entry.id);
      },
    }),
  };
}
