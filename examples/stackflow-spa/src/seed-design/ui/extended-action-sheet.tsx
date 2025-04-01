"use client";

import { ExtendedActionSheet as SeedExtendedActionSheet } from "@seed-design/react";
import { forwardRef } from "react";

export interface ExtendedActionSheetRootProps extends SeedExtendedActionSheet.RootProps {}

/**
 * @see https://seed-design.io/react/components/extended-action-sheet
 */
export const ExtendedActionSheetRoot = (props: ExtendedActionSheetRootProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedExtendedActionSheet.Root closeOnInteractOutside={true} {...otherProps}>
      {children}
    </SeedExtendedActionSheet.Root>
  );
};

export interface ExtendedActionSheetTriggerProps extends SeedExtendedActionSheet.TriggerProps {}

export const ExtendedActionSheetTrigger = SeedExtendedActionSheet.Trigger;

export interface ExtendedActionSheetContentProps
  extends Omit<SeedExtendedActionSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  layerIndex?: number;
}

export const ExtendedActionSheetContent = forwardRef<
  HTMLDivElement,
  ExtendedActionSheetContentProps
>(({ children, title, layerIndex, ...otherProps }, ref) => {
  if (
    !title &&
    !otherProps["aria-labelledby"] &&
    !otherProps["aria-label"] &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn(
      "ExtendedActionSheetContent: aria-labelledby or aria-label should be provided if title is not provided.",
    );
  }

  return (
    <SeedExtendedActionSheet.Positioner
      style={{ "--layer-index": layerIndex } as React.CSSProperties}
    >
      <SeedExtendedActionSheet.Backdrop />
      <SeedExtendedActionSheet.Content ref={ref} {...otherProps}>
        {title && (
          <SeedExtendedActionSheet.Header>
            <SeedExtendedActionSheet.Title>{title}</SeedExtendedActionSheet.Title>
          </SeedExtendedActionSheet.Header>
        )}
        <SeedExtendedActionSheet.List>{children}</SeedExtendedActionSheet.List>
        <SeedExtendedActionSheet.Footer>
          {/* You may implement your own i18n for dismiss label */}
          <SeedExtendedActionSheet.CloseButton>취소</SeedExtendedActionSheet.CloseButton>
        </SeedExtendedActionSheet.Footer>
      </SeedExtendedActionSheet.Content>
    </SeedExtendedActionSheet.Positioner>
  );
});

export interface ExtendedActionSheetGroupProps extends SeedExtendedActionSheet.GroupProps {}

export const ExtendedActionSheetGroup = SeedExtendedActionSheet.Group;

export interface ExtendedActionSheetItemProps extends SeedExtendedActionSheet.ItemProps {}

export const ExtendedActionSheetItem = SeedExtendedActionSheet.Item;
