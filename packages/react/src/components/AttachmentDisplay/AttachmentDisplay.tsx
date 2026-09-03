"use client";

import {
  attachmentInput,
  type AttachmentInputVariantProps,
} from "@seed-design/css/recipes/attachment-input";
import { field, type FieldVariantProps } from "@seed-design/css/recipes/field";
import { fieldLabel, type FieldLabelVariantProps } from "@seed-design/css/recipes/field-label";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  useAttachmentDisplayContext,
} from "@seed-design/react-attachment-display";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { clsx } from "cn";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon } from "../private/Icon";

const { withProvider: withAttachmentInputProvider, withContext: withAttachmentInputContext } =
  createSlotRecipeContext(attachmentInput);
const { withProvider: withFieldProvider, withContext: withFieldContext } =
  createSlotRecipeContext(field);
const {
  withProvider: withLabelProvider,
  withContext: withLabelContext,
  useClassNames: useLabelClassNames,
} = createSlotRecipeContext(fieldLabel);

const withStateProps = createWithStateProps([useAttachmentDisplayContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayRootProps
  extends FieldVariantProps,
    AttachmentDisplayPrimitive.RootProps {}

export const AttachmentDisplayRoot = withFieldProvider<HTMLDivElement, AttachmentDisplayRootProps>(
  AttachmentDisplayPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayHeader = withFieldContext<
  HTMLDivElement,
  AttachmentDisplayHeaderProps
>(withStateProps(Primitive.div), "header");

export interface AttachmentDisplayLabelProps
  extends PrimitiveProps,
    FieldLabelVariantProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayLabel = withLabelProvider<
  HTMLDivElement,
  AttachmentDisplayLabelProps
>(withStateProps(Primitive.div), "root");

export interface AttachmentDisplayIndicatorTextProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AttachmentDisplayIndicatorText = withLabelContext<
  HTMLSpanElement,
  AttachmentDisplayIndicatorTextProps
>(withStateProps(Primitive.span), "indicatorText");

export interface AttachmentDisplayRequiredIndicatorProps extends React.SVGProps<SVGElement> {}

export const AttachmentDisplayRequiredIndicator = React.forwardRef<
  SVGSVGElement,
  AttachmentDisplayRequiredIndicatorProps
>(({ className, ...props }, ref) => {
  const { indicatorIcon } = useLabelClassNames();

  return (
    <InternalIcon
      svg={
        // biome-ignore lint/a11y/noSvgWithoutTitle: InternalIcon is aria-hidden
        <svg
          viewBox="0 0 6 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(indicatorIcon, className)}
        >
          <path
            d="M3.75002 1.55859L4.41318 1.09468C4.75243 0.857361 5.21982 0.939865 5.45732 1.27899C5.69499 1.61836 5.61243 2.08615 5.27295 2.32366L4.30763 2.99902L5.27372 3.67612C5.61285 3.91381 5.69517 4.38137 5.45761 4.72059C5.21999 5.0599 4.7523 5.14233 4.41299 4.90471L3.75002 4.44043V5.25C3.75002 5.66421 3.41423 6 3.00002 6C2.5858 6 2.25002 5.66421 2.25002 5.25V4.44043L1.58704 4.90471C1.24773 5.14233 0.780041 5.0599 0.542418 4.72059C0.304856 4.38137 0.387176 3.91381 0.726309 3.67612L1.6924 2.99902L0.727079 2.32366C0.387603 2.08615 0.305043 1.61836 0.542707 1.27899C0.780206 0.939865 1.2476 0.857361 1.58685 1.09468L2.25002 1.55859V0.75C2.25002 0.335786 2.5858 0 3.00002 0C3.41423 0 3.75002 0.335786 3.75002 0.75V1.55859Z"
            fill="currentColor"
          />
        </svg>
      }
      ref={ref}
      {...props}
    />
  );
});
AttachmentDisplayRequiredIndicator.displayName = "AttachmentDisplayRequiredIndicator";

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayControlProps
  extends AttachmentInputVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayControl = withAttachmentInputProvider<
  HTMLDivElement,
  AttachmentDisplayControlProps
>(withStateProps(Primitive.div), "root");

export interface AttachmentDisplayContainerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayContainer = withAttachmentInputContext<
  HTMLDivElement,
  AttachmentDisplayContainerProps
>(withStateProps(Primitive.div), "container");

export interface AttachmentDisplayItemGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLUListElement> {}

export const AttachmentDisplayItemGroup = withAttachmentInputContext<
  HTMLUListElement,
  AttachmentDisplayItemGroupProps
>(withStateProps(Primitive.ul), "itemGroup");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayFooter = withFieldContext<
  HTMLDivElement,
  AttachmentDisplayFooterProps
>(withStateProps(Primitive.div), "footer");

export interface AttachmentDisplayDescriptionProps
  extends AttachmentDisplayPrimitive.DescriptionProps {}

export const AttachmentDisplayDescription = withFieldContext<
  HTMLSpanElement,
  AttachmentDisplayDescriptionProps
>(AttachmentDisplayPrimitive.Description, "description");

export interface AttachmentDisplayErrorMessageProps
  extends AttachmentDisplayPrimitive.ErrorMessageProps {}

export const AttachmentDisplayErrorMessage = withFieldContext<
  HTMLSpanElement,
  AttachmentDisplayErrorMessageProps
>(AttachmentDisplayPrimitive.ErrorMessage, "errorMessage");

////////////////////////////////////////////////////////////////////////////////////

export interface AttachmentDisplayContextProps extends AttachmentDisplayPrimitive.ContextProps {}

export const AttachmentDisplayContext = AttachmentDisplayPrimitive.Context;
