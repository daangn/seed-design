"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import React, { forwardRef, createContext } from "react";
import { useMenu, type UseMenuItemProps, type UseMenuProps } from "./useMenu";
import { MenuProvider, useMenuContext } from "./useMenuContext";

const MenuGroupLabelIdContext = createContext<string | null>(null);

// ---------------------------------------------------------------------------
// MenuRoot
// ---------------------------------------------------------------------------

export interface MenuRootProps
  extends UseMenuProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const MenuRoot = ({
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  modal,
  placement,
  gutter,
  overflowPadding,
  strategy,

  ...props
}: MenuRootProps) => {
  const api = useMenu({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    modal,
    placement,
    gutter,
    overflowPadding,
    strategy,
  });

  return <MenuProvider value={api} {...props} />;
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
// MenuPositioner
// ---------------------------------------------------------------------------

export interface MenuPositionerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuPositioner = forwardRef<HTMLDivElement, MenuPositionerProps>((props, ref) => {
  const api = useMenuContext();
  if (!api.open) return null;

  return (
    <Primitive.div
      ref={composeRefs(api.refs.positioner, ref)}
      {...mergeProps(api.positionerProps, props)}
    />
  );
});
MenuPositioner.displayName = "MenuPositioner";

// ---------------------------------------------------------------------------
// MenuContent
// ---------------------------------------------------------------------------

export interface MenuContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>((props, ref) => {
  const api = useMenuContext();
  if (!api.open) return null;

  return <Primitive.div ref={ref} {...mergeProps(api.contentProps, props)} />;
});
MenuContent.displayName = "MenuContent";

// ---------------------------------------------------------------------------
// MenuItem
// ---------------------------------------------------------------------------

export interface MenuItemProps
  extends UseMenuItemProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ disabled, label, onClick, ...restProps }, ref) => {
    const { getItemProps } = useMenuContext();
    const api = getItemProps({ disabled, label, onClick });

    return (
      <Primitive.div
        ref={composeRefs(api.refs.root, ref)}
        {...mergeProps(api.rootProps, restProps)}
      />
    );
  },
);
MenuItem.displayName = "MenuItem";

// ---------------------------------------------------------------------------
// MenuGroup
// ---------------------------------------------------------------------------

export interface MenuGroupProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>((props, ref) => {
  const { getGroupProps } = useMenuContext();
  const { labelId, rootProps } = getGroupProps();

  return (
    <MenuGroupLabelIdContext.Provider value={labelId}>
      <Primitive.div ref={ref} {...mergeProps(rootProps, props)} />
    </MenuGroupLabelIdContext.Provider>
  );
});
MenuGroup.displayName = "MenuGroup";

// ---------------------------------------------------------------------------
// MenuGroupLabel
// ---------------------------------------------------------------------------

export interface MenuGroupLabelProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>((props, ref) => {
  const { getGroupLabelProps } = useMenuContext();
  const labelId = React.useContext(MenuGroupLabelIdContext);
  if (!labelId) throw new Error("MenuGroupLabel must be used within a MenuGroup");

  return <Primitive.div ref={ref} {...mergeProps(getGroupLabelProps(labelId), props)} />;
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
