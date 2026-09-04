"use client";

import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/css/recipes/attachment-input-item";
import { composeRefs, useComposedRefs } from "@radix-ui/react-compose-refs";
import { dataAttr } from "@seed-design/dom-utils";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  AttachmentDisplayItemProvider,
  useAttachmentDisplayContext,
  useAttachmentDisplayItem,
  type DisplayItemEntry,
} from "@seed-design/react-attachment-display";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { clsx } from "cn";
import * as React from "react";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import { withScaleFeedback } from "../../utils/withScaleFeedback";

const { useClassNames, ClassNamesProvider, withContext } =
  createSlotRecipeContext(attachmentInputItem);

// Tracks whether a Backdrop (overlay) is rendered so the Thumbnail/Metadata can emit
// `data-has-overlay` for the css recipe. Styling-only signal owned by the styled layer.
const overlayTracker = createRenderTrackingContext("AttachmentDisplayItemOverlay");

export interface AttachmentDisplayItemProps
  extends Omit<AttachmentInputItemVariantProps, "type">,
    PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  entry: DisplayItemEntry;
}

export const AttachmentDisplayItem = React.forwardRef<HTMLLIElement, AttachmentDisplayItemProps>(
  ({ className, entry, ...props }, ref) => {
    const { stateProps } = useAttachmentDisplayContext();
    const api = useAttachmentDisplayItem(entry);

    const [variantProps, otherProps] = attachmentInputItem.splitVariantProps({
      type: "image",
      ...props,
    });

    const classNames = attachmentInputItem(variantProps);
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    return (
      <ClassNamesProvider value={classNames}>
        <AttachmentDisplayItemProvider value={api}>
          <overlayTracker.Provider>
            <Primitive.li
              ref={useComposedRefs(scaleFeedbackRef, ref)}
              className={clsx(classNames.root, scaleFeedbackClassName, className)}
              {...stateProps}
              {...otherProps}
            />
          </overlayTracker.Provider>
        </AttachmentDisplayItemProvider>
      </ClassNamesProvider>
    );
  },
);
AttachmentDisplayItem.displayName = "AttachmentDisplayItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemImageProps
  extends AttachmentDisplayPrimitive.ItemImageProps {}

export const AttachmentDisplayItemImage = withContext<
  HTMLImageElement,
  AttachmentDisplayItemImageProps
>(AttachmentDisplayPrimitive.ItemImage, "image");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemThumbnailProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayItemThumbnail = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemThumbnailProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { stateProps } = useAttachmentDisplayContext();
  const { isRendered } = overlayTracker.useRenderTracking();

  return (
    <Primitive.div
      ref={ref}
      data-has-overlay={dataAttr(isRendered)}
      {...stateProps}
      className={clsx(classNames.thumbnail, className)}
      {...props}
    />
  );
});

AttachmentDisplayItemThumbnail.displayName = "AttachmentDisplayItemThumbnail";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemMetadataProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayItemMetadata = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemMetadataProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { stateProps } = useAttachmentDisplayContext();
  const { isRendered } = overlayTracker.useRenderTracking();

  return (
    <Primitive.div
      ref={ref}
      data-has-overlay={dataAttr(isRendered)}
      {...stateProps}
      className={clsx(classNames.metadata, className)}
      {...props}
    />
  );
});

AttachmentDisplayItemMetadata.displayName = "AttachmentDisplayItemMetadata";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemBackdropProps
  extends AttachmentDisplayPrimitive.ItemBackdropProps {}

export const AttachmentDisplayItemBackdrop = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemBackdropProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { trackRef } = overlayTracker.useRenderTracking();

  return (
    <AttachmentDisplayPrimitive.ItemBackdrop
      ref={composeRefs(ref, trackRef)}
      className={clsx(classNames.backdrop, className)}
      {...props}
    />
  );
});

AttachmentDisplayItemBackdrop.displayName = "AttachmentDisplayItemBackdrop";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemBadgeProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayItemBadge = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemBadgeProps
>(({ className, children, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    <Primitive.div ref={ref} className={clsx(classNames.badge, className)} {...props}>
      <Primitive.span className={classNames.badgeLabel}>{children}</Primitive.span>
    </Primitive.div>
  );
});
AttachmentDisplayItemBadge.displayName = "AttachmentDisplayItemBadge";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemActionButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayItemActionButton = React.forwardRef<
  HTMLButtonElement,
  AttachmentDisplayItemActionButtonProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

  return (
    <Primitive.button
      type="button"
      ref={useComposedRefs(scaleFeedbackRef, ref)}
      className={clsx(classNames.actionButton, scaleFeedbackClassName, className)}
      {...props}
    />
  );
});
AttachmentDisplayItemActionButton.displayName = "AttachmentDisplayItemActionButton";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemRemoveButtonProps
  extends AttachmentDisplayPrimitive.ItemRemoveButtonProps {}

export const AttachmentDisplayItemRemoveButton = withScaleFeedback(
  withContext<HTMLButtonElement, AttachmentDisplayItemRemoveButtonProps>(
    AttachmentDisplayPrimitive.ItemRemoveButton,
    "removeButton",
  ),
);
