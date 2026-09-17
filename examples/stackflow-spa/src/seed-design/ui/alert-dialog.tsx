import { AlertDialog } from "@seed-design/react";
import { forwardRef } from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";
import type * as React from "react";

export interface AlertDialogRootProps extends AlertDialog.RootProps {
  /**
   * @default "alertdialog"
   */
  role?: AlertDialog.RootProps["role"];
  /**
   * @default false
   */
  closeOnInteractOutside?: AlertDialog.RootProps["closeOnInteractOutside"];
}

/**
 * @see https://seed-design.io/react/components/alert-dialog
 */
export const AlertDialogRoot = ({ children, ...otherProps }: AlertDialogRootProps) => {
  return (
    <AlertDialog.Root role="alertdialog" closeOnInteractOutside={false} {...otherProps}>
      {children}
    </AlertDialog.Root>
  );
};
AlertDialogRoot.displayName = "AlertDialogRoot";

export interface AlertDialogContentProps extends AlertDialog.ContentProps {
  layerIndex?: number;
}

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ children, layerIndex, ...otherProps }, ref) => {
    return (
      <AlertDialog.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <AlertDialog.Backdrop />
        <AlertDialog.Content ref={ref} {...otherProps}>
          {children}
        </AlertDialog.Content>
      </AlertDialog.Positioner>
    );
  },
);

export interface AlertDialogTriggerProps extends AlertDialog.TriggerProps {}

export const AlertDialogTrigger = AlertDialog.Trigger;

export interface AlertDialogHeaderProps extends AlertDialog.HeaderProps {}

export const AlertDialogHeader = AlertDialog.Header;

export interface AlertDialogTitleProps extends AlertDialog.TitleProps {}

export const AlertDialogTitle = AlertDialog.Title;

export interface AlertDialogDescriptionProps extends AlertDialog.DescriptionProps {}

export const AlertDialogDescription = AlertDialog.Description;

export interface AlertDialogFooterProps extends AlertDialog.FooterProps {}

export const AlertDialogFooter = AlertDialog.Footer;

export interface AlertDialogActionProps
  extends Omit<AlertDialog.ActionProps, "color">,
    ActionButtonProps {}

export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  (props, ref) => {
    return (
      <AlertDialog.Action asChild>
        <ActionButton {...props} ref={ref} />
      </AlertDialog.Action>
    );
  },
);
