import { NavigationMenu as SeedNavigationMenu, PrefixIcon, SuffixIcon } from "@seed-design/react";
import * as React from "react";

export interface NavigationMenuProviderProps extends SeedNavigationMenu.ProviderProps {}

export const NavigationMenuProvider = SeedNavigationMenu.Provider;

export interface NavigationMenuRootProps extends SeedNavigationMenu.RootProps {}

export const NavigationMenuRoot = SeedNavigationMenu.Root;

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

export interface NavigationMenuItemProps extends Omit<SeedNavigationMenu.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  description?: React.ReactNode;

  suffixIcon?: React.ReactNode;
}

export const NavigationMenuItem = React.forwardRef<HTMLButtonElement, NavigationMenuItemProps>(
  ({ prefixIcon, label, description, suffixIcon, ...props }, ref) => {
    return (
      <SeedNavigationMenu.Item ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedNavigationMenu.ItemBody>
          <SeedNavigationMenu.ItemLabel>{label}</SeedNavigationMenu.ItemLabel>
          {description && (
            <SeedNavigationMenu.ItemDescription>{description}</SeedNavigationMenu.ItemDescription>
          )}
        </SeedNavigationMenu.ItemBody>
        {suffixIcon && <SuffixIcon svg={suffixIcon} />}
      </SeedNavigationMenu.Item>
    );
  },
);
NavigationMenuItem.displayName = "NavigationMenuItem";
