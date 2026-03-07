"use client";

import * as React from "react";
import {
  fileUploadTrigger,
  type FileUploadTriggerVariantProps,
} from "@seed-design/css/recipes/file-upload-trigger";
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

const { withProvider, useClassNames } = createSlotRecipeContext(fileUploadTrigger);

export interface FileUploadTriggerProps
  extends FileUploadTriggerVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const FileUploadTrigger = withProvider<HTMLButtonElement, FileUploadTriggerProps>(
  FileUploadPrimitive.Trigger,
  "root",
);

export type FileUploadTriggerIconProps = React.SVGAttributes<SVGElement> & {
  [K in NonNullable<FileAcceptType>]?: React.ReactNode;
} & {
  general: React.ReactNode;
};

export const FileUploadTriggerIcon = React.forwardRef<SVGSVGElement, FileUploadTriggerIconProps>(
  ({ image, general, ...props }, ref) => {
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
  },
);

export interface FileUploadTriggerItemCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const FileUploadTriggerItemCount = React.forwardRef<
  HTMLDivElement,
  FileUploadTriggerItemCountProps
>(({ className, ...otherProps }, ref) => {
  const classNames = useClassNames();
  const { currentFileCount, maxFiles, stateProps } = useFileUploadContext();

  return (
    <Primitive.div className={clsx(classNames.itemCount, className)} ref={ref} {...otherProps}>
      <span
        {...(currentFileCount === 0 && { "data-empty": true })}
        className={classNames.itemCount}
        {...stateProps}
      >
        {currentFileCount}
      </span>
      <span className={classNames.maxItemCount} {...stateProps}>
        /{maxFiles}
      </span>
    </Primitive.div>
  );
});
