"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import type { DisplayItemEntry } from "./types";
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
      entries,
      defaultEntries,
      onEntriesChange,
      disabled,
      invalid,
      readOnly,
      maxEntries,

      ...otherProps
    },
    ref,
  ) => {
    const api = useAttachmentDisplay({
      entries,
      defaultEntries,
      onEntriesChange,
      disabled,
      invalid,
      readOnly,
      maxEntries,
    });

    return (
      <AttachmentDisplayProvider value={api}>
        <Primitive.div ref={ref} {...api.stateProps} {...otherProps} />
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

export interface AttachmentDisplayItemImageProps
  extends PrimitiveProps,
    React.ImgHTMLAttributes<HTMLImageElement> {}

export const AttachmentDisplayItemImage = forwardRef<
  HTMLImageElement,
  AttachmentDisplayItemImageProps
>((props, ref) => {
  const { imageProps } = useAttachmentDisplayItemContext();
  const mergedProps = mergeProps(imageProps, props);

  return <Primitive.img ref={ref} {...mergedProps} />;
});
AttachmentDisplayItemImage.displayName = "AttachmentDisplayItemImage";

export interface AttachmentDisplayItemRemoveButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AttachmentDisplayItemRemoveButton = forwardRef<
  HTMLButtonElement,
  AttachmentDisplayItemRemoveButtonProps
>((props, ref) => {
  const { removeButtonProps } = useAttachmentDisplayItemContext();
  const mergedProps = mergeProps(removeButtonProps, props);

  return <Primitive.button ref={ref} {...mergedProps} />;
});
AttachmentDisplayItemRemoveButton.displayName = "AttachmentDisplayItemRemoveButton";

export interface AttachmentDisplayItemBackdropProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  status: DisplayItemEntry["status"];
  children: React.ReactNode | ((entry: DisplayItemEntry) => React.ReactNode);
}

export const AttachmentDisplayItemBackdrop = forwardRef<
  HTMLDivElement,
  AttachmentDisplayItemBackdropProps
>(({ status, children, ...props }, ref) => {
  const entry = useAttachmentDisplayItemContext();

  if (entry.status !== status) return null;

  return (
    <Primitive.div ref={ref} {...props}>
      {typeof children === "function" ? children(entry) : children}
    </Primitive.div>
  );
});
AttachmentDisplayItemBackdrop.displayName = "AttachmentDisplayItemBackdrop";

export interface AttachmentDisplayDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AttachmentDisplayDescription = forwardRef<
  HTMLSpanElement,
  AttachmentDisplayDescriptionProps
>((props, ref) => {
  const { refs, descriptionProps } = useAttachmentDisplayContext();
  const mergedProps = mergeProps(descriptionProps, props);

  return <Primitive.span ref={composeRefs(refs.description, ref)} {...mergedProps} />;
});
AttachmentDisplayDescription.displayName = "AttachmentDisplayDescription";

export interface AttachmentDisplayErrorMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AttachmentDisplayErrorMessage = forwardRef<
  HTMLSpanElement,
  AttachmentDisplayErrorMessageProps
>((props, ref) => {
  const { refs, errorMessageProps } = useAttachmentDisplayContext();
  const mergedProps = mergeProps(errorMessageProps, props);

  return <Primitive.span ref={composeRefs(refs.errorMessage, ref)} {...mergedProps} />;
});
AttachmentDisplayErrorMessage.displayName = "AttachmentDisplayErrorMessage";

export interface AttachmentDisplayContextProps {
  children: (context: UseAttachmentDisplayContext) => React.ReactNode;
}

export const AttachmentDisplayContext = (props: AttachmentDisplayContextProps) => {
  return props.children(useAttachmentDisplayContext());
};
