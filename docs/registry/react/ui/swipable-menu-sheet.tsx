"use client";

import { PrefixIcon, SwipableMenuSheet as SeedSwipableMenuSheet } from "@seed-design/react";
import { forwardRef } from "react";
import type * as React from "react";

export interface SwipableMenuSheetRootProps extends SeedSwipableMenuSheet.RootProps {}

/**
 * @see https://seed-design.io/react/components/swipable-menu-sheet
 */
export const SwipableMenuSheetRoot = (props: SwipableMenuSheetRootProps) => {
  const { children, ...otherProps } = props;
  return <SeedSwipableMenuSheet.Root {...otherProps}>{children}</SeedSwipableMenuSheet.Root>;
};

export interface SwipableMenuSheetTriggerProps extends SeedSwipableMenuSheet.TriggerProps {}

export const SwipableMenuSheetTrigger = SeedSwipableMenuSheet.Trigger;

export interface SwipableMenuSheetContentProps
  extends Omit<SeedSwipableMenuSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;
}

export const SwipableMenuSheetContent = forwardRef<HTMLDivElement, SwipableMenuSheetContentProps>(
  ({ children, title, description, layerIndex, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "SwipableMenuSheetContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    return (
      <SeedSwipableMenuSheet.Positioner
        style={{ "--layer-index": layerIndex } as React.CSSProperties}
      >
        <SeedSwipableMenuSheet.Backdrop />
        <SeedSwipableMenuSheet.Content ref={ref} {...otherProps}>
          <SeedSwipableMenuSheet.Handle />
          {(title || description) && (
            <SeedSwipableMenuSheet.Header>
              {title && <SeedSwipableMenuSheet.Title>{title}</SeedSwipableMenuSheet.Title>}
              {description && (
                <SeedSwipableMenuSheet.Description>{description}</SeedSwipableMenuSheet.Description>
              )}
            </SeedSwipableMenuSheet.Header>
          )}
          <SeedSwipableMenuSheet.List>{children}</SeedSwipableMenuSheet.List>
          {/* You may implement your own i18n for dismiss label */}
          <SeedSwipableMenuSheet.HiddenCloseButton aria-label="닫기" />
        </SeedSwipableMenuSheet.Content>
      </SeedSwipableMenuSheet.Positioner>
    );
  },
);

export interface SwipableMenuSheetGroupProps extends SeedSwipableMenuSheet.GroupProps {}

export const SwipableMenuSheetGroup = SeedSwipableMenuSheet.Group;

export interface SwipableMenuSheetItemProps
  extends Omit<SeedSwipableMenuSheet.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  description?: React.ReactNode;
}

export const SwipableMenuSheetItem = forwardRef<HTMLButtonElement, SwipableMenuSheetItemProps>(
  ({ prefixIcon, label, description, ...props }, ref) => {
    return (
      <SeedSwipableMenuSheet.Item ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedSwipableMenuSheet.ItemContent>
          <SeedSwipableMenuSheet.ItemLabel>{label}</SeedSwipableMenuSheet.ItemLabel>
          {description && (
            <SeedSwipableMenuSheet.ItemDescription>
              {description}
            </SeedSwipableMenuSheet.ItemDescription>
          )}
        </SeedSwipableMenuSheet.ItemContent>
      </SeedSwipableMenuSheet.Item>
    );
  },
);
