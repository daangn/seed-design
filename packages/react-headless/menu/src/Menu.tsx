"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import {
  useMenu,
  type UseMenuProps,
  type UseMenuItemProps,
  type UseMenuGroupProps,
  type UseMenuGroupLabelProps,
} from "./useMenu";
import { MenuProvider, useMenuContext } from "./useMenuContext";

// ---------------------------------------------------------------------------
// MenuRoot
// ---------------------------------------------------------------------------

export interface MenuRootProps extends UseMenuProps {
  children: React.ReactNode;
}

export const MenuRoot = (props: MenuRootProps) => {
  const { children, ...otherProps } = props;
  const api = useMenu(otherProps);
  return <MenuProvider value={api}>{children}</MenuProvider>;
};

// ---------------------------------------------------------------------------
// MenuTrigger
// ---------------------------------------------------------------------------

export interface MenuTriggerProps extends PrimitiveProps, React.HTMLAttributes<HTMLButtonElement> {}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>((props, ref) => {
  const api = useMenuContext();
  return (
    <Primitive.button
      ref={composeRefs(api.refs.trigger, ref)}
      {...mergeProps(api.triggerProps, props)}
    />
  );
});
MenuTrigger.displayName = "MenuTrigger";

// ---------------------------------------------------------------------------
// MenuContent
// ---------------------------------------------------------------------------

export interface MenuContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>((props, ref) => {
  const api = useMenuContext();
  if (!api.open) return null;
  return (
    <Primitive.div
      ref={composeRefs(api.refs.content, ref)}
      {...mergeProps(api.contentProps, props)}
    />
  );
});
MenuContent.displayName = "MenuContent";

// ---------------------------------------------------------------------------
// MenuItem
// ---------------------------------------------------------------------------

export interface MenuItemProps
  extends UseMenuItemProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>((props, ref) => {
  const { disabled, closeOnClick, label, onClick, ...otherProps } = props;
  const api = useMenuContext();
  const itemApi = api.getItemProps({ disabled, closeOnClick, label, onClick });
  return (
    <Primitive.div
      ref={composeRefs(itemApi.refs.root, ref)}
      {...mergeProps(itemApi.rootProps, otherProps)}
    />
  );
});
MenuItem.displayName = "MenuItem";

// ---------------------------------------------------------------------------
// MenuGroup
// ---------------------------------------------------------------------------

export interface MenuGroupProps
  extends UseMenuGroupProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>((props, ref) => {
  const { labelId, ...otherProps } = props;
  const api = useMenuContext();
  return <Primitive.div ref={ref} {...mergeProps(api.getGroupProps({ labelId }), otherProps)} />;
});
MenuGroup.displayName = "MenuGroup";

// ---------------------------------------------------------------------------
// MenuGroupLabel
// ---------------------------------------------------------------------------

export interface MenuGroupLabelProps
  extends UseMenuGroupLabelProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>((props, ref) => {
  const api = useMenuContext();
  return (
    <Primitive.div ref={ref} {...mergeProps(api.getGroupLabelProps({ id: props.id }), props)} />
  );
});
MenuGroupLabel.displayName = "MenuGroupLabel";

// ---------------------------------------------------------------------------
// MenuDivider
// ---------------------------------------------------------------------------

export interface MenuDividerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuDivider = forwardRef<HTMLDivElement, MenuDividerProps>((props, ref) => {
  const api = useMenuContext();
  return <Primitive.div ref={ref} {...mergeProps(api.getDividerProps(), props)} />;
});
MenuDivider.displayName = "MenuDivider";
