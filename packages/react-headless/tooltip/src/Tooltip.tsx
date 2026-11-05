"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import {
  DEFAULT_CLOSE_DELAY,
  DEFAULT_OPEN_DELAY,
  useTooltip,
  type UseTooltipProps,
} from "./useTooltip";
import { TooltipProvider, useTooltipContext } from "./useTooltipContext";
import {
  FloatingPortal,
  type FloatingPortalProps,
  NextFloatingDelayGroup,
} from "@floating-ui/react";

export interface TooltipRootProps extends UseTooltipProps {
  children: React.ReactNode;
}

export const TooltipRoot = (props: TooltipRootProps) => {
  const { children, ...otherProps } = props;
  const api = useTooltip(otherProps);
  return <TooltipProvider value={api}>{children}</TooltipProvider>;
};

export interface TooltipTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>((props, ref) => {
  const api = useTooltipContext();
  return (
    <Primitive.button
      ref={composeRefs(api.refs.trigger, ref)}
      {...mergeProps(api.triggerProps, props)}
    />
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

export interface TooltipPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TooltipPositioner = forwardRef<HTMLDivElement, TooltipPositionerProps>(
  (props, ref) => {
    const api = useTooltipContext();
    return (
      <Primitive.div
        ref={composeRefs(api.refs.positioner, ref)}
        {...mergeProps(api.positionerProps, props)}
      />
    );
  },
);
TooltipPositioner.displayName = "TooltipPositioner";

export interface TooltipPositionerPortalProps
  extends TooltipPositionerProps,
    Pick<FloatingPortalProps, "id" | "root" | "preserveTabOrder"> {}

export const TooltipPositionerPortal = forwardRef<HTMLDivElement, TooltipPositionerPortalProps>(
  ({ id, root, preserveTabOrder, ...otherProps }, ref) => {
    const api = useTooltipContext();

    return (
      <FloatingPortal id={id} root={root} preserveTabOrder={preserveTabOrder}>
        <Primitive.div
          ref={composeRefs(api.refs.positioner, ref)}
          {...mergeProps(api.positionerProps, otherProps)}
        />
      </FloatingPortal>
    );
  },
);
TooltipPositionerPortal.displayName = "TooltipPositionerPortal";

export interface TooltipArrowProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>((props, ref) => {
  const api = useTooltipContext();
  return (
    <Primitive.div ref={composeRefs(api.refs.arrow, ref)} {...mergeProps(api.arrowProps, props)} />
  );
});
TooltipArrow.displayName = "TooltipArrow";

export interface TooltipDelayGroupProps {
  children?: React.ReactNode;
  /**
   * Shared open delay (ms) for the grouped tooltips.
   * @default 200
   */
  openDelay?: number;
  /**
   * Shared close delay (ms) for the grouped tooltips.
   * @default 100
   */
  closeDelay?: number;
}

/**
 * Provider that lets a group of tooltips share a hover delay: once one is open,
 * the others open instantly while the pointer moves between them.
 */
export function TooltipDelayGroup({
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  children,
}: TooltipDelayGroupProps) {
  return (
    <NextFloatingDelayGroup delay={{ open: openDelay, close: closeDelay }}>
      {children}
    </NextFloatingDelayGroup>
  );
}
