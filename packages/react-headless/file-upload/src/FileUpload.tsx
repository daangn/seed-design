"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useFileUpload, type UseFileUploadProps } from "./useFileUpload";
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
      onFileReject,
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
      onFileReject,
      required,
      validate,
    });

    return (
      <FileUploadProvider value={api}>
        <Primitive.div ref={ref} {...otherProps} />
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
    const { dropzoneProps } = useFileUploadContext();
    const mergedProps = mergeProps(dropzoneProps, props);

    return <Primitive.div ref={ref} {...mergedProps} />;
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
  const { getItemRemoveButtonProps } = useFileUploadContext();
  const { id } = useFileUploadItemContext();

  const mergedProps = mergeProps(getItemRemoveButtonProps(id), props);

  return <Primitive.button ref={ref} {...mergedProps} />;
});
FileUploadItemRemoveButton.displayName = "FileUploadItemRemoveButton";

export interface FileUploadContextProps {
  children: (context: UseFileUploadContext) => React.ReactNode;
}

export const FileUploadContext = (props: FileUploadContextProps) => {
  return props.children(useFileUploadContext());
};
