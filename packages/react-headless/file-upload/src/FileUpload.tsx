"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useFileUpload, type UseFileUploadProps } from "./useFileUpload";
import {
  FileUploadProvider,
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItemContext,
  type UseFileUploadContext,
} from "./useFileUploadContext";

// =============================================================================
// FileUploadRoot
// =============================================================================

export interface FileUploadRootProps
  extends UseFileUploadProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadRoot = forwardRef<HTMLDivElement, FileUploadRootProps>((props, ref) => {
  const {
    // UseFileUploadProps
    accept,
    acceptedFiles,
    defaultAcceptedFiles,
    disabled,
    invalid,
    maxFileSize,
    maxFiles,
    minFileSize,
    name,
    onFileAccept,
    onFileChange,
    onFileReject,
    readOnly,
    required,
    allowDrop,
    validate,
    // Rest
    ...otherProps
  } = props;

  const api = useFileUpload({
    accept,
    acceptedFiles,
    defaultAcceptedFiles,
    disabled,
    invalid,
    maxFileSize,
    maxFiles,
    minFileSize,
    name,
    onFileAccept,
    onFileChange,
    onFileReject,
    readOnly,
    required,
    allowDrop,
    validate,
  });
  const mergedProps = mergeProps(api.rootProps, otherProps);

  return (
    <FileUploadProvider value={api}>
      <Primitive.div ref={ref} {...mergedProps} />
    </FileUploadProvider>
  );
});
FileUploadRoot.displayName = "FileUploadRoot";

// =============================================================================
// FileUploadDropzone
// =============================================================================

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

// =============================================================================
// FileUploadTrigger
// =============================================================================

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

// =============================================================================
// FileUploadHiddenInput
// =============================================================================

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

// =============================================================================
// FileUploadItem
// =============================================================================

export interface FileUploadItemProps extends PrimitiveProps, React.LiHTMLAttributes<HTMLLIElement> {
  file: File;
}

export const FileUploadItem = forwardRef<HTMLLIElement, FileUploadItemProps>(
  ({ file, ...props }, ref) => {
    const { getItemProps, acceptedFiles } = useFileUploadContext();
    const mergedProps = mergeProps(getItemProps(file), props);

    // Find the details for this file from acceptedFiles
    const fileWithStatus = acceptedFiles.find((f) => f.file === file);
    const details = fileWithStatus?.details ?? { status: "pending" as const };

    return (
      <FileUploadItemProvider value={{ file, details }}>
        <Primitive.li ref={ref} {...mergedProps} />
      </FileUploadItemProvider>
    );
  },
);
FileUploadItem.displayName = "FileUploadItem";

// =============================================================================
// FileUploadItemName
// =============================================================================

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

// =============================================================================
// FileUploadItemSizeText
// =============================================================================

export interface FileUploadItemSizeTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Formatter function for file size.
   */
  formatBytes: (bytes: number) => string;
}

export const FileUploadItemSizeText = forwardRef<HTMLSpanElement, FileUploadItemSizeTextProps>(
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
FileUploadItemSizeText.displayName = "FileUploadItemSizeText";

// =============================================================================
// FileUploadItemDeleteTrigger
// =============================================================================

export interface FileUploadItemDeleteTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadItemDeleteTrigger = forwardRef<
  HTMLButtonElement,
  FileUploadItemDeleteTriggerProps
>((props, ref) => {
  const { getItemDeleteTriggerProps } = useFileUploadContext();
  const { file } = useFileUploadItemContext();

  const mergedProps = mergeProps(getItemDeleteTriggerProps(file), props);
  return <Primitive.button ref={ref} {...mergedProps} />;
});
FileUploadItemDeleteTrigger.displayName = "FileUploadItemDeleteTrigger";

// =============================================================================
// FileUploadClearTrigger
// =============================================================================

export interface FileUploadClearTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadClearTrigger = forwardRef<HTMLButtonElement, FileUploadClearTriggerProps>(
  (props, ref) => {
    const { clearFiles, stateProps, disabled, readOnly } = useFileUploadContext();
    const mergedProps = mergeProps(stateProps, props);
    return (
      <Primitive.button
        ref={ref}
        type="button"
        disabled={disabled || readOnly}
        onClick={clearFiles}
        {...mergedProps}
      />
    );
  },
);
FileUploadClearTrigger.displayName = "FileUploadClearTrigger";

// =============================================================================
// FileUploadContext (render prop)
// =============================================================================

export interface FileUploadContextProps {
  children: (context: UseFileUploadContext) => React.ReactNode;
}

export const FileUploadContext = (props: FileUploadContextProps) => {
  return props.children(useFileUploadContext());
};
