import { Menu as MenuPrimitive } from "@base-ui-components/react/menu";
import type { Separator } from "@base-ui-components/react/separator";
import { menu, type MenuVariantProps } from "@seed-design/css/recipes/menu";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withRootProvider, withContext, useClassNames } = createSlotRecipeContext(menu);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuRootProps extends MenuVariantProps, MenuPrimitive.Root.Props {}

export const MenuRoot = withRootProvider<MenuRootProps>(MenuPrimitive.Root);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {}

export const MenuTrigger = MenuPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuPositionerProps extends MenuPrimitive.Positioner.Props {}

export const MenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    return (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          ref={ref}
          className={clsx(classNames.positioner, className)}
          {...props}
        />
      </MenuPrimitive.Portal>
    );
  },
);
MenuPositioner.displayName = "MenuPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends MenuPrimitive.Popup.Props {}

export const MenuContent = withContext<HTMLDivElement, MenuContentProps>(
  MenuPrimitive.Popup,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends MenuPrimitive.Group.Props {}

export const MenuGroup = withContext<HTMLDivElement, MenuGroupProps>(MenuPrimitive.Group, "group");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupHeaderProps extends MenuPrimitive.GroupLabel.Props {}

export const MenuGroupHeader = withContext<HTMLDivElement, MenuGroupHeaderProps>(
  MenuPrimitive.GroupLabel,
  "groupHeader",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps extends MenuPrimitive.Item.Props {}

export const MenuItem = withContext<HTMLDivElement, MenuItemProps>(MenuPrimitive.Item, "item");

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const MenuItemLabel = withContext<HTMLSpanElement, MenuItemLabelProps>(
  Primitive.span,
  "itemLabel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuDividerProps extends Separator.Props {}

export const MenuDivider = withContext<HTMLDivElement, MenuDividerProps>(
  MenuPrimitive.Separator,
  "divider",
);

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSubmenuRootProps extends MenuPrimitive.SubmenuRoot.Props {}

export const MenuSubmenuRoot = MenuPrimitive.SubmenuRoot;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuSubmenuTriggerProps extends MenuPrimitive.SubmenuTrigger.Props {}

export const MenuSubmenuTrigger = withContext<HTMLDivElement, MenuSubmenuTriggerProps>(
  MenuPrimitive.SubmenuTrigger,
  "item",
);
