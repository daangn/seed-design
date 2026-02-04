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
    React.HTMLAttributes<HTMLSpanElement> {
  file?: File;
}

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
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  file?: File;
}

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
