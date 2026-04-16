"use client";

import * as React from "react";
import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/css/recipes/attachment-input-item";
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
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { useClassNames, ClassNamesProvider, withContext } =
  createSlotRecipeContext(attachmentInputItem);

export interface AttachmentInputItemProps
  extends AttachmentInputItemVariantProps,
    PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  fileEntry: FileEntry;
}

export const AttachmentInputItem = React.forwardRef<HTMLLIElement, AttachmentInputItemProps>(
  ({ className, fileEntry, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();
    const api = useFileUploadItem(fileEntry);

    const [variantProps, otherProps] = attachmentInputItem.splitVariantProps({
      type: acceptType,
      ...props,
    });

    const classNames = attachmentInputItem(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <FileUploadItemProvider value={api}>
          <Primitive.li ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
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

export interface AttachmentInputItemThumbnailProps extends FileUploadPrimitive.ItemThumbnailProps {}

// when actual thumbnail implementation happens, this will likely need a dedicated headless component
export const AttachmentInputItemThumbnail = withContext<
  HTMLDivElement,
  AttachmentInputItemThumbnailProps
>(FileUploadPrimitive.ItemThumbnail, "thumbnail");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemBadgeProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputItemBadge = withContext<HTMLDivElement, AttachmentInputItemBadgeProps>(
  Primitive.div,
  "badge",
);
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

export const AttachmentInputItemBackdrop = withContext<
  HTMLDivElement,
  AttachmentInputItemBackdropProps
>(FileUploadPrimitive.ItemBackdrop, "backdrop");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemMetadataProps extends FileUploadPrimitive.ItemMetadataProps {}

export const AttachmentInputItemMetadata = withContext<
  HTMLDivElement,
  AttachmentInputItemMetadataProps
>(FileUploadPrimitive.ItemMetadata, "metadata");
