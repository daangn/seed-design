"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useAttachmentDisplay, type UseAttachmentDisplayProps } from "./useAttachmentDisplay";
import {
  AttachmentDisplayProvider,
  useAttachmentDisplayContext,
  useAttachmentDisplayItemContext,
  type UseAttachmentDisplayContext,
} from "./useAttachmentDisplayContext";

export interface AttachmentDisplayRootProps
  extends UseAttachmentDisplayProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AttachmentDisplayRoot = forwardRef<HTMLDivElement, AttachmentDisplayRootProps>(
  (
    {
      disabled,
      invalid,
      items,
      defaultItems,
      maxItems,
      onItemsChange,
      onTriggerClick,
      ...otherProps
    },
    ref,
  ) => {
    const api = useAttachmentDisplay({
      disabled,
      invalid,
      items,
      defaultItems,
      maxItems,
      onItemsChange,
      onTriggerClick,
    });

    return (
      <AttachmentDisplayProvider value={api}>
        <Primitive.div ref={ref} {...otherProps} />
      </AttachmentDisplayProvider>
    );
  },
);
AttachmentDisplayRoot.displayName = "AttachmentDisplayRoot";

export interface AttachmentDisplayTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayTrigger = forwardRef<
  HTMLButtonElement,
  AttachmentDisplayTriggerProps
>((props, ref) => {
  const { triggerProps } = useAttachmentDisplayContext();
  const mergedProps = mergeProps(triggerProps, props);

  return <Primitive.button ref={ref} {...mergedProps} />;
});
AttachmentDisplayTrigger.displayName = "AttachmentDisplayTrigger";

export interface AttachmentDisplayItemRemoveButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayItemRemoveButton = forwardRef<
  HTMLButtonElement,
  AttachmentDisplayItemRemoveButtonProps
>((props, ref) => {
  const { getItemRemoveButtonProps } = useAttachmentDisplayContext();
  const { id } = useAttachmentDisplayItemContext();
  const mergedProps = mergeProps(getItemRemoveButtonProps(id), props);

  return <Primitive.button ref={ref} {...mergedProps} />;
});
AttachmentDisplayItemRemoveButton.displayName = "AttachmentDisplayItemRemoveButton";

export interface AttachmentDisplayContextProps {
  children: (context: UseAttachmentDisplayContext) => React.ReactNode;
}

export const AttachmentDisplayContext = (props: AttachmentDisplayContextProps) => {
  return props.children(useAttachmentDisplayContext());
};
