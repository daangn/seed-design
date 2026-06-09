"use client";

import { NavigationMenu as SeedNavigationMenu, PrefixIcon } from "@seed-design/react";
import * as React from "react";

export interface NavigationMenuRootProps extends SeedNavigationMenu.RootProps {}

export const NavigationMenuRoot = SeedNavigationMenu.Root;

export interface NavigationMenuListProps extends SeedNavigationMenu.ListProps {}

export const NavigationMenuList = SeedNavigationMenu.List;

export interface NavigationMenuItemProps extends SeedNavigationMenu.ItemProps {}

export const NavigationMenuItem = SeedNavigationMenu.Item;

export interface NavigationMenuTriggerProps extends SeedNavigationMenu.TriggerProps {}

export const NavigationMenuTrigger = SeedNavigationMenu.Trigger;

export interface NavigationMenuContentProps extends SeedNavigationMenu.ContentProps {
  positionerContainer?: SeedNavigationMenu.PositionerProps["container"];
}

export const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ children, positionerContainer, ...props }, ref) => {
    return (
      <SeedNavigationMenu.Positioner container={positionerContainer}>
        <SeedNavigationMenu.Content ref={ref} {...props}>
          <SeedNavigationMenu.ScrollArea>{children}</SeedNavigationMenu.ScrollArea>
        </SeedNavigationMenu.Content>
      </SeedNavigationMenu.Positioner>
    );
  },
);
NavigationMenuContent.displayName = "NavigationMenuContent";

export interface NavigationMenuGroupProps extends SeedNavigationMenu.GroupProps {}

export const NavigationMenuGroup = SeedNavigationMenu.Group;

export interface NavigationMenuGroupLabelProps extends SeedNavigationMenu.GroupLabelProps {}

export const NavigationMenuGroupLabel = SeedNavigationMenu.GroupLabel;

export interface NavigationMenuLinkProps extends Omit<SeedNavigationMenu.LinkProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;
}

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ prefixIcon, label, ...props }, ref) => {
    return (
      <SeedNavigationMenu.Link ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedNavigationMenu.LinkBody>
          <SeedNavigationMenu.LinkLabel>{label}</SeedNavigationMenu.LinkLabel>
        </SeedNavigationMenu.LinkBody>
      </SeedNavigationMenu.Link>
    );
  },
);
NavigationMenuLink.displayName = "NavigationMenuLink";
