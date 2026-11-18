"use client";

import { dataAttr } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";

// Shared by AttachmentInput and AttachmentDisplay, which render the same attachment-input-item recipe.
const reorderHandleTracker = createRenderTrackingContext("AttachmentItemReorderHandle");

export const ReorderHandleTrackingProvider = reorderHandleTracker.Provider;

export function useReorderHandleTrackRef(): (node: HTMLElement | null) => void {
  return reorderHandleTracker.useRenderTracking().trackRef;
}

export interface AttachmentItemRootProps
  extends PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  dragging?: boolean;
}

export const AttachmentItemRoot = React.forwardRef<HTMLLIElement, AttachmentItemRootProps>(
  ({ dragging, ...props }, ref) => {
    const { isRendered } = reorderHandleTracker.useRenderTracking();

    return (
      <Primitive.li
        ref={ref}
        data-reorderable={dataAttr(isRendered)}
        data-dragging={dataAttr(dragging)}
        {...props}
      />
    );
  },
);
AttachmentItemRoot.displayName = "AttachmentItemRoot";
