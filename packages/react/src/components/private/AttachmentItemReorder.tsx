"use client";

import { Primitive } from "@seed-design/react-primitive";
import * as React from "react";

interface InternalAttachmentItemReorderMarker {
  "data-reorderable"?: string;
}

export function getInternalAttachmentItemReorder<
  ItemProps extends React.HTMLAttributes<HTMLLIElement>,
>(itemProps: ItemProps) {
  const reorderableItemProps = itemProps as ItemProps & InternalAttachmentItemReorderMarker;
  const enabled = reorderableItemProps["data-reorderable"] !== undefined;

  if (!enabled) {
    return { itemProps, handleProps: null };
  }

  return {
    itemProps: {
      ...itemProps,
      "aria-label": undefined,
    },
    handleProps: {
      "aria-label": itemProps["aria-label"],
    } satisfies React.ButtonHTMLAttributes<HTMLButtonElement>,
  };
}

interface InternalAttachmentItemReorderHandleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InternalAttachmentItemReorderHandle = React.forwardRef<
  HTMLButtonElement,
  InternalAttachmentItemReorderHandleProps
>((props, ref) => (
  <Primitive.button ref={ref} type="button" data-attachment-reorder-handle="" {...props} />
));
InternalAttachmentItemReorderHandle.displayName = "InternalAttachmentItemReorderHandle";
