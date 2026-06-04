"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { hideOthers } from "aria-hidden";
import { RemoveScroll } from "react-remove-scroll";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Presence } from "@seed-design/react-presence";
import { useDialog, type UseDialogProps } from "./useDialog";
import { DialogProvider, useDialogContext } from "./useDialogContext";

/**
 * `react-remove-scroll` renders its lock container via the `as` prop. Routing it
 * through `Primitive.div` + `asChild` (= Slot) merges the scroll-capture handlers
 * and `lockRef` onto the existing dialog element instead of inserting a wrapper
 * node, and composes refs rather than overriding them (which `forwardProps` would).
 */
const ScrollLockSlot = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <Primitive.div asChild ref={ref} {...props} />,
);
ScrollLockSlot.displayName = "ScrollLockSlot";

export interface DialogRootProps extends UseDialogProps {
  children: React.ReactNode;
}

export const DialogRoot = (props: DialogRootProps) => {
  const { children, ...otherProps } = props;
  const api = useDialog(otherProps);
  return <DialogProvider value={api}>{children}</DialogProvider>;
};

export interface DialogTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>((props, ref) => {
  const api = useDialogContext();
  return <Primitive.button ref={ref} {...mergeProps(api.triggerProps, props)} />;
});
DialogTrigger.displayName = "DialogTrigger";

export interface DialogPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const DialogPositioner = forwardRef<HTMLDivElement, DialogPositionerProps>((props, ref) => {
  const api = useDialogContext();
  return <Primitive.div ref={ref} {...mergeProps(api.positionerProps, props)} />;
});
DialogPositioner.displayName = "DialogPositioner";

export interface DialogBackdropProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>((props, ref) => {
  const api = useDialogContext();
  return (
    <Presence present={api.open} unmountOnExit={api.unmountOnExit} lazyMount={api.lazyMount}>
      <Primitive.div ref={ref} {...mergeProps(api.backdropProps, props)} />
    </Presence>
  );
});
DialogBackdrop.displayName = "DialogBackdrop";

export interface DialogContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => {
  const api = useDialogContext();
  const [contentNode, setContentNode] = useState<HTMLDivElement | null>(null);
  const contentRef = useCallback((el: HTMLDivElement | null) => setContentNode(el), []);

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  useEffect(() => {
    if (!api.open || !api.modal || !contentNode) return;
    return hideOthers(contentNode);
  }, [api.open, api.modal, contentNode]);

  return (
    <Presence present={api.open} unmountOnExit={api.unmountOnExit} lazyMount={api.lazyMount}>
      {/* DismissibleLayer must wrap FocusScope, not the other way around.
          FocusScope asChild uses Slot to forward tabIndex/onKeyDown/ref to the
          DOM element; if DismissibleLayer sits between them, those props are
          swallowed by DismissibleLayer's own destructuring and never reach the DOM. */}
      <DismissibleLayer
        enabled={api.open}
        onEscapeKeyDown={(e) => {
          if (!api.closeOnEscape) return;
          api.setOpen(false, { reason: "escapeKeyDown", event: e });
        }}
        onPressOutside={(e) => {
          if (!api.closeOnInteractOutside) return;
          api.setOpen(false, { reason: "interactOutside", event: e });
        }}
        onFocusOutside={() => {
          // focus trapping is handled by FocusScope — nothing to do here

          if (!api.closeOnInteractOutside) return; // not actually going to happen; FocusScope will work regardless
        }}
        onCascadeDismiss={({ dismissedParent }) => {
          api.setOpen(false, { reason: "cascadeDismiss", dismissedParent });
        }}
      >
        <FocusScope asChild loop trapped={api.open && api.modal}>
          <RemoveScroll
            as={ScrollLockSlot}
            enabled={api.modal && api.open}
            removeScrollBar
            allowPinchZoom
          >
            <Primitive.div
              ref={composeRefs(ref, contentRef)}
              {...mergeProps(api.contentProps, props)}
            />
          </RemoveScroll>
        </FocusScope>
      </DismissibleLayer>
    </Presence>
  );
});
DialogContent.displayName = "DialogContent";

export interface DialogTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>((props, ref) => {
  const api = useDialogContext();
  return <Primitive.h2 ref={ref} {...mergeProps(api.titleProps, props)} />;
});

export interface DialogDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  (props, ref) => {
    const api = useDialogContext();
    return <Primitive.p ref={ref} {...mergeProps(api.descriptionProps, props)} />;
  },
);

export interface DialogCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogCloseButton = forwardRef<HTMLButtonElement, DialogCloseButtonProps>(
  (props, ref) => {
    const api = useDialogContext();
    return <Primitive.button ref={ref} {...mergeProps(api.closeButtonProps, props)} />;
  },
);
