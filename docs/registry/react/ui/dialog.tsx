"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Dialog as SeedDialog, Icon } from "@seed-design/react";
import { forwardRef } from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";
import type * as React from "react";

export interface DialogRootProps extends Omit<SeedDialog.RootProps, "size"> {
  /**
   * @default "medium"
   */
  size?: Exclude<NonNullable<SeedDialog.RootProps["size"]>, "alert">;
  /**
   * @default false
   */
  closeOnInteractOutside?: SeedDialog.RootProps["closeOnInteractOutside"];
}

/**
 * @see https://seed-design.io/react/components/dialog
 */
export const DialogRoot = (props: DialogRootProps) => {
  return <SeedDialog.Root size="medium" closeOnInteractOutside={false} {...props} />;
};
DialogRoot.displayName = "DialogRoot";

export interface DialogTriggerProps extends SeedDialog.TriggerProps {}

export const DialogTrigger = SeedDialog.Trigger;

export interface DialogContentProps extends Omit<SeedDialog.ContentProps, "title"> {
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
      <SeedDialog.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <SeedDialog.Backdrop />
        <SeedDialog.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedDialog.Header>
              {title && <SeedDialog.Title>{title}</SeedDialog.Title>}
              {description && <SeedDialog.Description>{description}</SeedDialog.Description>}
              {showCloseButton && (
                <SeedDialog.CloseButton aria-label="닫기">
                  <Icon svg={<IconXmarkLine />} />
                </SeedDialog.CloseButton>
              )}
            </SeedDialog.Header>
          )}
          {children}
        </SeedDialog.Content>
      </SeedDialog.Positioner>
    );
  },
);

DialogContent.displayName = "DialogContent";

export interface DialogBodyProps extends SeedDialog.BodyProps {}

export const DialogBody = SeedDialog.Body;

export interface DialogFooterProps extends SeedDialog.FooterProps {}

export const DialogFooter = SeedDialog.Footer;

export interface DialogActionProps
  extends Omit<SeedDialog.ActionProps, "color">,
    ActionButtonProps {}

export const DialogAction = forwardRef<HTMLButtonElement, DialogActionProps>((props, ref) => {
  return (
    <SeedDialog.Action asChild>
      <ActionButton {...props} ref={ref} />
    </SeedDialog.Action>
  );
});

DialogAction.displayName = "DialogAction";
