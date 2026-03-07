"use client";

import type * as React from "react";
import {
  FileUpload as FileUploadPrimitive,
  useFileUploadContext,
} from "@seed-design/react-file-upload";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { withContext } from "./FileUpload";
import { ActionButton, type ActionButtonProps } from "../ActionButton";
import { forwardRef } from "react";

export interface FileUploadDropzoneProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadDropzone = withContext<HTMLDivElement, FileUploadDropzoneProps>(
  FileUploadPrimitive.Dropzone,
  "dropzone",
);

export interface FileUploadDropzoneLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadDropzoneLabel = withContext<HTMLDivElement, FileUploadDropzoneLabelProps>(
  Primitive.div,
  "dropzoneLabel",
);

export interface FileUploadActionButtonProps extends ActionButtonProps {}

export const FileUploadActionButton = forwardRef<HTMLButtonElement, FileUploadActionButtonProps>(
  (props, ref) => {
    const { disabled } = useFileUploadContext();

    return <ActionButton ref={ref} disabled={disabled} {...props} />;
  },
);
