"use client";

import { ExtendedActionSheet as SeedExtendedActionSheet } from "@seed-design/react";
import { forwardRef } from "react";
import type * as React from "react";

/**
 * @deprecated Use menu-sheet instead.
 */
export interface ExtendedActionSheetRootProps extends SeedExtendedActionSheet.RootProps {}

/**
 * @see https://seed-design.io/react/components/extended-action-sheet
 * @deprecated Use menu-sheet instead.
 */
export const ExtendedActionSheetRoot = (props: ExtendedActionSheetRootProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedExtendedActionSheet.Root closeOnInteractOutside={true} {...otherProps}>
      {children}
    </SeedExtendedActionSheet.Root>
  );
};

/**
 * @deprecated Use menu-sheet instead.
 */
export interface ExtendedActionSheetTriggerProps extends SeedExtendedActionSheet.TriggerProps {}

/**
 * @deprecated Use menu-sheet instead.
 */
export const ExtendedActionSheetTrigger = SeedExtendedActionSheet.Trigger;

/**
 * @deprecated Use menu-sheet instead.
 */
export interface ExtendedActionSheetContentProps
  extends Omit<SeedExtendedActionSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  layerIndex?: number;
}

/**
 * @deprecated Use menu-sheet instead.
 */
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

/**
 * @deprecated Use menu-sheet instead.
 */
export interface ExtendedActionSheetGroupProps extends SeedExtendedActionSheet.GroupProps {}

/**
 * @deprecated Use menu-sheet instead.
 */
export const ExtendedActionSheetGroup = SeedExtendedActionSheet.Group;

/**
 * @deprecated Use menu-sheet instead.
 */
export interface ExtendedActionSheetItemProps extends SeedExtendedActionSheet.ItemProps {}

/**
 * @deprecated Use menu-sheet instead.
 */
export const ExtendedActionSheetItem = SeedExtendedActionSheet.Item;
