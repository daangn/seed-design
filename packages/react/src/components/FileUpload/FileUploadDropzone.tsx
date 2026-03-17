"use client";

import type * as React from "react";
import { FileUpload as FileUploadPrimitive } from "@seed-design/react-file-upload";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { withContext } from "./FileUpload";

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
