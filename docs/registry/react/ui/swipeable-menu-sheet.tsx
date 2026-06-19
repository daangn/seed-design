"use client";

import {
  PrefixIcon,
  SwipeableMenuSheet as SeedSwipeableMenuSheet,
  VisuallyHidden,
} from "@seed-design/react";
import { forwardRef } from "react";
import type * as React from "react";

export interface SwipeableMenuSheetRootProps extends SeedSwipeableMenuSheet.RootProps {}

/**
 * @see https://seed-design.io/react/components/swipeable-menu-sheet
 */
export const SwipeableMenuSheetRoot = SeedSwipeableMenuSheet.Root;

export interface SwipeableMenuSheetTriggerProps extends SeedSwipeableMenuSheet.TriggerProps {}

export const SwipeableMenuSheetTrigger = SeedSwipeableMenuSheet.Trigger;

export interface SwipeableMenuSheetContentProps
  extends Omit<SeedSwipeableMenuSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default false
   */
  showCloseButton?: boolean;
}

export const SwipeableMenuSheetContent = forwardRef<HTMLDivElement, SwipeableMenuSheetContentProps>(
  ({ children, title, description, layerIndex, showCloseButton = false, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "SwipeableMenuSheetContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    return (
      <SeedSwipeableMenuSheet.Positioner
        style={{ "--layer-index": layerIndex } as React.CSSProperties}
      >
        <SeedSwipeableMenuSheet.Backdrop />
        <SeedSwipeableMenuSheet.Content ref={ref} {...otherProps}>
          <SeedSwipeableMenuSheet.Handle />
          {(title || description) && (
            <SeedSwipeableMenuSheet.Header>
              {title && <SeedSwipeableMenuSheet.Title>{title}</SeedSwipeableMenuSheet.Title>}
              {description && (
                <SeedSwipeableMenuSheet.Description>
                  {description}
                </SeedSwipeableMenuSheet.Description>
              )}
            </SeedSwipeableMenuSheet.Header>
          )}
          <SeedSwipeableMenuSheet.List>{children}</SeedSwipeableMenuSheet.List>
          {/* You may implement your own i18n for dismiss label */}
          {showCloseButton ? (
            <SeedSwipeableMenuSheet.Footer>
              <SeedSwipeableMenuSheet.CloseButton>닫기</SeedSwipeableMenuSheet.CloseButton>
            </SeedSwipeableMenuSheet.Footer>
          ) : (
            <VisuallyHidden asChild>
              <SeedSwipeableMenuSheet.CloseButton>닫기</SeedSwipeableMenuSheet.CloseButton>
            </VisuallyHidden>
          )}
        </SeedSwipeableMenuSheet.Content>
      </SeedSwipeableMenuSheet.Positioner>
    );
  },
);

export interface SwipeableMenuSheetGroupProps extends SeedSwipeableMenuSheet.GroupProps {}

export const SwipeableMenuSheetGroup = SeedSwipeableMenuSheet.Group;

export interface SwipeableMenuSheetItemProps
  extends Omit<SeedSwipeableMenuSheet.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  description?: React.ReactNode;
}

export const SwipeableMenuSheetItem = forwardRef<HTMLButtonElement, SwipeableMenuSheetItemProps>(
  ({ prefixIcon, label, description, ...props }, ref) => {
    return (
      <SeedSwipeableMenuSheet.Item ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedSwipeableMenuSheet.ItemContent>
          <SeedSwipeableMenuSheet.ItemLabel>{label}</SeedSwipeableMenuSheet.ItemLabel>
          {description && (
            <SeedSwipeableMenuSheet.ItemDescription>
              {description}
            </SeedSwipeableMenuSheet.ItemDescription>
          )}
        </SeedSwipeableMenuSheet.ItemContent>
      </SeedSwipeableMenuSheet.Item>
    );
  },
);
