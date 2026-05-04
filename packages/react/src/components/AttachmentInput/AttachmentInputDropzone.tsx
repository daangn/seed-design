"use client";

import type * as React from "react";
import { FileUpload as FileUploadPrimitive } from "@seed-design/react-file-upload";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { withContext } from "./AttachmentInput";

export interface AttachmentInputDropzoneProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputDropzone = withContext<HTMLDivElement, AttachmentInputDropzoneProps>(
  FileUploadPrimitive.Dropzone,
  "dropzone",
);

export interface AttachmentInputDropzoneLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputDropzoneLabel = withContext<
  HTMLDivElement,
  AttachmentInputDropzoneLabelProps
>(Primitive.div, "dropzoneLabel");
