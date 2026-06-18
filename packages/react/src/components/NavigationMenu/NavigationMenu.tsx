"use client";

import { menu, type MenuVariantProps } from "@seed-design/css/recipes/menu";
import { menuItem, type MenuItemVariantProps } from "@seed-design/css/recipes/menu-item";
import {
  NavigationMenu as NavigationMenuPrimitive,
  useNavigationMenuItemContext,
} from "@seed-design/react-navigation-menu";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { ClassNamesProvider, withContext, useClassNames } = createSlotRecipeContext(menu);
const {
  PropsProvider: ItemPropsProvider,
  useProps: useItemProps,
  withContext: withItemContext,
  ClassNamesProvider: ItemClassNamesProvider,
} = createSlotRecipeContext(menuItem);
const withStateProps = createWithStateProps([useNavigationMenuItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuDelayGroupProps extends NavigationMenuPrimitive.DelayGroupProps {}

export const NavigationMenuDelayGroup = NavigationMenuPrimitive.DelayGroup;

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuRootProps
  extends MenuVariantProps,
    NavigationMenuPrimitive.RootProps {}

export const NavigationMenuRoot = (props: NavigationMenuRootProps) => {
  const [variantProps, otherProps] = menu.splitVariantProps(props);
  const classNames = menu(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <ItemPropsProvider value={{ size: variantProps.size }}>
        <NavigationMenuPrimitive.Root {...otherProps} />
      </ItemPropsProvider>
    </ClassNamesProvider>
  );
};

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuItemProps extends NavigationMenuPrimitive.ItemProps {}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuTriggerProps extends NavigationMenuPrimitive.TriggerProps {}

export const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuPositionerProps extends NavigationMenuPrimitive.PositionerProps {}

export const NavigationMenuPositioner = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPositionerProps
>(({ className, ...props }, ref) => {
  const classNames = useClassNames();

  return (
    <NavigationMenuPrimitive.Positioner
      ref={ref}
      className={clsx(classNames.positioner, className)}
      {...props}
    />
  );
});
NavigationMenuPositioner.displayName = "NavigationMenuPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuContentProps extends NavigationMenuPrimitive.ContentProps {}

export const NavigationMenuContent = withContext<HTMLDivElement, NavigationMenuContentProps>(
  NavigationMenuPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuScrollAreaProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuScrollArea = withContext<HTMLDivElement, NavigationMenuScrollAreaProps>(
  withStateProps(Primitive.div),
  "scrollArea",
);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuGroupProps extends NavigationMenuPrimitive.GroupProps {}

export const NavigationMenuGroup = withContext<HTMLDivElement, NavigationMenuGroupProps>(
  NavigationMenuPrimitive.Group,
  "group",
);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuGroupLabelProps extends NavigationMenuPrimitive.GroupLabelProps {}

export const NavigationMenuGroupLabel = withContext<HTMLDivElement, NavigationMenuGroupLabelProps>(
  NavigationMenuPrimitive.GroupLabel,
  "groupLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuLinkProps
  extends MenuItemVariantProps,
    NavigationMenuPrimitive.LinkProps {}

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className: propClassName, ...props }, ref) => {
    const [variantProps, otherProps] = menuItem.splitVariantProps(props);
    const parentProps = useItemProps();

    const classNames = menuItem({ ...parentProps, ...variantProps });

    return (
      <ItemClassNamesProvider value={classNames}>
        <NavigationMenuPrimitive.Link
          ref={ref}
          className={clsx(classNames.root, propClassName)}
          {...otherProps}
        />
      </ItemClassNamesProvider>
    );
  },
);
NavigationMenuLink.displayName = "NavigationMenuLink";

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuLinkBodyProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuLinkBody = withItemContext<HTMLDivElement, NavigationMenuLinkBodyProps>(
  Primitive.div,
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuLinkLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NavigationMenuLinkLabel = withItemContext<
  HTMLSpanElement,
  NavigationMenuLinkLabelProps
>(Primitive.span, "label");

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuLinkDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NavigationMenuLinkDescription = withItemContext<
  HTMLSpanElement,
  NavigationMenuLinkDescriptionProps
>(Primitive.span, "description");
