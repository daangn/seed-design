"use client";

import * as React from "react";
import {
  attachmentInputTrigger,
  type AttachmentInputTriggerVariantProps,
} from "@seed-design/css/recipes/attachment-input-trigger";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  useAttachmentDisplayContext,
} from "@seed-design/react-attachment-display";

import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { mergeProps } from "@seed-design/dom-utils";
import clsx from "clsx";
import { InternalIcon } from "../private/Icon";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withProvider, useClassNames } = createSlotRecipeContext(attachmentInputTrigger);

export interface AttachmentDisplayTriggerProps
  extends AttachmentInputTriggerVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayTrigger = withProvider<
  HTMLButtonElement,
  AttachmentDisplayTriggerProps
>(AttachmentDisplayPrimitive.Trigger, "root");

export interface AttachmentDisplayTriggerIconProps extends React.SVGAttributes<SVGElement> {
  icon: React.ReactNode;
}

export const AttachmentDisplayTriggerIcon = React.forwardRef<
  SVGSVGElement,
  AttachmentDisplayTriggerIconProps
>(({ icon, ...props }, ref) => {
  const { stateProps } = useAttachmentDisplayContext();
  const classNames = useClassNames();

  const mergedProps = mergeProps(
    stateProps,
    { className: classNames.icon },
    props as React.HTMLAttributes<HTMLElement>,
  );

  return <InternalIcon svg={icon} ref={ref} {...mergedProps} />;
});
AttachmentDisplayTriggerIcon.displayName = "AttachmentDisplayTriggerIcon";

export interface AttachmentDisplayTriggerItemCountProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayTriggerItemCount = React.forwardRef<
  HTMLDivElement,
  AttachmentDisplayTriggerItemCountProps
>(({ className, ...otherProps }, ref) => {
  const classNames = useClassNames();
  const { currentItemCount, maxItems, stateProps } = useAttachmentDisplayContext();

  return (
    <Primitive.div className={clsx(classNames.itemCount, className)} ref={ref} {...otherProps}>
      <span
        {...(currentItemCount === 0 && { "data-empty": true })}
        className={classNames.itemCount}
        {...stateProps}
      >
        {currentItemCount}
      </span>
      <span className={classNames.maxItemCount} {...stateProps}>
        /{maxItems}
      </span>
    </Primitive.div>
  );
});
AttachmentDisplayTriggerItemCount.displayName = "AttachmentDisplayTriggerItemCount";
