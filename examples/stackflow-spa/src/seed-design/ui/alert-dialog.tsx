"use client";

import { Dialog } from "@seed-design/react";
import { forwardRef } from "react";

export interface AlertDialogRootProps extends Dialog.RootProps {}

/**
 * @see https://seed-design.io/react/components/stackflow/alert-dialog
 */
export const AlertDialogRoot = ({ children, ...otherProps }: AlertDialogRootProps) => {
  return (
    <Dialog.Root role="alertdialog" closeOnInteractOutside={false} {...otherProps}>
      {children}
    </Dialog.Root>
  );
};
AlertDialogRoot.displayName = "AlertDialogRoot";

export interface AlertDialogContentProps extends Dialog.ContentProps {
  layerIndex?: number;
}

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ children, layerIndex, ...otherProps }, ref) => {
    return (
      <Dialog.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <Dialog.Backdrop />
        <Dialog.Content ref={ref} {...otherProps}>
          {children}
        </Dialog.Content>
      </Dialog.Positioner>
    );
  },
);

export interface AlertDialogTriggerProps extends Dialog.TriggerProps {}

export const AlertDialogTrigger = Dialog.Trigger;

export interface AlertDialogHeaderProps extends Dialog.HeaderProps {}

export const AlertDialogHeader = Dialog.Header;

export interface AlertDialogTitleProps extends Dialog.TitleProps {}

export const AlertDialogTitle = Dialog.Title;

export interface AlertDialogDescriptionProps extends Dialog.DescriptionProps {}

export const AlertDialogDescription = Dialog.Description;

export interface AlertDialogFooterProps extends Dialog.FooterProps {}

export const AlertDialogFooter = Dialog.Footer;

export interface AlertDialogActionProps extends Dialog.ActionProps {}

export const AlertDialogAction = Dialog.Action;
