"use client";

import * as React from "react";
import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/css/recipes/attachment-input-item";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { dataAttr } from "@seed-design/dom-utils";
import {
  FileUpload as FileUploadPrimitive,
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItem,
  useFileUploadItemContext,
  type FileEntry,
  splitFileName,
} from "@seed-design/react-file-upload";
import { MiddleTruncate } from "@seed-design/react-middle-truncate";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { createRenderTrackingContext } from "../../utils/createRenderTrackingContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import {
  getInternalAttachmentItemReorder,
  InternalAttachmentItemReorderHandle,
} from "../private/AttachmentItemReorder";

const { useClassNames, ClassNamesProvider, withContext } =
  createSlotRecipeContext(attachmentInputItem);

const overlayTracker = createRenderTrackingContext("AttachmentInputItemOverlay");

export interface AttachmentInputItemProps
  extends AttachmentInputItemVariantProps,
    PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  fileEntry: FileEntry;
}

export const AttachmentInputItem = React.forwardRef<HTMLLIElement, AttachmentInputItemProps>(
  ({ className, fileEntry, children, ...props }, ref) => {
    const { acceptType, stateProps } = useFileUploadContext();
    const api = useFileUploadItem(fileEntry);

    const [variantProps, otherProps] = attachmentInputItem.splitVariantProps({
      type: acceptType,
      ...props,
    });

    const classNames = attachmentInputItem(variantProps);
    const reorder = getInternalAttachmentItemReorder(otherProps);

    return (
      <ClassNamesProvider value={classNames}>
        <FileUploadItemProvider value={api}>
          <overlayTracker.Provider>
            <Primitive.li
              ref={ref}
              className={clsx(classNames.root, className)}
              {...stateProps}
              {...reorder.itemProps}
            >
              {reorder.handleProps && (
                <InternalAttachmentItemReorderHandle {...reorder.handleProps} />
              )}
              {children}
            </Primitive.li>
          </overlayTracker.Provider>
        </FileUploadItemProvider>
      </ClassNamesProvider>
    );
  },
);
AttachmentInputItem.displayName = "AttachmentInputItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemNameProps
  extends PrimitiveProps,
    FileUploadPrimitive.ItemNameProps {}

export const AttachmentInputItemName = React.forwardRef<
  HTMLSpanElement,
  AttachmentInputItemNameProps
>(({ className, children, ...props }, ref) => {
  const classNames = useClassNames();
  const { file } = useFileUploadItemContext();
  const { extension } = splitFileName(file.name);

  return (
    <FileUploadPrimitive.ItemName ref={ref} className={clsx(classNames.name, className)} {...props}>
      {children ?? (
        <MiddleTruncate maxLines={2} {...{ end: extension.length }}>
          {file.name}
        </MiddleTruncate>
      )}
    </FileUploadPrimitive.ItemName>
  );
});
AttachmentInputItemName.displayName = "AttachmentInputItemName";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemSizeProps extends FileUploadPrimitive.ItemSizeProps {}

export const AttachmentInputItemSize = React.forwardRef<
  HTMLSpanElement,
  AttachmentInputItemSizeProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    <FileUploadPrimitive.ItemSize
      ref={ref}
      className={clsx(classNames.size, className)}
      {...props}
    />
  );
});
AttachmentInputItemSize.displayName = "AttachmentInputItemSize";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemRemoveButtonProps
  extends FileUploadPrimitive.ItemRemoveButtonProps {}

export const AttachmentInputItemRemoveButton = withContext<
  HTMLButtonElement,
  AttachmentInputItemRemoveButtonProps
>(FileUploadPrimitive.ItemRemoveButton, "removeButton");

export interface AttachmentInputItemImageProps extends FileUploadPrimitive.ItemImageProps {}

export const AttachmentInputItemImage = withContext<
  HTMLImageElement,
  AttachmentInputItemImageProps
>(FileUploadPrimitive.ItemImage, "image");

export interface AttachmentInputItemThumbnailProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

// when actual thumbnail implementation happens, this will likely need a dedicated headless component
export const AttachmentInputItemThumbnail = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemThumbnailProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { stateProps } = useFileUploadContext();
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

AttachmentInputItemThumbnail.displayName = "AttachmentInputItemThumbnail";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemBadgeProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputItemBadge = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemBadgeProps
>(({ className, children, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    <Primitive.div ref={ref} className={clsx(classNames.badge, className)} {...props}>
      <Primitive.span className={classNames.badgeLabel}>{children}</Primitive.span>
    </Primitive.div>
  );
});
AttachmentInputItemBadge.displayName = "AttachmentInputItemBadge";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemActionButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentInputItemActionButton = React.forwardRef<
  HTMLButtonElement,
  AttachmentInputItemActionButtonProps
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
AttachmentInputItemActionButton.displayName = "AttachmentInputItemActionButton";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemBackdropProps extends FileUploadPrimitive.ItemBackdropProps {}

export const AttachmentInputItemBackdrop = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemBackdropProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { trackRef } = overlayTracker.useRenderTracking();

  return (
    <FileUploadPrimitive.ItemBackdrop
      ref={composeRefs(ref, trackRef)}
      className={clsx(classNames.backdrop, className)}
      {...props}
    />
  );
});

AttachmentInputItemBackdrop.displayName = "AttachmentInputItemBackdrop";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemMetadataProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputItemMetadata = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemMetadataProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();
  const { stateProps } = useFileUploadContext();
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

AttachmentInputItemMetadata.displayName = "AttachmentInputItemMetadata";
