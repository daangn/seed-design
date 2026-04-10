"use client";

import { FocusScope } from "@radix-ui/react-focus-scope";
import { DismissibleLayer } from "@seed-design/react-dismissible-layer";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import { Presence } from "@seed-design/react-presence";
import { useDialog, type UseDialogProps } from "./useDialog";
import { DialogProvider, useDialogContext } from "./useDialogContext";

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

// We might need scroll lock here; not needed yet in stackflow based webview.
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
        <FocusScope asChild loop trapped={api.open}>
          <Primitive.div ref={ref} {...mergeProps(api.contentProps, props)} />
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
