"use client";

import { Menu as MenuPrimitive, useMenuContext, useMenuItemContext } from "@seed-design/react-menu";
import { menu, type MenuVariantProps } from "@seed-design/css/recipes/menu";
import { menuItem, type MenuItemVariantProps } from "@seed-design/css/recipes/menu-item";
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
const withStateProps = createWithStateProps([useMenuContext]);
const withItemStateProps = createWithStateProps([useMenuItemContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuRootProps extends MenuVariantProps, MenuPrimitive.RootProps {}

export const MenuRoot = (props: MenuRootProps) => {
  const [variantProps, otherProps] = menu.splitVariantProps(props);
  const classNames = menu(variantProps);

  return (
    <ClassNamesProvider value={classNames}>
      <ItemPropsProvider value={{ size: variantProps.size }}>
        <MenuPrimitive.Root {...otherProps} />
      </ItemPropsProvider>
    </ClassNamesProvider>
  );
};

////////////////////////////////////////////////////////////////////////////////////

export interface MenuAnchorProps extends MenuPrimitive.AnchorProps {}

export const MenuAnchor = MenuPrimitive.Anchor;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuTriggerProps extends MenuPrimitive.TriggerProps {}

export const MenuTrigger = MenuPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuPositionerProps
  extends MenuPrimitive.PositionerProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <MenuPrimitive.Positioner
        ref={ref}
        className={clsx(classNames.positioner, className)}
        {...props}
      />
    );
  },
);
MenuPositioner.displayName = "MenuPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends MenuPrimitive.ContentProps {}

export const MenuContent = withContext<HTMLDivElement, MenuContentProps>(
  MenuPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuScrollAreaProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuScrollArea = withContext<HTMLDivElement, MenuScrollAreaProps>(
  withStateProps(Primitive.div),
  "scrollArea",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends MenuPrimitive.GroupProps {}

export const MenuGroup = withContext<HTMLDivElement, MenuGroupProps>(MenuPrimitive.Group, "group");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupLabelProps extends MenuPrimitive.GroupLabelProps {}

export const MenuGroupLabel = withContext<HTMLDivElement, MenuGroupLabelProps>(
  MenuPrimitive.GroupLabel,
  "groupLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps extends MenuItemVariantProps, MenuPrimitive.ItemProps {}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className: propClassName, ...props }, ref) => {
    const [variantProps, otherProps] = menuItem.splitVariantProps(props);
    const parentProps = useItemProps();

    const classNames = menuItem({ ...parentProps, ...variantProps });

    return (
      <ItemClassNamesProvider value={classNames}>
        <MenuPrimitive.Item
          ref={ref}
          className={clsx(classNames.root, propClassName)}
          {...otherProps}
        />
      </ItemClassNamesProvider>
    );
  },
);
MenuItem.displayName = "MenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuItemBody = withItemContext<HTMLDivElement, MenuItemBodyProps>(
  withItemStateProps(Primitive.div),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const MenuItemLabel = withItemContext<HTMLSpanElement, MenuItemLabelProps>(
  withItemStateProps(Primitive.span),
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const MenuItemDescription = withItemContext<HTMLSpanElement, MenuItemDescriptionProps>(
  withItemStateProps(Primitive.span),
  "description",
);
