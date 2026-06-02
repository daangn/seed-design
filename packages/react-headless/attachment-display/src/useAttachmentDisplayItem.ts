import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useState } from "react";
import type { DisplayItemEntry } from "./types";
import { useAttachmentDisplayContext } from "./useAttachmentDisplayContext";

export type UseAttachmentDisplayItemReturn = ReturnType<typeof useAttachmentDisplayItem>;

export function useAttachmentDisplayItem(entry: DisplayItemEntry) {
  const { removeEntry, readOnly, stateProps } = useAttachmentDisplayContext();

  const [isOverlayRendered, setIsOverlayRendered] = useState(false);
  const overlayRef = useCallback((node: HTMLElement | null) => {
    setIsOverlayRendered(!!node);
  }, []);

  const overlayStateProps = elementProps({
    "data-has-overlay": dataAttr(isOverlayRendered),
  });

  return {
    ...entry,

    refs: { overlay: overlayRef },

    imageProps: {
      src: entry.thumbnailUrl,
      alt: "",
    } satisfies React.ImgHTMLAttributes<HTMLImageElement>,

    thumbnailProps: { ...overlayStateProps, ...stateProps },
    metadataProps: { ...overlayStateProps, ...stateProps },

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
