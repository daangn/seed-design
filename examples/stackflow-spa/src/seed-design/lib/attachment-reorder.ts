import { RestrictToHorizontalAxis } from "@dnd-kit/abstract/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";
import * as React from "react";

const REORDER_HANDLE_SELECTOR = "[data-attachment-reorder-handle]";

function setRef<T>(ref: React.Ref<T>, value: T | null) {
  if (typeof ref === "function") {
    return ref(value);
  }
  if (ref) {
    ref.current = value;
  }
}

interface UseAttachmentItemReorderOptions {
  id: string;
  index: number;
  name: string;
  label: string;
  disabled: boolean;
  forwardedRef: React.ForwardedRef<HTMLLIElement>;
}

interface AttachmentReorderItemProps extends React.HTMLAttributes<HTMLLIElement> {
  "data-reorderable": string;
  "data-dragging"?: string;
}

export function useAttachmentItemReorder({
  id,
  index,
  name,
  label,
  disabled,
  forwardedRef,
}: UseAttachmentItemReorderOptions) {
  const {
    ref: sortableRef,
    handleRef: sortableHandleRef,
    isDragging,
  } = useSortable({
    id,
    index,
    disabled,
    modifiers: [RestrictToHorizontalAxis],
    data: { name },
  });

  // dnd-kit retains these callback refs, so a stable identity avoids unnecessary unregister/register.
  const itemRef = React.useCallback(
    (item: HTMLLIElement | null) => {
      const forwardedRefCleanup = setRef(forwardedRef, item);
      sortableRef(item);
      sortableHandleRef(item?.querySelector<HTMLButtonElement>(REORDER_HANDLE_SELECTOR) ?? null);

      if (typeof forwardedRefCleanup === "function") {
        return () => {
          forwardedRefCleanup();
          sortableRef(null);
          sortableHandleRef(null);
        };
      }
    },
    [forwardedRef, sortableHandleRef, sortableRef],
  );

  return {
    itemRef,
    itemProps: {
      "aria-label": label,
      "data-reorderable": "",
      "data-dragging": isDragging ? "" : undefined,
    } satisfies AttachmentReorderItemProps,
  };
}
