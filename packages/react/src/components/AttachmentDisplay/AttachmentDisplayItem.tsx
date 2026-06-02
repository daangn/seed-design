"use client";

import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/css/recipes/attachment-input-item";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  AttachmentDisplayItemProvider,
  useAttachmentDisplayContext,
  useAttachmentDisplayItem,
  type DisplayItemEntry,
} from "@seed-design/react-attachment-display";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { useClassNames, ClassNamesProvider, withContext } =
  createSlotRecipeContext(attachmentInputItem);

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

    return (
      <ClassNamesProvider value={classNames}>
        <AttachmentDisplayItemProvider value={api}>
          <Primitive.li
            ref={ref}
            className={clsx(classNames.root, className)}
            {...stateProps}
            {...otherProps}
          />
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
  extends AttachmentDisplayPrimitive.ItemThumbnailProps {}

export const AttachmentDisplayItemThumbnail = withContext<
  HTMLDivElement,
  AttachmentDisplayItemThumbnailProps
>(AttachmentDisplayPrimitive.ItemThumbnail, "thumbnail");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemMetadataProps
  extends AttachmentDisplayPrimitive.ItemMetadataProps {}

export const AttachmentDisplayItemMetadata = withContext<
  HTMLDivElement,
  AttachmentDisplayItemMetadataProps
>(AttachmentDisplayPrimitive.ItemMetadata, "metadata");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemBackdropProps
  extends AttachmentDisplayPrimitive.ItemBackdropProps {}

export const AttachmentDisplayItemBackdrop = withContext<
  HTMLDivElement,
  AttachmentDisplayItemBackdropProps
>(AttachmentDisplayPrimitive.ItemBackdrop, "backdrop");

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

  return (
    <Primitive.button
      type="button"
      ref={ref}
      className={clsx(classNames.actionButton, className)}
      {...props}
    />
  );
});
AttachmentDisplayItemActionButton.displayName = "AttachmentDisplayItemActionButton";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayItemRemoveButtonProps
  extends AttachmentDisplayPrimitive.ItemRemoveButtonProps {}

export const AttachmentDisplayItemRemoveButton = withContext<
  HTMLButtonElement,
  AttachmentDisplayItemRemoveButtonProps
>(AttachmentDisplayPrimitive.ItemRemoveButton, "removeButton");
