"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { usePopover, type UsePopoverProps } from "./usePopover";
import { PopoverProvider, usePopoverContext } from "./usePopoverContext";
import { FloatingPortal, type FloatingPortalProps } from "@floating-ui/react";

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

/**
 * Joins SEED's shared layer stack while the popover is open, so Escape and outside presses
 * reach only the top-most layer, and an ancestor layer closing (Dialog, Drawer) cascades down
 * to this one. It wraps the positioner because that is the floating element and the one part
 * every consumer renders; HelpBubble supplies its own content element inside it.
 *
 * `pressBehavior="drag"` matches Menu and Select: a mouse press outside dismisses on
 * pointerdown, while touch waits for a drag or a completed tap so a finger landing mid-scroll
 * does not read as a dismiss.
 */
function PopoverDismissibleLayer({ children }: { children: React.ReactNode }) {
  const { open, setOpen, closeOnInteractOutside, floatingContext } = usePopoverContext();

  return (
    <DismissibleLayer
      enabled={open}
      pressBehavior="drag"
      onEscapeKeyDown={() => setOpen(false)}
      onPressOutside={() => {
        if (!closeOnInteractOutside) return;

        setOpen(false);
      }}
      onFocusOutside={() => {
        // Focus leaving the popover is not a dismissal — nothing to do here.
      }}
      onCascadeDismiss={() => setOpen(false)}
      exclude={(target) => {
        // The reference (trigger or anchor) lives outside the layer's DOM, and the trigger's
        // `useClick` already toggles the popover shut. Treating it as outside would close the
        // popover on pointerdown and let the same press reopen it on click.
        const reference = floatingContext.refs.reference.current;
        if (!(reference instanceof HTMLElement)) return false;

        return reference.contains(target);
      }}
    >
      {children}
    </DismissibleLayer>
  );
}

export interface PopoverPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return (
      <PopoverDismissibleLayer>
        <Primitive.div
          ref={composeRefs(api.refs.positioner, ref)}
          {...mergeProps(api.positionerProps, props)}
        />
      </PopoverDismissibleLayer>
    );
  },
);
PopoverPositioner.displayName = "PopoverPositioner";

export interface PopoverPositionerPortalProps
  extends PopoverPositionerProps,
    Pick<FloatingPortalProps, "id" | "root" | "preserveTabOrder"> {}

export const PopoverPositionerPortal = forwardRef<HTMLDivElement, PopoverPositionerPortalProps>(
  ({ id, root, preserveTabOrder, ...otherProps }, ref) => {
    const api = usePopoverContext();

    return (
      <FloatingPortal id={id} root={root} preserveTabOrder={preserveTabOrder}>
        <PopoverDismissibleLayer>
          <Primitive.div
            ref={composeRefs(api.refs.positioner, ref)}
            {...mergeProps(api.positionerProps, otherProps)}
          />
        </PopoverDismissibleLayer>
      </FloatingPortal>
    );
  },
);
PopoverPositionerPortal.displayName = "PopoverPositionerPortal";

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
