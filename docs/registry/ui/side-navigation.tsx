"use client";

import {
  IconChevronUpSmallFill,
  IconSquareSplitedVerticalLeftLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, SideNavigation as SeedSideNavigation } from "@seed-design/react";
import { MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuRoot, MenuTrigger } from "./menu";
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
      // You may implement your own i18n for toggle label
      aria-label={collapsed ? "사이드바 열기" : "사이드바 닫기"}
      ref={ref}
      {...props}
    >
      <Icon svg={<IconSquareSplitedVerticalLeftLine />} />
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

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationCollapsibleItemData {
  label: React.ReactNode;
  prefixIcon?: React.ReactElement;
  suffixIcon?: React.ReactElement;
  current?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}

export interface SideNavigationMenuItemCollapsibleProps
  extends Omit<SeedSideNavigation.MenuItemCollapsibleRootProps, "children"> {
  prefixIcon?: React.ReactElement;
  label: React.ReactNode;
  items: SideNavigationCollapsibleItemData[];
}

export const SideNavigationMenuItemCollapsible = React.forwardRef<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleProps
>(({ prefixIcon, label, items, ...rootProps }, ref) => {
  const { collapsed } = useSideNavigationContext();

  if (collapsed) {
    return (
      <MenuRoot size="small" placement="right-start">
        <MenuTrigger asChild>
          <SideNavigationMenuItemButton
            prefixIcon={prefixIcon}
            label={label}
            current={items.some((item) => item.current)}
          />
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>{label}</MenuGroupLabel>
            {items.map((item, index) => (
              <MenuItem
                key={index}
                disabled={item.disabled}
                onClick={item.onClick}
                label={item.label}
              />
            ))}
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    );
  }

  return (
    <SeedSideNavigation.MenuItemCollapsibleRoot ref={ref} {...rootProps}>
      <SeedSideNavigation.MenuItemCollapsibleTrigger>
        {prefixIcon && <SeedSideNavigation.MenuItemPrefixIcon svg={prefixIcon} />}
        <SeedSideNavigation.MenuItemLabel>{label}</SeedSideNavigation.MenuItemLabel>
        <SeedSideNavigation.MenuItemSuffixIcon svg={<IconChevronUpSmallFill />} />
      </SeedSideNavigation.MenuItemCollapsibleTrigger>
      <SeedSideNavigation.MenuItemCollapsibleContent>
        {items.map((item, index) => (
          <SideNavigationMenuItemButton
            key={index}
            current={item.current}
            disabled={item.disabled}
            prefixIcon={item.prefixIcon}
            label={item.label}
            suffixIcon={item.suffixIcon}
            onClick={item.onClick}
          />
        ))}
      </SeedSideNavigation.MenuItemCollapsibleContent>
    </SeedSideNavigation.MenuItemCollapsibleRoot>
  );
});
SideNavigationMenuItemCollapsible.displayName = "SideNavigationMenuItemCollapsible";

////////////////////////////////////////////////////////////////////////////////////

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

export interface SideNavigationInsetProps extends SeedSideNavigation.InsetProps {}
export const SideNavigationInset = SeedSideNavigation.Inset;
