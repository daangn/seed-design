"use client";

import {
  SideNavigation as SeedSideNavigation,
  SideNavigationProvider,
  type SideNavigationProviderProps,
  type SideNavigationMenuItemProps as SeedMenuItemProps,
  type SideNavigationMenuItemCollapsibleTriggerProps as SeedCollapsibleTriggerProps,
} from "@seed-design/react";
import * as React from "react";

export interface MenuItemButtonProps extends SeedMenuItemProps {
  prefixIcon?: React.ReactElement;
  label: React.ReactNode;
  suffixIcon?: React.ReactElement;
}

export const MenuItemButton = React.forwardRef<HTMLButtonElement, MenuItemButtonProps>(
  ({ prefixIcon, label, suffixIcon, ...rest }, ref) => {
    return (
      <SeedSideNavigation.MenuItem ref={ref} {...rest}>
        {prefixIcon && <SeedSideNavigation.MenuItemPrefixIcon svg={prefixIcon} />}
        <SeedSideNavigation.MenuItemLabel>{label}</SeedSideNavigation.MenuItemLabel>
        {suffixIcon && <SeedSideNavigation.MenuItemSuffixIcon svg={suffixIcon} />}
      </SeedSideNavigation.MenuItem>
    );
  },
);
MenuItemButton.displayName = "MenuItemButton";

export interface MenuItemCollapsibleTriggerProps extends SeedCollapsibleTriggerProps {
  prefixIcon?: React.ReactElement;
  label: React.ReactNode;
  suffixIcon?: React.ReactElement;
}

export const MenuItemCollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  MenuItemCollapsibleTriggerProps
>(({ prefixIcon, label, suffixIcon, ...rest }, ref) => {
  return (
    <SeedSideNavigation.MenuItemCollapsibleTrigger ref={ref} {...rest}>
      {prefixIcon && <SeedSideNavigation.MenuItemPrefixIcon svg={prefixIcon} />}
      <SeedSideNavigation.MenuItemLabel>{label}</SeedSideNavigation.MenuItemLabel>
      {suffixIcon && <SeedSideNavigation.MenuItemSuffixIcon svg={suffixIcon} />}
    </SeedSideNavigation.MenuItemCollapsibleTrigger>
  );
});
MenuItemCollapsibleTrigger.displayName = "MenuItemCollapsibleTrigger";

export interface MenuItemProps extends SeedMenuItemProps {
  prefixIcon?: React.ReactElement;
  label: React.ReactNode;
  suffixIcon?: React.ReactElement;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ prefixIcon, label, suffixIcon, ...rest }, ref) => {
    return (
      <SeedSideNavigation.MenuItem ref={ref} {...rest}>
        {prefixIcon && <SeedSideNavigation.MenuItemPrefixIcon svg={prefixIcon} />}
        <SeedSideNavigation.MenuItemLabel>{label}</SeedSideNavigation.MenuItemLabel>
        {suffixIcon && <SeedSideNavigation.MenuItemSuffixIcon svg={suffixIcon} />}
      </SeedSideNavigation.MenuItem>
    );
  },
);
MenuItem.displayName = "MenuItem";

export const SideNavigation = {
  Provider: SideNavigationProvider,
  Root: SeedSideNavigation.Root,
  Header: SeedSideNavigation.Header,
  Content: SeedSideNavigation.Content,
  Footer: SeedSideNavigation.Footer,
  Group: SeedSideNavigation.Group,
  GroupLabel: SeedSideNavigation.GroupLabel,
  MenuItem,
  MenuItemButton,
  MenuItemCollapsibleRoot: SeedSideNavigation.MenuItemCollapsibleRoot,
  MenuItemCollapsibleTrigger,
  MenuItemCollapsibleContent: SeedSideNavigation.MenuItemCollapsibleContent,
  Trigger: SeedSideNavigation.Trigger,
  Inset: SeedSideNavigation.Inset,
} as const;

export type { SideNavigationProviderProps };
