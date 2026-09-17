"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Dialog, Icon } from "@seed-design/react";
import { forwardRef } from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";
import type * as React from "react";

export interface DialogRootProps extends Dialog.RootProps {
  /**
   * @default false
   */
  closeOnInteractOutside?: Dialog.RootProps["closeOnInteractOutside"];
}

/**
 * @see https://seed-design.io/react/components/dialog
 */
export const DialogRoot = (props: DialogRootProps) => {
  return <Dialog.Root closeOnInteractOutside={false} {...props} />;
};
DialogRoot.displayName = "DialogRoot";

export interface DialogTriggerProps extends Dialog.TriggerProps {}

export const DialogTrigger = Dialog.Trigger;

export interface DialogContentProps extends Omit<Dialog.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, title, description, layerIndex, showCloseButton = true, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "DialogContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    const shouldRenderHeader = title || description || showCloseButton;

    return (
      <Dialog.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <Dialog.Backdrop />
        <Dialog.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <Dialog.Header>
              {title && <Dialog.Title>{title}</Dialog.Title>}
              {description && <Dialog.Description>{description}</Dialog.Description>}
              {showCloseButton && (
                <Dialog.CloseButton aria-label="닫기">
                  <Icon svg={<IconXmarkLine />} />
                </Dialog.CloseButton>
              )}
            </Dialog.Header>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Positioner>
    );
  },
);

DialogContent.displayName = "DialogContent";

export interface DialogBodyProps extends Dialog.BodyProps {}

export const DialogBody = Dialog.Body;

export interface DialogFooterProps extends Dialog.FooterProps {}

export const DialogFooter = Dialog.Footer;

export interface DialogActionProps extends Omit<Dialog.ActionProps, "color">, ActionButtonProps {}

export const DialogAction = forwardRef<HTMLButtonElement, DialogActionProps>((props, ref) => {
  return (
    <Dialog.Action asChild>
      <ActionButton {...props} ref={ref} />
    </Dialog.Action>
  );
});

DialogAction.displayName = "DialogAction";
