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

export interface SideNavigationItemButtonProps extends SeedSideNavigation.ItemProps {
  prefixIcon?: React.ReactNode;
  label: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const SideNavigationItemButton = React.forwardRef<
  HTMLButtonElement,
  SideNavigationItemButtonProps
>(({ prefixIcon, label, suffixIcon, ...rest }, ref) => {
  return (
    <SeedSideNavigation.Item ref={ref} {...rest}>
      {prefixIcon && <SeedSideNavigation.ItemPrefixIcon svg={prefixIcon} />}
      <SeedSideNavigation.ItemLabel>{label}</SeedSideNavigation.ItemLabel>
      {suffixIcon && <SeedSideNavigation.ItemSuffixIcon svg={suffixIcon} />}
    </SeedSideNavigation.Item>
  );
});
SideNavigationItemButton.displayName = "SideNavigationItemButton";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationCollapsibleItemData {
  label: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}

export interface SideNavigationItemCollapsibleProps
  extends Omit<SeedSideNavigation.ItemCollapsibleRootProps, "children"> {
  prefixIcon?: React.ReactNode;
  label: React.ReactNode;
  items: SideNavigationCollapsibleItemData[];
}

export const SideNavigationItemCollapsible = React.forwardRef<
  HTMLDivElement,
  SideNavigationItemCollapsibleProps
>(({ prefixIcon, label, items, ...rootProps }, ref) => {
  const { collapsed, transitioning } = useSideNavigationContext();
  const showMenu = collapsed && !transitioning;
  const hasCurrentChild = items.some((item) => item.current);

  if (showMenu) {
    return (
      <MenuRoot size="small" placement="right-start">
        <MenuTrigger asChild>
          <SideNavigationItemButton
            prefixIcon={prefixIcon}
            label={label}
            current={hasCurrentChild}
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
    <SeedSideNavigation.ItemCollapsibleRoot ref={ref} {...rootProps}>
      <SeedSideNavigation.ItemCollapsibleTrigger
        data-current={collapsed && hasCurrentChild ? "" : undefined}
      >
        {prefixIcon && (
          <SeedSideNavigation.ItemPrefixIcon
            svg={prefixIcon}
            data-current={collapsed && hasCurrentChild ? "" : undefined}
          />
        )}
        <SeedSideNavigation.ItemLabel>{label}</SeedSideNavigation.ItemLabel>
        <SeedSideNavigation.ItemSuffixIcon svg={<IconChevronUpSmallFill />} />
      </SeedSideNavigation.ItemCollapsibleTrigger>
      <SeedSideNavigation.ItemCollapsibleContent>
        {items.map((item, index) => (
          <SideNavigationItemButton
            key={index}
            current={item.current}
            disabled={item.disabled}
            prefixIcon={item.prefixIcon}
            label={item.label}
            suffixIcon={item.suffixIcon}
            onClick={item.onClick}
          />
        ))}
      </SeedSideNavigation.ItemCollapsibleContent>
    </SeedSideNavigation.ItemCollapsibleRoot>
  );
});
SideNavigationItemCollapsible.displayName = "SideNavigationItemCollapsible";

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
