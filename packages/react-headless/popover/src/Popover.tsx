"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { usePopover, type UsePopoverProps } from "./usePopover";
import { PopoverProvider, usePopoverContext } from "./usePopoverContext";

export interface PopoverRootProps extends UsePopoverProps {
  children: React.ReactNode;
}

export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, ...otherProps } = props;
  const api = usePopover(otherProps);
  return <PopoverProvider value={api}>{children}</PopoverProvider>;
};

export interface PopoverAnchorProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.div
      ref={composeRefs(api.refs.anchor, ref)}
      {...mergeProps(api.anchorProps, props)}
    />
  );
});
PopoverAnchor.displayName = "PopoverAnchor";

export interface PopoverTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.button
      ref={composeRefs(api.refs.trigger, ref)}
      {...mergeProps(api.triggerProps, props)}
    />
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return (
      <Primitive.div
        ref={composeRefs(api.refs.positioner, ref)}
        {...mergeProps(api.positionerProps, props)}
      />
    );
  },
);
PopoverPositioner.displayName = "PopoverPositioner";

export interface PopoverArrowProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.div ref={composeRefs(api.refs.arrow, ref)} {...mergeProps(api.arrowProps, props)} />
  );
});
PopoverArrow.displayName = "PopoverArrow";

export interface PopoverCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PopoverCloseButton = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return <Primitive.button ref={ref} {...mergeProps(api.closeButtonProps, props)} />;
  },
);
