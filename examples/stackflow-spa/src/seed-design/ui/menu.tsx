import { PrefixIcon, SuffixIcon, Menu as SeedMenu } from "@seed-design/react";
import * as React from "react";

export interface MenuRootProps extends SeedMenu.RootProps {}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuRoot = SeedMenu.Root;

export interface MenuAnchorProps extends SeedMenu.AnchorProps {}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuAnchor = SeedMenu.Anchor;

export interface MenuTriggerProps extends SeedMenu.TriggerProps {}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuTrigger = SeedMenu.Trigger;

export interface MenuContentProps extends SeedMenu.ContentProps {
  positionerContainer?: SeedMenu.PositionerProps["container"];
}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, positionerContainer, ...props }, ref) => {
    return (
      <SeedMenu.Positioner container={positionerContainer}>
        <SeedMenu.Content ref={ref} {...props}>
          <SeedMenu.ScrollArea>{children}</SeedMenu.ScrollArea>
        </SeedMenu.Content>
      </SeedMenu.Positioner>
    );
  },
);
MenuContent.displayName = "MenuContent";

export interface MenuGroupProps extends SeedMenu.GroupProps {}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuGroup = SeedMenu.Group;

export interface MenuGroupLabelProps extends SeedMenu.GroupLabelProps {}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuGroupLabel = SeedMenu.GroupLabel;

export interface MenuItemProps extends Omit<SeedMenu.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  description?: React.ReactNode;

  suffixIcon?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/menu
 */
export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ prefixIcon, label, description, suffixIcon, ...props }, ref) => {
    return (
      <SeedMenu.Item ref={ref} {...props}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedMenu.ItemBody>
          <SeedMenu.ItemLabel>{label}</SeedMenu.ItemLabel>
          {description && <SeedMenu.ItemDescription>{description}</SeedMenu.ItemDescription>}
        </SeedMenu.ItemBody>
        {suffixIcon && <SuffixIcon svg={suffixIcon} />}
      </SeedMenu.Item>
    );
  },
);
MenuItem.displayName = "MenuItem";
