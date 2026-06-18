"use client";

import { NavigationMenu as SeedNavigationMenu, PrefixIcon, SuffixIcon } from "@seed-design/react";
import * as React from "react";

export interface NavigationMenuDelayGroupProps extends SeedNavigationMenu.DelayGroupProps {}

export const NavigationMenuDelayGroup = SeedNavigationMenu.DelayGroup;

export interface NavigationMenuRootProps extends SeedNavigationMenu.RootProps {}

export const NavigationMenuRoot = SeedNavigationMenu.Root;

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

  description?: React.ReactNode;

  suffixIcon?: React.ReactNode;
}

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ prefixIcon, label, description, suffixIcon, ...props }, ref) => {
    return (
      <SeedNavigationMenu.Link ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedNavigationMenu.LinkBody>
          <SeedNavigationMenu.LinkLabel>{label}</SeedNavigationMenu.LinkLabel>
          {description && (
            <SeedNavigationMenu.LinkDescription>{description}</SeedNavigationMenu.LinkDescription>
          )}
        </SeedNavigationMenu.LinkBody>
        {suffixIcon && <SuffixIcon svg={suffixIcon} />}
      </SeedNavigationMenu.Link>
    );
  },
);
NavigationMenuLink.displayName = "NavigationMenuLink";
