"use client";

import * as React from "react";
import {
  attachmentInput,
  type AttachmentInputVariantProps,
} from "@seed-design/css/recipes/attachment-input";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  useAttachmentDisplayContext,
} from "@seed-design/react-attachment-display";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

export const { withProvider, withContext } = createSlotRecipeContext(attachmentInput);

const withStateProps = createWithStateProps([useAttachmentDisplayContext]);

export interface AttachmentDisplayRootProps
  extends AttachmentInputVariantProps,
    AttachmentDisplayPrimitive.RootProps {}

export const AttachmentDisplayRoot = withProvider<HTMLDivElement, AttachmentDisplayRootProps>(
  AttachmentDisplayPrimitive.Root,
  "root",
);

export interface AttachmentDisplayContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayContainer = withContext<
  HTMLDivElement,
  AttachmentDisplayContainerProps
>(withStateProps(Primitive.div), "container");

export interface AttachmentDisplayItemGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLUListElement> {}

export const AttachmentDisplayItemGroup = withContext<
  HTMLUListElement,
  AttachmentDisplayItemGroupProps
>(withStateProps(Primitive.ul), "itemGroup");

export interface AttachmentDisplayContextProps extends AttachmentDisplayPrimitive.ContextProps {}

export const AttachmentDisplayContext = AttachmentDisplayPrimitive.Context;
