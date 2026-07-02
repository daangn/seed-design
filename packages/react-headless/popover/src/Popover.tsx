"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useRef } from "react";
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

export interface PopoverPositionerPortalProps
  extends PopoverPositionerProps,
    Pick<FloatingPortalProps, "id" | "root" | "preserveTabOrder"> {}

export const PopoverPositionerPortal = forwardRef<HTMLDivElement, PopoverPositionerPortalProps>(
  ({ id, root, preserveTabOrder, ...otherProps }, ref) => {
    const api = usePopoverContext();

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
PopoverPositionerPortal.displayName = "PopoverPositionerPortal";

export interface PopoverContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>((props, ref) => {
  const api = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);

  const content = (
    <Primitive.div
      ref={composeRefs(contentRef, ref)}
      tabIndex={-1}
      {...mergeProps(api.contentProps, props)}
    />
  );

  // Focus management via Radix FocusScope (mirrors Drawer). The dialog renders in a Portal, so:
  // - Mounting a FocusScope registers it on Radix's focusScopesStack and pauses any trapped
  //   parent scope (Dialog, Drawer, BottomSheet, or the Stackflow AppScreen) while open.
  //   Without it the parent traps focus and yanks it back to the trigger, so focus could never
  //   reach the portaled content.
  // - trapped + loop keep focus inside the dialog (Radix/Ark parity): Tab wraps within the
  //   content instead of escaping to the page. Non-modal is preserved — the background is not
  //   inerted or scroll-locked, only keyboard focus is contained. Keeping focus in also means
  //   Escape/keyboard dismissal always target this popover.
  // - onMountAutoFocus focuses the content container (tabIndex=-1) rather than the first
  //   tabbable, so focus doesn't land on the header close (X) button.
  // Mounted only while open so mount/unmount maps to open/close: initial focus lands on open,
  // and FocusScope's default return-focus sends focus back to the trigger on close.
  return api.open ? (
    <FocusScope
      asChild
      loop
      trapped
      onMountAutoFocus={(e) => {
        e.preventDefault();
        contentRef.current?.focus();
      }}
    >
      {content}
    </FocusScope>
  ) : (
    content
  );
});
PopoverContent.displayName = "PopoverContent";

export interface PopoverTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>((props, ref) => {
  const api = usePopoverContext();
  return (
    <Primitive.h2 ref={composeRefs(api.refs.title, ref)} {...mergeProps(api.titleProps, props)} />
  );
});
PopoverTitle.displayName = "PopoverTitle";

export interface PopoverDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  (props, ref) => {
    const api = usePopoverContext();
    return (
      <Primitive.p
        ref={composeRefs(api.refs.description, ref)}
        {...mergeProps(api.descriptionProps, props)}
      />
    );
  },
);
PopoverDescription.displayName = "PopoverDescription";

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
