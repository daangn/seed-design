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
  useNavigationMenuGroup,
  useNavigationMenuRoot,
  type UseNavigationMenuGroupReturn,
  type UseNavigationMenuProps,
  type UseNavigationMenuRootProps,
} from "./useNavigationMenu";
import {
  NavigationMenuContextProvider,
  useNavigationMenuContext,
} from "./useNavigationMenuContext";
import { NavigationMenuItemProvider } from "./useNavigationMenuItemContext";
import {
  NavigationMenuRootProvider,
  useNavigationMenuRootContext,
} from "./useNavigationMenuRootContext";

export interface NavigationMenuProviderProps extends UseNavigationMenuProps {
  children?: React.ReactNode;
}

/**
 * Coordinates a set of hover-disclosure menus: tracks which one is open and
 * wraps them in a shared hover delay group, so once one flyout is open the
 * others (and any `HelpBubbleTooltip`s rendered alongside) open instantly while
 * the pointer moves between them. Renders no DOM of its own.
 */
export const NavigationMenuProvider = ({
  value,
  defaultValue,
  onValueChange,
  placement,
  openDelay,
  closeDelay,
  children,
}: NavigationMenuProviderProps) => {
  const api = useNavigationMenu({
    value,
    defaultValue,
    onValueChange,
    placement,
    openDelay,
    closeDelay,
  });

  return (
    <NextFloatingDelayGroup
      delay={{ open: openDelay ?? DEFAULT_OPEN_DELAY, close: closeDelay ?? DEFAULT_CLOSE_DELAY }}
    >
      <NavigationMenuContextProvider value={api}>{children}</NavigationMenuContextProvider>
    </NextFloatingDelayGroup>
  );
};

export interface NavigationMenuRootProps extends UseNavigationMenuRootProps {
  children?: React.ReactNode;
}

/**
 * One disclosure menu (a trigger plus its flyout) within a
 * `NavigationMenuProvider`. Renders no DOM of its own.
 */
export const NavigationMenuRoot = ({
  value,
  disabled,
  placement,
  gutter,
  overflowPadding,
  strategy,
  children,
}: NavigationMenuRootProps) => {
  const provider = useNavigationMenuContext();
  const api = useNavigationMenuRoot(provider, {
    value,
    disabled,
    placement,
    gutter,
    overflowPadding,
    strategy,
  });

  return <NavigationMenuRootProvider value={api}>{children}</NavigationMenuRootProvider>;
};

export interface NavigationMenuTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  (props, ref) => {
    const api = useNavigationMenuRootContext();

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
    const api = useNavigationMenuRootContext();

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
    const { floatingContext, contentProps, focusManaged } = useNavigationMenuRootContext();

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

const NavigationMenuGroupContext = createContext<UseNavigationMenuGroupReturn | null>(null);

export interface NavigationMenuGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuGroup = forwardRef<HTMLDivElement, NavigationMenuGroupProps>(
  (props, ref) => {
    const group = useNavigationMenuGroup();

    return (
      <NavigationMenuGroupContext.Provider value={group}>
        <Primitive.div ref={ref} {...mergeProps(group.rootProps, props)} />
      </NavigationMenuGroupContext.Provider>
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
    const group = useContext(NavigationMenuGroupContext);
    if (!group) {
      throw new Error("NavigationMenuGroupLabel must be used within a NavigationMenuGroup");
    }

    return (
      <Primitive.div
        ref={composeRefs(group.refs.label, ref)}
        {...mergeProps(group.labelProps, props)}
      />
    );
  },
);
NavigationMenuGroupLabel.displayName = "NavigationMenuGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface NavigationMenuItemProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Marks this item as the current page (sets aria-current="page").
   */
  current?: boolean;
}

export const NavigationMenuItem = forwardRef<HTMLButtonElement, NavigationMenuItemProps>(
  ({ current, disabled, ...props }, ref) => {
    const { getItemProps } = useNavigationMenuRootContext();
    const api = getItemProps({ current, disabled });

    return (
      <NavigationMenuItemProvider value={api}>
        <Primitive.button ref={ref} {...mergeProps(api.rootProps, props)} />
      </NavigationMenuItemProvider>
    );
  },
);
NavigationMenuItem.displayName = "NavigationMenuItem";
