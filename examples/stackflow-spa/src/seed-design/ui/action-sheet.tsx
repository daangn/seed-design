"use client";

import { ActionSheet as SeedActionSheet } from "@seed-design/react";
import { forwardRef } from "react";

export interface ActionSheetRootProps extends SeedActionSheet.RootProps {}

/**
 * @see https://seed-design.io/react/components/action-sheet
 */
export const ActionSheetRoot = (props: ActionSheetRootProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedActionSheet.Root closeOnInteractOutside={true} {...otherProps}>
      {children}
    </SeedActionSheet.Root>
  );
};

export interface ActionSheetTriggerProps extends SeedActionSheet.TriggerProps {}

export const ActionSheetTrigger = SeedActionSheet.Trigger;

export interface ActionSheetContentProps extends Omit<SeedActionSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;
}

export const ActionSheetContent = forwardRef<HTMLDivElement, ActionSheetContentProps>(
  ({ children, title, description, layerIndex, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "ActionSheetContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    const shouldRenderHeader = title || description;

    return (
      <SeedActionSheet.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <SeedActionSheet.Backdrop />
        <SeedActionSheet.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedActionSheet.Header>
              {title && <SeedActionSheet.Title>{title}</SeedActionSheet.Title>}
              {description && (
                <SeedActionSheet.Description>{description}</SeedActionSheet.Description>
              )}
            </SeedActionSheet.Header>
          )}
          <SeedActionSheet.List>{children}</SeedActionSheet.List>
          {/* You may implement your own i18n for dismiss label */}
          <SeedActionSheet.CloseButton>취소</SeedActionSheet.CloseButton>
        </SeedActionSheet.Content>
      </SeedActionSheet.Positioner>
    );
  },
);

export interface ActionSheetItemProps
  extends Omit<SeedActionSheet.ItemProps, "asChild" | "children"> {
  label: React.ReactNode;
}

export const ActionSheetItem = forwardRef<HTMLButtonElement, ActionSheetItemProps>(
  ({ label, ...otherProps }, ref) => {
    return (
      <SeedActionSheet.Item ref={ref} {...otherProps}>
        {label}
      </SeedActionSheet.Item>
    );
  },
);
