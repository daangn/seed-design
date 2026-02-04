"use client";

import * as React from "react";
import { fileUpload, type FileUploadVariantProps } from "@seed-design/css/recipes/file-upload";
import {
  FileUpload as FileUploadPrimitive,
  useFileUploadContext,
  useFileUploadItemContext,
} from "@seed-design/react-file-upload";
import { useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext } = createSlotRecipeContext(fileUpload);
const withStateProps = createWithStateProps([useFileUploadContext]);
const withItemStateProps = createWithStateProps([useFileUploadContext, useFileUploadItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadRootProps
  extends FileUploadVariantProps,
    FileUploadPrimitive.RootProps {}

export const FileUploadRoot = withProvider<HTMLDivElement, FileUploadRootProps>(
  FileUploadPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadDropzoneProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadDropzone = withContext<HTMLDivElement, FileUploadDropzoneProps>(
  withStateProps(FileUploadPrimitive.Dropzone),
  "dropzone",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadContainer = withContext<HTMLDivElement, FileUploadContainerProps>(
  withStateProps(Primitive.div),
  "container",
);

export interface FileUploadTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadTrigger = withContext<HTMLButtonElement, FileUploadTriggerProps>(
  withStateProps(FileUploadPrimitive.Trigger),
  "trigger",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadHiddenInputProps extends FileUploadPrimitive.HiddenInputProps {}

export const FileUploadHiddenInput = React.forwardRef<HTMLInputElement, FileUploadHiddenInputProps>(
  (props, ref) => {
    const fileUploadContext = useFileUploadContext();
    const fieldContext = useFieldContext({ strict: false });

    const mergedProps = mergeProps(
      fieldContext ? fieldContext.inputAriaAttributes : {},
      fileUploadContext.hiddenInputProps,
      fieldContext ? fieldContext.inputProps : {},
      props,
    );

    return <FileUploadPrimitive.HiddenInput ref={ref} {...mergedProps} />;
  },
);
FileUploadHiddenInput.displayName = "FileUploadHiddenInput";

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLUListElement> {}

export const FileUploadItemGroup = withContext<HTMLUListElement, FileUploadItemGroupProps>(
  withStateProps(Primitive.ul),
  "itemGroup",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemProps extends FileUploadPrimitive.ItemProps {}

export const FileUploadItem = withContext<HTMLLIElement, FileUploadItemProps>(
  withStateProps(FileUploadPrimitive.Item),
  "item",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemNameProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FileUploadItemName = withContext<HTMLSpanElement, FileUploadItemNameProps>(
  withItemStateProps(FileUploadPrimitive.ItemName),
  "itemName",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemSizeTextProps extends FileUploadPrimitive.ItemSizeTextProps {}

export const FileUploadItemSizeText = withContext<HTMLSpanElement, FileUploadItemSizeTextProps>(
  withItemStateProps(FileUploadPrimitive.ItemSizeText),
  "itemSize",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemDeleteTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadItemDeleteTrigger = withContext<
  HTMLButtonElement,
  FileUploadItemDeleteTriggerProps
>(withItemStateProps(FileUploadPrimitive.ItemDeleteTrigger), "itemDeleteTrigger");

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadClearTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadClearTrigger = withContext<HTMLButtonElement, FileUploadClearTriggerProps>(
  withStateProps(FileUploadPrimitive.ClearTrigger),
  "clearTrigger",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadContextProps extends FileUploadPrimitive.ContextProps {}

export const FileUploadContext = FileUploadPrimitive.Context;

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemPreviewProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadItemPreview = withContext<HTMLDivElement, FileUploadItemPreviewProps>(
  withItemStateProps(Primitive.div),
  "itemPreview",
);

////////////////////////////////////////////////////////////////////////////////////

export interface FileUploadItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

const FileUploadItemImageImpl = React.forwardRef<HTMLImageElement, FileUploadItemImageProps>(
  (props, ref) => {
    const { createFileUrl } = useFileUploadContext();
    const { file } = useFileUploadItemContext();
    const [src, setSrc] = React.useState<string>();

    React.useEffect(() => {
      if (!file) return;
      return createFileUrl(file, setSrc);
    }, [file, createFileUrl]);

    if (!src) return null;
    return <Primitive.img ref={ref} src={src} alt={file?.name} {...props} />;
  },
);
FileUploadItemImageImpl.displayName = "FileUploadItemImageImpl";

export const FileUploadItemImage = withContext<HTMLImageElement, FileUploadItemImageProps>(
  withItemStateProps(FileUploadItemImageImpl),
  "itemImage",
);

////////////////////////////////////////////////////////////////////////////////////

export type {
  FileUploadItemStatus,
  FileStatusDetails,
  FileWithStatus,
} from "@seed-design/react-file-upload";

export interface FileUploadItemIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to display when status is "pending".
   * Also used as fallback when other status-specific props are not provided.
   */
  pending: React.ReactNode | (() => React.ReactNode);

  /**
   * Content to display when status is "uploading".
   * Can be a render function that receives { progress: number }.
   * Falls back to `pending` if not provided.
   */
  uploading?: React.ReactNode | ((props: { progress: number }) => React.ReactNode);

  /**
   * Content to display when status is "success".
   * Falls back to `pending` if not provided.
   */
  success?: React.ReactNode | (() => React.ReactNode);

  /**
   * Content to display when status is "error".
   * Falls back to `pending` if not provided.
   */
  error?: React.ReactNode | (() => React.ReactNode);
}

export const FileUploadItemIndicator = React.forwardRef<
  HTMLDivElement,
  FileUploadItemIndicatorProps
>(({ pending, uploading, success, error, ...props }, ref) => {
  const { details } = useFileUploadItemContext();
  const { status } = details;

  const renderContent = (): React.ReactNode => {
    switch (status) {
      case "pending":
        return typeof pending === "function" ? pending() : pending;
      case "uploading": {
        const progress = details.progress;
        if (uploading) {
          return typeof uploading === "function" ? uploading({ progress }) : uploading;
        }
        return typeof pending === "function" ? pending() : pending;
      }
      case "success":
        if (success) {
          return typeof success === "function" ? success() : success;
        }
        return typeof pending === "function" ? pending() : pending;
      case "error":
        if (error) {
          return typeof error === "function" ? error() : error;
        }
        return typeof pending === "function" ? pending() : pending;
      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <div ref={ref} data-status={status} {...props}>
      {content}
    </div>
  );
});
FileUploadItemIndicator.displayName = "FileUploadItemIndicator";
