import * as React from "@lynx-js/react";
import {
  ActionButton,
  AlertDialog as SeedAlertDialog,
  type ActionButtonProps,
} from "@seed-design/lynx-react";

export interface AlertDialogRootProps extends SeedAlertDialog.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/alert-dialog
 */
export const AlertDialogRoot = SeedAlertDialog.Root;

export interface AlertDialogTriggerProps extends SeedAlertDialog.TriggerProps {}

export const AlertDialogTrigger = SeedAlertDialog.Trigger;

export interface AlertDialogHeaderProps extends SeedAlertDialog.HeaderProps {}

export const AlertDialogHeader = SeedAlertDialog.Header;

export interface AlertDialogTitleProps extends SeedAlertDialog.TitleProps {}

export const AlertDialogTitle = SeedAlertDialog.Title;

export interface AlertDialogDescriptionProps extends SeedAlertDialog.DescriptionProps {}

export const AlertDialogDescription = SeedAlertDialog.Description;

export interface AlertDialogFooterProps extends SeedAlertDialog.FooterProps {}

export const AlertDialogFooter = SeedAlertDialog.Footer;

export interface AlertDialogActionProps
  extends Omit<SeedAlertDialog.ActionProps, "children">,
    ActionButtonProps {}

export const AlertDialogAction = React.forwardRef<unknown, AlertDialogActionProps>(
  ({ children, transition, ...actionButtonProps }, ref) => {
    return (
      <SeedAlertDialog.Action transition={transition} disabled={actionButtonProps.disabled}>
        <ActionButton ref={ref} {...actionButtonProps}>
          {children}
        </ActionButton>
      </SeedAlertDialog.Action>
    );
  },
);
AlertDialogAction.displayName = "AlertDialogAction";

export interface AlertDialogContentProps extends Omit<SeedAlertDialog.ContentProps, "children"> {
  children?: React.ReactNode;
  container?: SeedAlertDialog.PositionerProps["container"];
  overlayLevel?: SeedAlertDialog.PositionerProps["overlayLevel"];
}

/**
 * Positioner, Backdrop, Content를 조립합니다. Lynx에서는 container와 overlayLevel로
 * overlay 위치를 지정하며, alert dialog의 backdrop을 탭해도 닫히지 않습니다.
 */
export const AlertDialogContent = (props: AlertDialogContentProps) => {
  const { children, container, overlayLevel, ...contentProps } = props;

  return (
    <SeedAlertDialog.Positioner container={container} overlayLevel={overlayLevel}>
      <SeedAlertDialog.Backdrop clickToClose={false} />
      <SeedAlertDialog.Content {...contentProps}>{children}</SeedAlertDialog.Content>
    </SeedAlertDialog.Positioner>
  );
};
AlertDialogContent.displayName = "AlertDialogContent";
