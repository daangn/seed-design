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
  useFileUploadItemContext,
  type FileAcceptType,
  type FileEntry,
  splitFileName,
} from "@seed-design/react-file-upload";
import { MiddleTruncate } from "@seed-design/react-middle-truncate";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";
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

    const [variantProps, otherProps] = attachmentInputItem.splitVariantProps({
      type: acceptType,
      ...props,
    });

    const classNames = attachmentInputItem(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <FileUploadItemProvider value={fileEntry}>
          <Primitive.li ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
        </FileUploadItemProvider>
      </ClassNamesProvider>
    );
  },
);

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

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemRemoveButtonProps
  extends FileUploadPrimitive.ItemRemoveButtonProps {}

export const AttachmentInputItemRemoveButton = withContext<
  HTMLButtonElement,
  AttachmentInputItemRemoveButtonProps
>(FileUploadPrimitive.ItemRemoveButton, "removeButton");

export interface AttachmentInputItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const AttachmentInputItemImage = React.forwardRef<
  HTMLImageElement,
  AttachmentInputItemImageProps
>(({ className, ...props }, ref) => {
  const { createFileUrl } = useFileUploadContext();
  const { file } = useFileUploadItemContext();

  const [src, setSrc] = React.useState<string>();

  const classNames = useClassNames();

  React.useEffect(() => {
    if (!file) return;

    return createFileUrl(file, setSrc);
  }, [file, createFileUrl]);

  if (!src) return null;

  return (
    <Primitive.img
      ref={ref}
      src={src}
      alt={file?.name} // file name as alt text is valid here
      className={clsx(classNames.image, className)}
      {...props}
    />
  );
});

export interface AttachmentInputItemThumbnailProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  fallback?: React.ReactNode;
}

export const AttachmentInputItemThumbnail = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemThumbnailProps
>(({ fallback, className, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    // when actual thumbnail implementation happens, Primitive.div will likely be replaced with FileUploadPrimitive.ItemThumbnail or something
    <Primitive.div ref={ref} className={clsx(classNames.thumbnail, className)} {...props}>
      {fallback}
    </Primitive.div>
  );
});

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

////////////////////////////////////////////////////////////////////////////////////

export type AttachmentInputItemPreviewProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  [K in NonNullable<FileAcceptType>]?: React.ReactNode;
} & {
  general: React.ReactNode;

  overlay?: {
    pending?: React.ReactNode | (() => React.ReactNode);
    uploading?: React.ReactNode | ((props: { progress?: number }) => React.ReactNode);
    success?: React.ReactNode | (() => React.ReactNode);
    error?: React.ReactNode | (() => React.ReactNode);
  };
};

function resolveOverlayContent(
  overlay: AttachmentInputItemPreviewProps["overlay"],
  entry: FileEntry,
): React.ReactNode {
  if (!overlay) return undefined;

  const { pending, uploading, success, error } = overlay;

  switch (entry.status) {
    case "pending":
      return typeof pending === "function" ? pending() : pending;
    case "uploading": {
      if (uploading) {
        return typeof uploading === "function"
          ? uploading({ progress: entry.progress })
          : uploading;
      }
      return typeof pending === "function" ? pending() : pending;
    }
    case "success": {
      if (success) return typeof success === "function" ? success() : success;
      return typeof pending === "function" ? pending() : pending;
    }
    case "error": {
      if (error) return typeof error === "function" ? error() : error;
      return typeof pending === "function" ? pending() : pending;
    }
  }
}

export const AttachmentInputItemPreview = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemPreviewProps
>(({ image, general, overlay, className, ...props }, ref) => {
  const { acceptType } = useFileUploadContext();
  const entry = useFileUploadItemContext();
  const classNames = useClassNames();

  const overlayContent = resolveOverlayContent(overlay, entry);

  if (acceptType === "image" && image) {
    return (
      <>
        <Slot ref={ref} {...props}>
          {image}
        </Slot>
        {overlayContent && (
          <div className={clsx(classNames.backdrop, className)}>{overlayContent}</div>
        )}
      </>
    );
  }

  if (overlayContent) {
    return (
      <div className={clsx(classNames.backdrop, className)} ref={ref} {...props}>
        {overlayContent}
      </div>
    );
  }

  return (
    <Slot className={className} ref={ref} {...props}>
      {general}
    </Slot>
  );
});
AttachmentInputItemPreview.displayName = "AttachmentInputItemPreview";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentInputItemMetadataProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputItemMetadata = React.forwardRef<
  HTMLDivElement,
  AttachmentInputItemMetadataProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();

  return <Primitive.div ref={ref} className={clsx(classNames.metadata, className)} {...props} />;
});
