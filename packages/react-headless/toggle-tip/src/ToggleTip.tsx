"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { useToggleTip, type UseToggleTipProps } from "./useToggleTip";
import { ToggleTipProvider, useToggleTipContext } from "./useToggleTipContext";
import { FloatingPortal, type FloatingPortalProps } from "@floating-ui/react";

export interface ToggleTipRootProps extends UseToggleTipProps {
  children: React.ReactNode;
}

export function ToggleTipRoot({ children, ...otherProps }: ToggleTipRootProps) {
  const api = useToggleTip(otherProps);

  return <ToggleTipProvider value={api}>{children}</ToggleTipProvider>;
}

export interface ToggleTipAnchorProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ToggleTipAnchor = forwardRef<HTMLDivElement, ToggleTipAnchorProps>((props, ref) => {
  const api = useToggleTipContext();
  return (
    <Primitive.div
      ref={composeRefs(api.refs.anchor, ref)}
      {...mergeProps(api.anchorProps, props)}
    />
  );
});
ToggleTipAnchor.displayName = "ToggleTipAnchor";

export interface ToggleTipTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const ToggleTipTrigger = forwardRef<HTMLButtonElement, ToggleTipTriggerProps>(
  (props, ref) => {
    const api = useToggleTipContext();
    return (
      <Primitive.button
        ref={composeRefs(api.refs.trigger, ref)}
        {...mergeProps(api.triggerProps, props)}
      />
    );
  },
);
ToggleTipTrigger.displayName = "ToggleTipTrigger";

export interface ToggleTipPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ToggleTipPositioner = forwardRef<HTMLDivElement, ToggleTipPositionerProps>(
  (props, ref) => {
    const api = useToggleTipContext();
    return (
      <Primitive.div
        ref={composeRefs(api.refs.positioner, ref)}
        {...mergeProps(api.positionerProps, props)}
      />
    );
  },
);
ToggleTipPositioner.displayName = "ToggleTipPositioner";

export interface ToggleTipPositionerPortalProps
  extends ToggleTipPositionerProps,
    Pick<FloatingPortalProps, "id" | "root" | "preserveTabOrder"> {}

export const ToggleTipPositionerPortal = forwardRef<HTMLDivElement, ToggleTipPositionerPortalProps>(
  ({ id, root, preserveTabOrder, ...otherProps }, ref) => {
    const api = useToggleTipContext();

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
ToggleTipPositionerPortal.displayName = "ToggleTipPositionerPortal";

export interface ToggleTipArrowProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const ToggleTipArrow = forwardRef<HTMLDivElement, ToggleTipArrowProps>((props, ref) => {
  const api = useToggleTipContext();
  return (
    <Primitive.div ref={composeRefs(api.refs.arrow, ref)} {...mergeProps(api.arrowProps, props)} />
  );
});
ToggleTipArrow.displayName = "ToggleTipArrow";

export interface ToggleTipCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ToggleTipCloseButton = forwardRef<HTMLButtonElement, ToggleTipCloseButtonProps>(
  (props, ref) => {
    const api = useToggleTipContext();
    return <Primitive.button ref={ref} {...mergeProps(api.closeButtonProps, props)} />;
  },
);
