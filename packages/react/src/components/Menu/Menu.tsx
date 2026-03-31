"use client";

import { Menu as MenuPrimitive } from "@seed-design/react-menu";
import { Portal } from "@seed-design/react-portal";
import { menu, type MenuVariantProps } from "@seed-design/css/recipes/menu";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(menu);

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
      <Portal>
        <MenuPrimitive.Positioner
          ref={ref}
          className={clsx(classNames.positioner, className)}
          {...props}
        />
      </Portal>
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
  Primitive.div,
  "scrollArea",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends MenuPrimitive.GroupProps {}

export const MenuGroup = withContext<HTMLDivElement, MenuGroupProps>(MenuPrimitive.Group, "group");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupHeaderProps extends MenuPrimitive.GroupLabelProps {}

export const MenuGroupHeader = withContext<HTMLDivElement, MenuGroupHeaderProps>(
  MenuPrimitive.GroupLabel,
  "groupHeader",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps extends MenuItemVariantProps, MenuPrimitive.ItemProps {}

export const MenuItem = withContext<HTMLDivElement, MenuItemProps>(MenuPrimitive.Item, "item");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const MenuItemLabel = withContext<HTMLSpanElement, MenuItemLabelProps>(
  Primitive.span,
  "itemLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuDividerProps extends MenuPrimitive.DividerProps {}

export const MenuDivider = withContext<HTMLDivElement, MenuDividerProps>(
  MenuPrimitive.Divider,
  "divider",
);
