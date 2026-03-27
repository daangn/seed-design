import { Menu as MenuPrimitive } from "@base-ui-components/react/menu";
import type { Separator } from "@base-ui-components/react/separator";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuRootProps extends MenuPrimitive.Root.Props {}

export const MenuRoot = MenuPrimitive.Root;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuTriggerProps extends MenuPrimitive.Trigger.Props {}

export const MenuTrigger = MenuPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuPositionerProps extends MenuPrimitive.Positioner.Props {}

export const MenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
  (props, ref) => {
    return (
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner ref={ref} {...props} />
      </MenuPrimitive.Portal>
    );
  },
);
MenuPositioner.displayName = "MenuPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends MenuPrimitive.Popup.Props {}

export const MenuContent = MenuPrimitive.Popup;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends MenuPrimitive.Group.Props {}

export const MenuGroup = MenuPrimitive.Group;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupHeaderProps extends MenuPrimitive.GroupLabel.Props {}

export const MenuGroupHeader = MenuPrimitive.GroupLabel;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps extends MenuPrimitive.Item.Props {}

export const MenuItem = MenuPrimitive.Item;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const MenuItemLabel = React.forwardRef<HTMLSpanElement, MenuItemLabelProps>((props, ref) => {
  return <Primitive.span ref={ref} {...props} />;
});
MenuItemLabel.displayName = "MenuItemLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuDividerProps extends Separator.Props {}

export const MenuDivider: React.ForwardRefExoticComponent<
  MenuDividerProps & React.RefAttributes<HTMLDivElement>
> = MenuPrimitive.Separator;
