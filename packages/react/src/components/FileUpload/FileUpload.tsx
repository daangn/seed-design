"use client";

import * as React from "react";
import { fileUpload, type FileUploadVariantProps } from "@seed-design/css/recipes/file-upload";
import {
  FileUpload as FileUploadPrimitive,
  useFileUploadContext,
} from "@seed-design/react-file-upload";

import { useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

export const { withProvider, withContext } = createSlotRecipeContext(fileUpload);

const withStateProps = createWithStateProps([useFileUploadContext]);

export interface FileUploadRootProps
  extends FileUploadVariantProps,
    FileUploadPrimitive.RootProps {}

export const FileUploadRoot = withProvider<HTMLDivElement, FileUploadRootProps>(
  FileUploadPrimitive.Root,
  "root",
);

export interface FileUploadContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadContainer = withContext<HTMLDivElement, FileUploadContainerProps>(
  withStateProps(Primitive.div),
  "container",
);

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

export interface FileUploadItemGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLUListElement> {}

export const FileUploadItemGroup = withContext<HTMLUListElement, FileUploadItemGroupProps>(
  withStateProps(Primitive.ul),
  "itemGroup",
);

export interface FileUploadContextProps extends FileUploadPrimitive.ContextProps {}

export const FileUploadContext = FileUploadPrimitive.Context;
