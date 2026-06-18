"use client";

import { FloatingFocusManager, FloatingPortal, NextFloatingDelayGroup } from "@floating-ui/react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type React from "react";
import { createContext, forwardRef, useContext } from "react";
import {
  DEFAULT_CLOSE_DELAY,
  DEFAULT_OPEN_DELAY,
  useNavigationMenu,
  useNavigationMenuItem,
  type UseNavigationMenuItemProps,
  type UseNavigationMenuProps,
} from "./useNavigationMenu";
import { NavigationMenuProvider, useNavigationMenuContext } from "./useNavigationMenuContext";
import {
  NavigationMenuItemProvider,
  useNavigationMenuItemContext,
} from "./useNavigationMenuItemContext";

export interface NavigationMenuDelayGroupProps {
  children?: React.ReactNode;
  /**
   * Shared open delay (ms) for the grouped triggers.
   * @default 200
   */
  openDelay?: number;
  /**
   * Shared close delay (ms) for the grouped triggers.
   * @default 100
   */
  closeDelay?: number;
}

/**
 * Provider that lets a group of navigation menus (and `HelpBubbleTooltip`s)
 * share a hover delay: once one is open, the others open instantly while the
 * pointer moves between them.
 */
export function NavigationMenuDelayGroup({
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  children,
}: NavigationMenuDelayGroupProps) {
  return (
    <NextFloatingDelayGroup delay={{ open: openDelay, close: closeDelay }}>
      {children}
    </NextFloatingDelayGroup>
  );
}

export interface NavigationMenuRootProps extends UseNavigationMenuProps {
  children?: React.ReactNode;
}

export const NavigationMenuRoot = ({
  value,
  defaultValue,
  onValueChange,
  placement,
  openDelay,
  closeDelay,
  children,
}: NavigationMenuRootProps) => {
  const api = useNavigationMenu({
    value,
    defaultValue,
    onValueChange,
    placement,
    openDelay,
    closeDelay,
  });

  return <NavigationMenuProvider value={api}>{children}</NavigationMenuProvider>;
};

export interface NavigationMenuItemProps extends UseNavigationMenuItemProps {
  children?: React.ReactNode;
}

export const NavigationMenuItem = ({
  value,
  disabled,
  placement,
  gutter,
  overflowPadding,
  strategy,
  children,
}: NavigationMenuItemProps) => {
  const root = useNavigationMenuContext();
  const api = useNavigationMenuItem(root, {
    value,
    disabled,
    placement,
    gutter,
    overflowPadding,
    strategy,
  });

  return <NavigationMenuItemProvider value={api}>{children}</NavigationMenuItemProvider>;
};

export interface NavigationMenuTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  (props, ref) => {
    const api = useNavigationMenuItemContext();

    return (
      <Primitive.button
        ref={composeRefs(api.refs.trigger, ref)}
        {...mergeProps(api.triggerProps, props)}
      />
    );
  },
);
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export interface NavigationMenuPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  /**
   * The container element to render the portal into.
   * @default document.body
   */
  container?: React.RefObject<HTMLElement | null>;
}

export const NavigationMenuPositioner = forwardRef<HTMLDivElement, NavigationMenuPositionerProps>(
  ({ container, ...props }, ref) => {
    const api = useNavigationMenuItemContext();

    return (
      <FloatingPortal root={container ?? undefined}>
        <Primitive.div
          ref={composeRefs(api.refs.positioner, ref)}
          {...mergeProps(api.positionerProps, props)}
        />
      </FloatingPortal>
    );
  },
);
NavigationMenuPositioner.displayName = "NavigationMenuPositioner";

export interface NavigationMenuContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  (props, ref) => {
    const { floatingContext, contentProps, focusManaged } = useNavigationMenuItemContext();

    // FloatingFocusManager (non-modal) is enabled only when the flyout was
    // opened by keyboard (`focusManaged`). It then moves focus into the content,
    // keeps Tab order coherent across the portal, and returns focus to the
    // trigger on Esc/close. For mouse hover/click it stays disabled so opening
    // never steals focus off the page — the reported focus-on-hover bug.
    return (
      <FloatingFocusManager context={floatingContext} disabled={!focusManaged} modal={false}>
        <Primitive.div ref={ref} {...mergeProps(contentProps, props)} />
      </FloatingFocusManager>
    );
  },
);
NavigationMenuContent.displayName = "NavigationMenuContent";

////////////////////////////////////////////////////////////////////////////////////

const NavigationMenuGroupLabelIdContext = createContext<string | null>(null);

export interface NavigationMenuGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuGroup = forwardRef<HTMLDivElement, NavigationMenuGroupProps>(
  (props, ref) => {
    const { getGroupProps } = useNavigationMenuItemContext();
    const { labelId, rootProps } = getGroupProps();

    return (
      <NavigationMenuGroupLabelIdContext.Provider value={labelId}>
        <Primitive.div ref={ref} {...mergeProps(rootProps, props)} />
      </NavigationMenuGroupLabelIdContext.Provider>
    );
  },
);
NavigationMenuGroup.displayName = "NavigationMenuGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuGroupLabel = forwardRef<HTMLDivElement, NavigationMenuGroupLabelProps>(
  (props, ref) => {
    const { getGroupLabelProps } = useNavigationMenuItemContext();
    const labelId = useContext(NavigationMenuGroupLabelIdContext);
    if (!labelId) {
      throw new Error("NavigationMenuGroupLabel must be used within a NavigationMenuGroup");
    }

    return <Primitive.div ref={ref} {...mergeProps(getGroupLabelProps(labelId), props)} />;
  },
);
NavigationMenuGroupLabel.displayName = "NavigationMenuGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuLinkProps
  extends PrimitiveProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Marks this link as the current page (sets aria-current="page").
   */
  current?: boolean;
}

export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ current, ...props }, ref) => {
    const { getLinkProps } = useNavigationMenuItemContext();

    return <Primitive.a ref={ref} {...mergeProps(getLinkProps({ current }), props)} />;
  },
);
NavigationMenuLink.displayName = "NavigationMenuLink";
