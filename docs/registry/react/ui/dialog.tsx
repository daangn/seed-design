"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { ContentDialog, Icon } from "@seed-design/react";
import { forwardRef } from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";
import type * as React from "react";

export interface DialogRootProps extends ContentDialog.RootProps {
  /**
   * @default "medium"
   */
  size?: ContentDialog.RootProps["size"];
  /**
   * @default false
   */
  closeOnInteractOutside?: ContentDialog.RootProps["closeOnInteractOutside"];
}

/**
 * @see https://seed-design.io/react/components/dialog
 */
export const DialogRoot = (props: DialogRootProps) => {
  return <ContentDialog.Root closeOnInteractOutside={false} {...props} />;
};
DialogRoot.displayName = "DialogRoot";

export interface DialogTriggerProps extends ContentDialog.TriggerProps {}

export const DialogTrigger = ContentDialog.Trigger;

export interface DialogContentProps extends Omit<ContentDialog.ContentProps, "title"> {
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
      <ContentDialog.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <ContentDialog.Backdrop />
        <ContentDialog.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <ContentDialog.Header>
              {title && <ContentDialog.Title>{title}</ContentDialog.Title>}
              {description && <ContentDialog.Description>{description}</ContentDialog.Description>}
              {showCloseButton && (
                <ContentDialog.CloseButton aria-label="닫기">
                  <Icon svg={<IconXmarkLine />} />
                </ContentDialog.CloseButton>
              )}
            </ContentDialog.Header>
          )}
          {children}
        </ContentDialog.Content>
      </ContentDialog.Positioner>
    );
  },
);

DialogContent.displayName = "DialogContent";

export interface DialogBodyProps extends ContentDialog.BodyProps {}

export const DialogBody = ContentDialog.Body;

export interface DialogFooterProps extends ContentDialog.FooterProps {}

export const DialogFooter = ContentDialog.Footer;

export interface DialogActionProps
  extends Omit<ContentDialog.ActionProps, "color">,
    ActionButtonProps {}

export const DialogAction = forwardRef<HTMLButtonElement, DialogActionProps>((props, ref) => {
  return (
    <ContentDialog.Action asChild>
      <ActionButton {...props} ref={ref} />
    </ContentDialog.Action>
  );
});

DialogAction.displayName = "DialogAction";
