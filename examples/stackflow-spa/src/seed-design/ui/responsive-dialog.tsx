import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import {
  Icon,
  ResponsiveDialog as SeedResponsiveDialog,
  useResponsiveDialogContext,
  VisuallyHidden,
} from "@seed-design/react";
import type * as React from "react";
import { forwardRef } from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";

export interface ResponsiveDialogRootProps extends SeedResponsiveDialog.RootProps {}

/**
 * @see https://seed-design.io/react/components/dialog
 */
export const ResponsiveDialogRoot = ({
  dialogRootProps,
  ...otherProps
}: ResponsiveDialogRootProps) => {
  return (
    <SeedResponsiveDialog.Root
      dialogRootProps={{ size: "medium", closeOnInteractOutside: false, ...dialogRootProps }}
      {...otherProps}
    />
  );
};
ResponsiveDialogRoot.displayName = "ResponsiveDialogRoot";

export interface ResponsiveDialogTriggerProps extends SeedResponsiveDialog.TriggerProps {}

export const ResponsiveDialogTrigger = SeedResponsiveDialog.Trigger;

export interface ResponsiveDialogContentProps
  extends Omit<SeedResponsiveDialog.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * @default false
   */
  showHandle?: boolean;
}

export const ResponsiveDialogContent = forwardRef<HTMLDivElement, ResponsiveDialogContentProps>(
  (
    {
      children,
      title,
      description,
      layerIndex,
      showCloseButton = true,
      showHandle = false,
      ...otherProps
    },
    ref,
  ) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "ResponsiveDialogContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    if (shouldUseBottomSheet) {
      const shouldRenderHeader = title || description;

      return (
        <SeedResponsiveDialog.Positioner
          style={{ "--layer-index": layerIndex } as React.CSSProperties}
        >
          <SeedResponsiveDialog.Backdrop />
          <SeedResponsiveDialog.Content ref={ref} {...otherProps}>
            {showHandle && <SeedResponsiveDialog.Handle />}
            {shouldRenderHeader && (
              <SeedResponsiveDialog.Header>
                {title ? (
                  <SeedResponsiveDialog.Title>{title}</SeedResponsiveDialog.Title>
                ) : (
                  <VisuallyHidden asChild>
                    <SeedResponsiveDialog.Title>
                      {otherProps["aria-label"] || ""}
                    </SeedResponsiveDialog.Title>
                  </VisuallyHidden>
                )}
                {description && (
                  <SeedResponsiveDialog.Description>{description}</SeedResponsiveDialog.Description>
                )}
              </SeedResponsiveDialog.Header>
            )}
            {children}
            {showCloseButton && (
              <SeedResponsiveDialog.CloseButton aria-label="닫기">
                <Icon svg={<IconXmarkLine />} />
              </SeedResponsiveDialog.CloseButton>
            )}
          </SeedResponsiveDialog.Content>
        </SeedResponsiveDialog.Positioner>
      );
    }

    const shouldRenderHeader = title || description || showCloseButton;

    return (
      <SeedResponsiveDialog.Positioner
        style={{ "--layer-index": layerIndex } as React.CSSProperties}
      >
        <SeedResponsiveDialog.Backdrop />
        <SeedResponsiveDialog.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedResponsiveDialog.Header>
              {title && <SeedResponsiveDialog.Title>{title}</SeedResponsiveDialog.Title>}
              {description && (
                <SeedResponsiveDialog.Description>{description}</SeedResponsiveDialog.Description>
              )}
              {showCloseButton && (
                <SeedResponsiveDialog.CloseButton aria-label="닫기">
                  <Icon svg={<IconXmarkLine />} />
                </SeedResponsiveDialog.CloseButton>
              )}
            </SeedResponsiveDialog.Header>
          )}
          {children}
        </SeedResponsiveDialog.Content>
      </SeedResponsiveDialog.Positioner>
    );
  },
);

ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

export interface ResponsiveDialogBodyProps extends SeedResponsiveDialog.BodyProps {}

export const ResponsiveDialogBody = SeedResponsiveDialog.Body;

export interface ResponsiveDialogFooterProps extends SeedResponsiveDialog.FooterProps {}

export const ResponsiveDialogFooter = SeedResponsiveDialog.Footer;

export interface ResponsiveDialogActionProps
  extends Omit<SeedResponsiveDialog.ActionProps, "color">,
    ActionButtonProps {}

export const ResponsiveDialogAction = forwardRef<HTMLButtonElement, ResponsiveDialogActionProps>(
  (props, ref) => {
    return (
      <SeedResponsiveDialog.Action asChild>
        <ActionButton {...props} ref={ref} />
      </SeedResponsiveDialog.Action>
    );
  },
);

ResponsiveDialogAction.displayName = "ResponsiveDialogAction";
