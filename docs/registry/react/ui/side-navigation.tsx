"use client";

import {
  IconChevronUpSmallFill,
  IconSquareSplitedVerticalLeftLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, SideNavigation as SeedSideNavigation } from "@seed-design/react";
import {
  NavigationMenuContent,
  NavigationMenuGroup,
  NavigationMenuGroupLabel,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { useSideNavigationContext } from "@seed-design/react/primitive";
import * as React from "react";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationTriggerProps
  extends Omit<SeedSideNavigation.TriggerProps, "children"> {}

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
      <Icon svg={<IconSquareSplitedVerticalLeftLine />} />
    </SeedSideNavigation.Trigger>
  );
});
SideNavigationTrigger.displayName = "SideNavigationTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationItemButtonProps
  extends Omit<SeedSideNavigation.ItemProps, "children"> {
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

export interface SideNavigationGroupProps {
  label?: React.ReactNode;
  items: ({
    key?: React.Key;
    label: React.ReactNode;
    prefixIcon?: React.ReactNode;
  } & (
    | {
        current?: boolean;
        disabled?: boolean;
        onClick?: React.MouseEventHandler;
        items?: never;
        defaultOpen?: never;
      }
    | {
        current?: never;
        disabled?: never;
        onClick?: never;
        defaultOpen?: boolean;
        items: {
          key?: React.Key;
          label: React.ReactNode;
          href?: string;
          current?: boolean;
          disabled?: boolean;
          onClick?: React.MouseEventHandler;
        }[];
      }
  ))[];
}

export const SideNavigationGroup = React.forwardRef<HTMLDivElement, SideNavigationGroupProps>(
  ({ label, items }, ref) => {
    const { collapsed, transitioning } = useSideNavigationContext();

    const isFlyout = collapsed && !transitioning;

    const renderedItems = items.map((item, index) => {
      if (!item.items) {
        return (
          <SideNavigationItemButton
            key={item.key ?? index}
            current={item.current}
            disabled={item.disabled}
            prefixIcon={item.prefixIcon}
            label={item.label}
            onClick={item.onClick}
          />
        );
      }

      const hasCurrentChild = item.items.some((sub) => sub.current);

      if (isFlyout) {
        return (
          <NavigationMenuItem key={item.key ?? index} value={String(item.key ?? index)}>
            <NavigationMenuTrigger asChild>
              <SideNavigationItemButton
                prefixIcon={item.prefixIcon}
                label={item.label}
                current={hasCurrentChild}
              />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuGroup>
                <NavigationMenuGroupLabel>{item.label}</NavigationMenuGroupLabel>
                {item.items.map((sub, subIndex) => (
                  <NavigationMenuLink
                    key={sub.key ?? subIndex}
                    href={sub.href}
                    current={sub.current}
                    aria-disabled={sub.disabled || undefined}
                    onClick={sub.onClick}
                    label={sub.label}
                  />
                ))}
              </NavigationMenuGroup>
            </NavigationMenuContent>
          </NavigationMenuItem>
        );
      }

      return (
        <SeedSideNavigation.ItemCollapsibleRoot
          key={item.key ?? index}
          defaultOpen={item.defaultOpen}
        >
          <SeedSideNavigation.ItemCollapsibleTrigger current={collapsed && hasCurrentChild}>
            {item.prefixIcon && <SeedSideNavigation.ItemPrefixIcon svg={item.prefixIcon} />}
            <SeedSideNavigation.ItemLabel>{item.label}</SeedSideNavigation.ItemLabel>
            <SeedSideNavigation.ItemSuffixIcon svg={<IconChevronUpSmallFill />} />
          </SeedSideNavigation.ItemCollapsibleTrigger>
          <SeedSideNavigation.ItemCollapsibleContent>
            {item.items.map((sub, subIndex) => (
              <SideNavigationItemButton
                key={sub.key ?? subIndex}
                current={sub.current}
                disabled={sub.disabled}
                label={sub.label}
                onClick={sub.onClick}
              />
            ))}
          </SeedSideNavigation.ItemCollapsibleContent>
        </SeedSideNavigation.ItemCollapsibleRoot>
      );
    });

    return (
      <SeedSideNavigation.Group ref={ref}>
        {label && <SeedSideNavigation.GroupLabel>{label}</SeedSideNavigation.GroupLabel>}
        {isFlyout ? (
          <NavigationMenuRoot orientation="vertical" size="small">
            <NavigationMenuList style={{ display: "contents" }}>{renderedItems}</NavigationMenuList>
          </NavigationMenuRoot>
        ) : (
          renderedItems
        )}
      </SeedSideNavigation.Group>
    );
  },
);
SideNavigationGroup.displayName = "SideNavigationGroup";

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

export interface SideNavigationInsetProps extends SeedSideNavigation.InsetProps {}
export const SideNavigationInset = SeedSideNavigation.Inset;
