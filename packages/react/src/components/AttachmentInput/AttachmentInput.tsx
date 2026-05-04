"use client";

import * as React from "react";
import {
  attachmentInput,
  type AttachmentInputVariantProps,
} from "@seed-design/css/recipes/attachment-input";
import {
  FileUpload as FileUploadPrimitive,
  useFileUploadContext,
} from "@seed-design/react-file-upload";

import { useFieldContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

export const { withProvider, withContext } = createSlotRecipeContext(attachmentInput);

const withStateProps = createWithStateProps([useFileUploadContext]);

export interface AttachmentInputRootProps
  extends AttachmentInputVariantProps,
    FileUploadPrimitive.RootProps {}

export const AttachmentInputRoot = withProvider<HTMLDivElement, AttachmentInputRootProps>(
  FileUploadPrimitive.Root,
  "root",
);

export interface AttachmentInputContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputContainer = withContext<HTMLDivElement, AttachmentInputContainerProps>(
  withStateProps(Primitive.div),
  "container",
);

export interface AttachmentInputHiddenInputProps extends FileUploadPrimitive.HiddenInputProps {}

export const AttachmentInputHiddenInput = React.forwardRef<
  HTMLInputElement,
  AttachmentInputHiddenInputProps
>((props, ref) => {
  const fileUploadContext = useFileUploadContext();
  const fieldContext = useFieldContext({ strict: false });

  const mergedProps = mergeProps(
    fieldContext ? fieldContext.inputAriaAttributes : {},
    fileUploadContext.hiddenInputProps,
    fieldContext ? fieldContext.inputProps : {},
    props,
  );

  return <FileUploadPrimitive.HiddenInput ref={ref} {...mergedProps} />;
});
AttachmentInputHiddenInput.displayName = "AttachmentInputHiddenInput";

export interface AttachmentInputItemGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLUListElement> {}

export const AttachmentInputItemGroup = withContext<
  HTMLUListElement,
  AttachmentInputItemGroupProps
>(withStateProps(Primitive.ul), "itemGroup");

export interface AttachmentInputContextProps extends FileUploadPrimitive.ContextProps {}

export const AttachmentInputContext = FileUploadPrimitive.Context;
