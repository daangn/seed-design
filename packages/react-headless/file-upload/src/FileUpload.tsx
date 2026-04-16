"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useFileUpload, type UseFileUploadProps } from "./useFileUpload";
import type { FileEntry } from "./types";
import {
  FileUploadProvider,
  useFileUploadContext,
  useFileUploadItemContext,
  type UseFileUploadContext,
} from "./useFileUploadContext";

export interface FileUploadRootProps
  extends UseFileUploadProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadRoot = forwardRef<HTMLDivElement, FileUploadRootProps>(
  (
    {
      // UseFileUploadProps
      accept,
      acceptedFileEntries,
      defaultAcceptedFileEntries,
      disabled,
      invalid,
      maxFileSize,
      maxFiles,
      minFileSize,
      name,
      onAcceptedFileEntriesChange,
      onFileAccept,
      onFileReject,
      preventDocumentDrop,
      readOnly,
      required,
      validate,

      ...otherProps
    },
    ref,
  ) => {
    const api = useFileUpload({
      accept,
      acceptedFileEntries,
      defaultAcceptedFileEntries,
      disabled,
      invalid,
      maxFileSize,
      maxFiles,
      minFileSize,
      name,
      onAcceptedFileEntriesChange,
      onFileAccept,
      onFileReject,
      preventDocumentDrop,
      readOnly,
      required,
      validate,
    });

    return (
      <FileUploadProvider value={api}>
        <Primitive.div ref={ref} {...api.stateProps} {...otherProps} />
      </FileUploadProvider>
    );
  },
);
FileUploadRoot.displayName = "FileUploadRoot";

export interface FileUploadDropzoneProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadDropzone = forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
  (props, ref) => {
    const { dropzoneRef, dropzoneProps } = useFileUploadContext();
    const mergedProps = mergeProps(dropzoneProps, props);

    return <Primitive.div ref={composeRefs(dropzoneRef, ref)} {...mergedProps} />;
  },
);
FileUploadDropzone.displayName = "FileUploadDropzone";

export interface FileUploadTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadTrigger = forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
  (props, ref) => {
    const { triggerProps } = useFileUploadContext();
    const mergedProps = mergeProps(triggerProps, props);

    return <Primitive.button ref={ref} {...mergedProps} />;
  },
);
FileUploadTrigger.displayName = "FileUploadTrigger";

export interface FileUploadHiddenInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {}

export const FileUploadHiddenInput = forwardRef<HTMLInputElement, FileUploadHiddenInputProps>(
  (props, ref) => {
    const { inputRef, hiddenInputProps } = useFileUploadContext();
    const mergedProps = mergeProps(hiddenInputProps, props);

    return <Primitive.input ref={composeRefs(inputRef, ref)} {...mergedProps} />;
  },
);
FileUploadHiddenInput.displayName = "FileUploadHiddenInput";

export interface FileUploadItemNameProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const FileUploadItemName = forwardRef<HTMLSpanElement, FileUploadItemNameProps>(
  ({ children, ...props }, ref) => {
    const { stateProps } = useFileUploadContext();
    const { file } = useFileUploadItemContext();

    const mergedProps = mergeProps(stateProps, props);

    return (
      <Primitive.span ref={ref} {...mergedProps}>
        {children ?? file.name}
      </Primitive.span>
    );
  },
);
FileUploadItemName.displayName = "FileUploadItemName";

export interface FileUploadItemSizeProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Formatter function for file size.
   */
  formatBytes: (bytes: number) => string;
}

export const FileUploadItemSize = forwardRef<HTMLSpanElement, FileUploadItemSizeProps>(
  ({ children, formatBytes, ...props }, ref) => {
    const { stateProps } = useFileUploadContext();
    const { file } = useFileUploadItemContext();

    const mergedProps = mergeProps(stateProps, props);

    return (
      <Primitive.span ref={ref} {...mergedProps}>
        {children ?? formatBytes(file.size)}
      </Primitive.span>
    );
  },
);
FileUploadItemSize.displayName = "FileUploadItemSize";

export interface FileUploadItemRemoveButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadItemRemoveButton = forwardRef<
  HTMLButtonElement,
  FileUploadItemRemoveButtonProps
>((props, ref) => {
  const { removeButtonProps } = useFileUploadItemContext();

  const mergedProps = mergeProps(removeButtonProps, props);

  return <Primitive.button ref={ref} {...mergedProps} />;
});
FileUploadItemRemoveButton.displayName = "FileUploadItemRemoveButton";

export interface FileUploadItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const FileUploadItemImage = forwardRef<HTMLImageElement, FileUploadItemImageProps>(
  (props, ref) => {
    const ctx = useFileUploadItemContext();

    if (!("imageProps" in ctx)) return null;

    const mergedProps = mergeProps(ctx.imageProps ?? {}, props);

    return <Primitive.img ref={ref} {...mergedProps} />;
  },
);
FileUploadItemImage.displayName = "FileUploadItemImage";

export interface FileUploadItemThumbnailProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadItemThumbnail = forwardRef<HTMLDivElement, FileUploadItemThumbnailProps>(
  (props, ref) => {
    const { thumbnailProps } = useFileUploadItemContext();

    const mergedProps = mergeProps(thumbnailProps, props);

    return <Primitive.div ref={ref} {...mergedProps} />;
  },
);
FileUploadItemThumbnail.displayName = "FileUploadItemThumbnail";

export interface FileUploadItemMetadataProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadItemMetadata = forwardRef<HTMLDivElement, FileUploadItemMetadataProps>(
  (props, ref) => {
    const { metadataProps } = useFileUploadItemContext();

    const mergedProps = mergeProps(metadataProps, props);

    return <Primitive.div ref={ref} {...mergedProps} />;
  },
);
FileUploadItemMetadata.displayName = "FileUploadItemMetadata";

export interface FileUploadItemBackdropProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  status: FileEntry["status"];
  children: React.ReactNode | ((entry: FileEntry) => React.ReactNode);
}

export const FileUploadItemBackdrop = forwardRef<HTMLDivElement, FileUploadItemBackdropProps>(
  ({ status, children, ...props }, ref) => {
    const entry = useFileUploadItemContext();

    if (entry.status !== status) return null;

    return (
      <Primitive.div ref={composeRefs(entry.refs.overlay, ref)} {...props}>
        {typeof children === "function" ? children(entry) : children}
      </Primitive.div>
    );
  },
);
FileUploadItemBackdrop.displayName = "FileUploadItemBackdrop";

export interface FileUploadContextProps {
  children: (context: UseFileUploadContext) => React.ReactNode;
}

export const FileUploadContext = (props: FileUploadContextProps) => {
  return props.children(useFileUploadContext());
};
