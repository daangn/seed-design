"use client";

import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import React, { createContext, forwardRef, useContext } from "react";
import {
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

export interface NavigationMenuRootProps extends UseNavigationMenuProps {
  children?: React.ReactNode;
}

export const NavigationMenuRoot = ({
  value,
  defaultValue,
  onValueChange,
  orientation,
  openDelay,
  closeDelay,
  disableHoverTrigger,
  disableClickTrigger,
  children,
}: NavigationMenuRootProps) => {
  const api = useNavigationMenu({
    value,
    defaultValue,
    onValueChange,
    orientation,
    openDelay,
    closeDelay,
    disableHoverTrigger,
    disableClickTrigger,
  });

  return <NavigationMenuProvider value={api}>{children}</NavigationMenuProvider>;
};

export interface NavigationMenuListProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuList = forwardRef<HTMLDivElement, NavigationMenuListProps>(
  (props, ref) => {
    const { orientation } = useNavigationMenuContext();

    return <Primitive.div ref={ref} data-orientation={orientation} {...props} />;
  },
);
NavigationMenuList.displayName = "NavigationMenuList";

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
