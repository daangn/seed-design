"use client";

import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useCallback, useRef } from "react";
import { Presence } from "./private/Presence";
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

// TODO: implement DismissableLayer in useDialog instead of radix-ui
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => {
  const api = useDialogContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const composedRef = useCallback(
    (node: HTMLDivElement | null) => {
      contentRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <Presence present={api.open} unmountOnExit={api.unmountOnExit} lazyMount={api.lazyMount}>
      <FocusScope
        asChild
        loop
        trapped={api.open}
        // Move initial focus to the dialog container, not the first tabbable element.
        // Radix's default (focusFirst) lands on the first item, which makes a screen
        // reader skip the title/description and shows a :focus-visible ring on that item
        // when the dialog is opened without a prior pointer interaction (e.g. direct URL
        // navigation). The container has no focus-visible style, so no ring appears.
        onMountAutoFocus={(e) => {
          e.preventDefault();
          contentRef.current?.focus();
        }}
      >
        {/* onDismiss = onEscapeKeyDown + onInteractOutside (= onFocusOutside + onPointerDownOutside) */}
        <DismissableLayer
          ref={composedRef}
          onEscapeKeyDown={(e) => {
            if (!api.closeOnEscape) {
              e.preventDefault();
              return;
            }

            api.setOpen(false, { reason: "escapeKeyDown", event: e });
          }}
          // onInteractOutside = onFocusOutside + onPointerDownOutside
          onInteractOutside={(e) => {
            if (!api.closeOnInteractOutside) {
              e.preventDefault();
              return;
            }

            api.setOpen(false, { reason: "interactOutside", event: e.detail.originalEvent });
          }}
          // onFocusOutside isn't needed because FocusScope traps the focus
          {...mergeProps(api.contentProps, props)}
        />
      </FocusScope>
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
