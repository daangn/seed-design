"use client";

import * as React from "react";
import {
  fileUploadItem,
  type FileUploadItemVariantProps,
} from "@seed-design/css/recipes/file-upload-item";
import {
  FileUpload as FileUploadPrimitive,
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItemContext,
  type FileAcceptType,
  type FileStatusDetails,
  type FileWithStatus,
  splitFileName,
} from "@seed-design/react-file-upload";
import { MiddleTruncate } from "@seed-design/react-middle-truncate";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { Slot } from "@radix-ui/react-slot";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { useClassNames, ClassNamesProvider, withContext } = createSlotRecipeContext(fileUploadItem);

export interface FileUploadItemProps
  extends FileUploadItemVariantProps,
    PrimitiveProps,
    React.LiHTMLAttributes<HTMLLIElement> {
  fileWithStatus: FileWithStatus;
}

export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  ({ className, fileWithStatus, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();

    const [variantProps, otherProps] = fileUploadItem.splitVariantProps({
      type: acceptType,
      ...props,
    });

    const classNames = fileUploadItem(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <FileUploadItemProvider value={fileWithStatus}>
          <Primitive.li ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
        </FileUploadItemProvider>
      </ClassNamesProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemNameProps
  extends PrimitiveProps,
    FileUploadPrimitive.ItemNameProps {}

export const FileUploadItemName = React.forwardRef<HTMLSpanElement, FileUploadItemNameProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useClassNames();
    const { file } = useFileUploadItemContext();
    const { extension } = splitFileName(file.name);

    const renderChildren = typeof children === "string";

    return (
      <FileUploadPrimitive.ItemName
        ref={ref}
        className={clsx(classNames.name, className)}
        {...props}
      >
        <MiddleTruncate maxLines={2} {...(!renderChildren && { end: extension.length })}>
          {renderChildren ? children : file.name}
        </MiddleTruncate>
      </FileUploadPrimitive.ItemName>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemSizeProps extends FileUploadPrimitive.ItemSizeProps {}

export const FileUploadItemSize = React.forwardRef<HTMLSpanElement, FileUploadItemSizeProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <FileUploadPrimitive.ItemSize
        ref={ref}
        className={clsx(classNames.size, classNames)}
        {...props}
      />
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemRemoveButtonProps
  extends FileUploadPrimitive.ItemRemoveButtonProps {}

export const FileUploadItemRemoveButton = withContext<
  HTMLButtonElement,
  FileUploadItemRemoveButtonProps
>(FileUploadPrimitive.ItemRemoveButton, "removeButton");

export interface FileUploadItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const FileUploadItemImage = React.forwardRef<HTMLImageElement, FileUploadItemImageProps>(
  ({ className, ...props }, ref) => {
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
  },
);

export interface FileUploadItemThumbnailProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  fallback?: React.ReactNode;
}

export const FileUploadItemThumbnail = React.forwardRef<
  HTMLDivElement,
  FileUploadItemThumbnailProps
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

export interface FileUploadItemActionButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadItemActionButton = React.forwardRef<
  HTMLButtonElement,
  FileUploadItemActionButtonProps
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

export type FileUploadItemPreviewProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
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
  overlay: FileUploadItemPreviewProps["overlay"],
  details: FileStatusDetails,
): React.ReactNode {
  if (!overlay) return undefined;

  const { pending, uploading, success, error } = overlay;
  const { status } = details;

  switch (status) {
    case "pending":
      return typeof pending === "function" ? pending() : pending;
    case "uploading": {
      if (uploading) {
        return typeof uploading === "function"
          ? uploading({ progress: details.progress })
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

export const FileUploadItemPreview = React.forwardRef<HTMLDivElement, FileUploadItemPreviewProps>(
  ({ image, general, overlay, className, ...props }, ref) => {
    const { acceptType } = useFileUploadContext();
    const { details } = useFileUploadItemContext();
    const classNames = useClassNames();

    const overlayContent = resolveOverlayContent(overlay, details);

    if (acceptType === "image" && image) {
      return (
        <>
          <Slot ref={ref} {...props}>
            {image}
          </Slot>
          {overlayContent && <div className={classNames.backdrop}>{overlayContent}</div>}
        </>
      );
    }

    if (overlayContent) {
      return (
        <div className={classNames.backdrop} ref={ref} {...props}>
          {overlayContent}
        </div>
      );
    }

    return (
      <Slot ref={ref} {...props}>
        {general}
      </Slot>
    );
  },
);
FileUploadItemPreview.displayName = "FileUploadItemPreview";

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemMetadataProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadItemMetadata = React.forwardRef<HTMLDivElement, FileUploadItemMetadataProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();

    return <Primitive.div ref={ref} className={clsx(classNames.metadata, className)} {...props} />;
  },
);
