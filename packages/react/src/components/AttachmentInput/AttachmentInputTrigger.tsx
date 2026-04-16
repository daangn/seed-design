"use client";

import * as React from "react";
import {
  attachmentInputTrigger,
  type AttachmentInputTriggerVariantProps,
} from "@seed-design/css/recipes/attachment-input-trigger";
import {
  FileUpload as FileUploadPrimitive,
  useFileUploadContext,
  type FileAcceptType,
} from "@seed-design/react-file-upload";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import clsx from "clsx";
import { InternalIcon } from "../private/Icon";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withProvider, useClassNames } = createSlotRecipeContext(attachmentInputTrigger);

export interface AttachmentInputTriggerProps
  extends AttachmentInputTriggerVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentInputTrigger = withProvider<HTMLButtonElement, AttachmentInputTriggerProps>(
  FileUploadPrimitive.Trigger,
  "root",
);

export type AttachmentInputTriggerIconProps = React.SVGAttributes<SVGElement> & {
  [K in NonNullable<FileAcceptType>]?: React.ReactNode;
} & {
  general: React.ReactNode;
};

export const AttachmentInputTriggerIcon = React.forwardRef<
  SVGSVGElement,
  AttachmentInputTriggerIconProps
>(({ image, general, ...props }, ref) => {
  const { acceptType, stateProps } = useFileUploadContext();
  const classNames = useClassNames();

  const mergedProps = mergeProps(
    stateProps,
    { className: classNames.icon },
    props as React.HTMLAttributes<HTMLElement>,
  );

  // 이거 Icon으로 교체. classNames가 불필요해질 수 있음 (onlyIcon으로 대체)

  if (acceptType === "image" && image) {
    return <InternalIcon svg={image} ref={ref} {...mergedProps} />;
  }

  return <InternalIcon svg={general} ref={ref} {...mergedProps} />;
});

export interface AttachmentInputTriggerItemCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentInputTriggerItemCount = React.forwardRef<
  HTMLDivElement,
  AttachmentInputTriggerItemCountProps
>(({ className, ...otherProps }, ref) => {
  const classNames = useClassNames();
  const { currentFileEntryCount, maxFiles, stateProps } = useFileUploadContext();

  return (
    <Primitive.div className={clsx(classNames.itemCountArea, className)} ref={ref} {...otherProps}>
      <span
        {...(currentFileEntryCount === 0 && { "data-empty": true })}
        className={classNames.itemCount}
        {...stateProps}
      >
        {currentFileEntryCount}
      </span>
      <span className={classNames.maxItemCount} {...stateProps}>
        /{maxFiles}
      </span>
    </Primitive.div>
  );
});
