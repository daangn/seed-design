import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuRootProps extends React.PropsWithChildren {}

export const MenuRoot = ({ children }: MenuRootProps) => {
  return <>{children}</>;
};

////////////////////////////////////////////////////////////////////////////////////

export interface MenuTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>((props, ref) => {
  return <Primitive.button ref={ref} {...props} />;
});
MenuTrigger.displayName = "MenuTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuPositionerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuPositioner = forwardRef<HTMLDivElement, MenuPositionerProps>((props, ref) => {
  return <Primitive.div ref={ref} {...props} />;
});
MenuPositioner.displayName = "MenuPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>((props, ref) => {
  return <Primitive.div ref={ref} role="menu" {...props} />;
});
MenuContent.displayName = "MenuContent";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>((props, ref) => {
  return <Primitive.div ref={ref} role="group" {...props} />;
});
MenuGroup.displayName = "MenuGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroupHeader = forwardRef<HTMLDivElement, MenuGroupHeaderProps>((props, ref) => {
  return <Primitive.div ref={ref} role="presentation" {...props} />;
});
MenuGroupHeader.displayName = "MenuGroupHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>((props, ref) => {
  return <Primitive.button ref={ref} role="menuitem" {...props} />;
});
MenuItem.displayName = "MenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const MenuItemLabel = forwardRef<HTMLSpanElement, MenuItemLabelProps>((props, ref) => {
  return <Primitive.span ref={ref} {...props} />;
});
MenuItemLabel.displayName = "MenuItemLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuDividerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuDivider = forwardRef<HTMLDivElement, MenuDividerProps>((props, ref) => {
  return <Primitive.div ref={ref} role="separator" {...props} />;
});
MenuDivider.displayName = "MenuDivider";
