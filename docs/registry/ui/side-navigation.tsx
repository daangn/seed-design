"use client";

import { IconScissorsLine } from "@karrotmarket/react-monochrome-icon";
import { Icon, SideNavigation as SeedSideNavigation } from "@seed-design/react";
import { useSideNavigationContext } from "@seed-design/react/primitive";
import * as React from "react";

export interface SideNavigationTriggerProps extends SeedSideNavigation.TriggerProps {}

export const SideNavigationTrigger = React.forwardRef<
  HTMLButtonElement,
  SideNavigationTriggerProps
>((props, ref) => {
  const { collapsed } = useSideNavigationContext();

  return (
    <SeedSideNavigation.Trigger
      aria-label={collapsed ? "사이드바 열기" : "사이드바 닫기"}
      ref={ref}
      {...props}
    >
      <Icon svg={<IconScissorsLine />} />
    </SeedSideNavigation.Trigger>
  );
});
SideNavigationTrigger.displayName = "SideNavigationTrigger";

export interface SideNavigationMenuItemButtonProps extends SeedSideNavigation.MenuItemProps {
  prefixIcon?: React.ReactElement;
  label: React.ReactNode;
  suffixIcon?: React.ReactElement;
}

export const SideNavigationMenuItemButton = React.forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemButtonProps
>(({ prefixIcon, label, suffixIcon, ...rest }, ref) => {
  return (
    <SeedSideNavigation.MenuItem ref={ref} {...rest}>
      {prefixIcon && <SeedSideNavigation.MenuItemPrefixIcon svg={prefixIcon} />}
      <SeedSideNavigation.MenuItemLabel>{label}</SeedSideNavigation.MenuItemLabel>
      {suffixIcon && <SeedSideNavigation.MenuItemSuffixIcon svg={suffixIcon} />}
    </SeedSideNavigation.MenuItem>
  );
});
SideNavigationMenuItemButton.displayName = "SideNavigationMenuItemButton";

export interface SideNavigationMenuItemCollapsibleTriggerProps
  extends SeedSideNavigation.MenuItemCollapsibleTriggerProps {
  prefixIcon?: React.ReactElement;
  label: React.ReactNode;
  suffixIcon?: React.ReactElement;
}

export const SideNavigationMenuItemCollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleTriggerProps
>(({ prefixIcon, label, suffixIcon, ...rest }, ref) => {
  return (
    <SeedSideNavigation.MenuItemCollapsibleTrigger ref={ref} {...rest}>
      {prefixIcon && <SeedSideNavigation.MenuItemPrefixIcon svg={prefixIcon} />}
      <SeedSideNavigation.MenuItemLabel>{label}</SeedSideNavigation.MenuItemLabel>
      {suffixIcon && <SeedSideNavigation.MenuItemSuffixIcon svg={suffixIcon} />}
    </SeedSideNavigation.MenuItemCollapsibleTrigger>
  );
});
SideNavigationMenuItemCollapsibleTrigger.displayName = "SideNavigationMenuItemCollapsibleTrigger";

export interface SideNavigationProviderProps extends SeedSideNavigation.ProviderProps {}
export const SideNavigationProvider = SeedSideNavigation.Provider;

export interface SideNavigationRootProps extends SeedSideNavigation.RootProps {}
export const SideNavigationRoot = SeedSideNavigation.Root;

export interface SideNavigationHeaderProps extends SeedSideNavigation.HeaderProps {}
export const SideNavigationHeader = SeedSideNavigation.Header;

export interface SideNavigationContentProps extends SeedSideNavigation.ContentProps {}
export const SideNavigationContent = SeedSideNavigation.Content;

export interface SideNavigationFooterProps extends SeedSideNavigation.FooterProps {}
export const SideNavigationFooter = SeedSideNavigation.Footer;

export interface SideNavigationGroupProps extends SeedSideNavigation.GroupProps {}
export const SideNavigationGroup = SeedSideNavigation.Group;

export interface SideNavigationGroupLabelProps extends SeedSideNavigation.GroupLabelProps {}
export const SideNavigationGroupLabel = SeedSideNavigation.GroupLabel;

export interface SideNavigationMenuItemCollapsibleRootProps
  extends SeedSideNavigation.MenuItemCollapsibleRootProps {}
export const SideNavigationMenuItemCollapsibleRoot = SeedSideNavigation.MenuItemCollapsibleRoot;

export interface SideNavigationMenuItemCollapsibleContentProps
  extends SeedSideNavigation.MenuItemCollapsibleContentProps {}
export const SideNavigationMenuItemCollapsibleContent =
  SeedSideNavigation.MenuItemCollapsibleContent;

export interface SideNavigationInsetProps extends SeedSideNavigation.InsetProps {}
export const SideNavigationInset = SeedSideNavigation.Inset;
