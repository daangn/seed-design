"use client";

import { menu, type MenuVariantProps } from "@seed-design/css/recipes/menu";
import { menuItem, type MenuItemVariantProps } from "@seed-design/css/recipes/menu-item";
import {
  NavigationMenu as NavigationMenuPrimitive,
  useNavigationMenuItemContext,
  useNavigationMenuRootContext,
} from "@seed-design/react-navigation-menu";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { clsx } from "cn";
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
const withStateProps = createWithStateProps([useNavigationMenuRootContext]);
const withItemStateProps = createWithStateProps([useNavigationMenuItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuProviderProps
  extends MenuVariantProps,
    NavigationMenuPrimitive.ProviderProps {}

export const NavigationMenuProvider = (props: NavigationMenuProviderProps) => {
  const [variantProps, otherProps] = menu.splitVariantProps(props);
  const classNames = menu(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <ItemPropsProvider value={{ size: variantProps.size }}>
        <NavigationMenuPrimitive.Provider {...otherProps} />
      </ItemPropsProvider>
    </ClassNamesProvider>
  );
};

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuRootProps extends NavigationMenuPrimitive.RootProps {}

export const NavigationMenuRoot = NavigationMenuPrimitive.Root;

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

export interface NavigationMenuItemProps
  extends MenuItemVariantProps,
    NavigationMenuPrimitive.ItemProps {}

export const NavigationMenuItem = React.forwardRef<HTMLButtonElement, NavigationMenuItemProps>(
  ({ className: propClassName, ...props }, ref) => {
    const [variantProps, otherProps] = menuItem.splitVariantProps(props);
    const parentProps = useItemProps();

    const classNames = menuItem({ ...parentProps, ...variantProps });

    return (
      <ItemClassNamesProvider value={classNames}>
        <NavigationMenuPrimitive.Item
          ref={ref}
          className={clsx(classNames.root, propClassName)}
          {...otherProps}
        />
      </ItemClassNamesProvider>
    );
  },
);
NavigationMenuItem.displayName = "NavigationMenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuItemBodyProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuItemBody = withItemContext<HTMLDivElement, NavigationMenuItemBodyProps>(
  withItemStateProps(Primitive.div),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NavigationMenuItemLabel = withItemContext<
  HTMLSpanElement,
  NavigationMenuItemLabelProps
>(withItemStateProps(Primitive.span), "label");

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const NavigationMenuItemDescription = withItemContext<
  HTMLSpanElement,
  NavigationMenuItemDescriptionProps
>(withItemStateProps(Primitive.span), "description");
