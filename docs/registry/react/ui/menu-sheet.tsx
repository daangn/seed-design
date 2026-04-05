"use client";

import { PrefixIcon, MenuSheet as SeedMenuSheet } from "@seed-design/react";
import { forwardRef } from "react";
import type * as React from "react";

export interface MenuSheetRootProps extends SeedMenuSheet.RootProps {}

/**
 * @see https://seed-design.io/react/components/menu-sheet
 */
export const MenuSheetRoot = (props: MenuSheetRootProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedMenuSheet.Root closeOnInteractOutside={true} {...otherProps}>
      {children}
    </SeedMenuSheet.Root>
  );
};

export interface MenuSheetTriggerProps extends SeedMenuSheet.TriggerProps {}

export const MenuSheetTrigger = SeedMenuSheet.Trigger;

export interface MenuSheetContentProps extends Omit<SeedMenuSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;
}

export const MenuSheetContent = forwardRef<HTMLDivElement, MenuSheetContentProps>(
  ({ children, title, description, layerIndex, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "MenuSheetContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    return (
      <SeedMenuSheet.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <SeedMenuSheet.Backdrop />
        <SeedMenuSheet.Content ref={ref} {...otherProps}>
          {(title || description) && (
            <SeedMenuSheet.Header>
              {title && <SeedMenuSheet.Title>{title}</SeedMenuSheet.Title>}
              {description && <SeedMenuSheet.Description>{description}</SeedMenuSheet.Description>}
            </SeedMenuSheet.Header>
          )}
          <SeedMenuSheet.List>{children}</SeedMenuSheet.List>
          <SeedMenuSheet.Footer>
            {/* You may implement your own i18n for dismiss label */}
            <SeedMenuSheet.CloseButton>닫기</SeedMenuSheet.CloseButton>
          </SeedMenuSheet.Footer>
        </SeedMenuSheet.Content>
      </SeedMenuSheet.Positioner>
    );
  },
);

export interface MenuSheetGroupProps extends SeedMenuSheet.GroupProps {}

export const MenuSheetGroup = SeedMenuSheet.Group;

export interface MenuSheetItemProps extends Omit<SeedMenuSheet.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  description?: React.ReactNode;
}

export const MenuSheetItem = forwardRef<HTMLButtonElement, MenuSheetItemProps>(
  ({ prefixIcon, label, description, ...props }, ref) => {
    return (
      <SeedMenuSheet.Item ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedMenuSheet.ItemContent>
          <SeedMenuSheet.ItemLabel>{label}</SeedMenuSheet.ItemLabel>
          {description && (
            <SeedMenuSheet.ItemDescription>{description}</SeedMenuSheet.ItemDescription>
          )}
        </SeedMenuSheet.ItemContent>
      </SeedMenuSheet.Item>
    );
  },
);
