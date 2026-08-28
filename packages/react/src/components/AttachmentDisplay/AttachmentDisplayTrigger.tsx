"use client";

import {
  attachmentInputTrigger,
  type AttachmentInputTriggerVariantProps,
} from "@seed-design/css/recipes/attachment-input-trigger";
import {
  AttachmentDisplay as AttachmentDisplayPrimitive,
  useAttachmentDisplayContext,
} from "@seed-design/react-attachment-display";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { InternalIcon } from "../private/Icon";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { withScaleFeedback } from "@seed-design/react-scale-feedback";

const { withProvider, useClassNames } = createSlotRecipeContext(attachmentInputTrigger);

export interface AttachmentDisplayTriggerProps
  extends AttachmentInputTriggerVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayTrigger = withScaleFeedback(
  withProvider<HTMLButtonElement, AttachmentDisplayTriggerProps>(
    AttachmentDisplayPrimitive.Trigger,
    "root",
  ),
);

// Display currently only supports image content. The parametric form mirrors
// AttachmentInput.TriggerIcon so future expansion (e.g., "general") can be added
// without changing the prop shape.
type DisplayAcceptType = "image";

export type AttachmentDisplayTriggerIconProps = React.SVGAttributes<SVGElement> & {
  [K in DisplayAcceptType]: React.ReactNode;
};

export const AttachmentDisplayTriggerIcon = React.forwardRef<
  SVGSVGElement,
  AttachmentDisplayTriggerIconProps
>(({ image, ...props }, ref) => {
  const { stateProps } = useAttachmentDisplayContext();
  const classNames = useClassNames();

  const mergedProps = mergeProps(
    stateProps,
    { className: classNames.icon },
    props as React.HTMLAttributes<HTMLElement>,
  );

  return <InternalIcon svg={image} ref={ref} {...mergedProps} />;
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
  const { currentEntryCount, maxEntries, stateProps } = useAttachmentDisplayContext();

  return (
    <Primitive.div className={clsx(classNames.itemCountArea, className)} ref={ref} {...otherProps}>
      <span
        {...(currentEntryCount === 0 && { "data-empty": true })}
        className={classNames.itemCount}
        {...stateProps}
      >
        {currentEntryCount}
      </span>
      <span className={classNames.maxItemCount} {...stateProps}>
        /{maxEntries}
      </span>
    </Primitive.div>
  );
});
AttachmentDisplayTriggerItemCount.displayName = "AttachmentDisplayTriggerItemCount";
