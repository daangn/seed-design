"use client";

import {
  CollapsibleContent,
  CollapsibleProvider,
  CollapsibleTrigger,
} from "@seed-design/react-collapsible";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef } from "react";
import type { UseSideNavigationProps } from "./useSideNavigation";
import { useSideNavigation } from "./useSideNavigation";
import {
  SideNavigationProvider as Provider,
  useSideNavigationContext,
} from "./useSideNavigationContext";
import type { UseSideNavigationCollapsibleProps } from "./useSideNavigationCollapsible";
import { useSideNavigationCollapsible } from "./useSideNavigationCollapsible";

export interface SideNavigationProviderProps extends UseSideNavigationProps {
  children: React.ReactNode;
}

export function SideNavigationProvider(props: SideNavigationProviderProps) {
  const { collapsed, defaultCollapsed, onCollapsedChange, children } = props;

  const api = useSideNavigation({
    collapsed,
    defaultCollapsed,
    onCollapsedChange,
  });

  return <Provider value={api}>{children}</Provider>;
}
SideNavigationProvider.displayName = "SideNavigationProvider";

export interface SideNavigationRootProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLElement> {}

export const SideNavigationRoot = forwardRef<HTMLElement, SideNavigationRootProps>((props, ref) => {
  const { stateProps } = useSideNavigationContext();

  return <Primitive.nav ref={ref} {...mergeProps(stateProps, props)} />;
});
SideNavigationRoot.displayName = "SideNavigationRoot";

export interface SideNavigationTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationTrigger = forwardRef<HTMLButtonElement, SideNavigationTriggerProps>(
  (props, ref) => {
    const { triggerProps } = useSideNavigationContext();

    return <Primitive.button ref={ref} {...mergeProps(triggerProps, props)} />;
  },
);
SideNavigationTrigger.displayName = "SideNavigationTrigger";

export interface SideNavigationMenuItemCollapsibleRootProps
  extends UseSideNavigationCollapsibleProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationMenuItemCollapsibleRoot = forwardRef<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleRootProps
>((props, ref) => {
  const { open, defaultOpen, onOpenChange, disabled, ...otherProps } = props;

  const api = useSideNavigationCollapsible({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
  });

  return (
    <CollapsibleProvider value={api}>
      <Primitive.div ref={ref} {...mergeProps(api.stateProps, otherProps)} />
    </CollapsibleProvider>
  );
});
SideNavigationMenuItemCollapsibleRoot.displayName = "SideNavigationMenuItemCollapsibleRoot";

export interface SideNavigationMenuItemCollapsibleTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItemCollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleTriggerProps
>((props, ref) => {
  const { stateProps } = useSideNavigationContext();

  return <CollapsibleTrigger ref={ref} {...mergeProps(stateProps, props)} />;
});
SideNavigationMenuItemCollapsibleTrigger.displayName = "SideNavigationMenuItemCollapsibleTrigger";

export interface SideNavigationMenuItemCollapsibleContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationMenuItemCollapsibleContent = forwardRef<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleContentProps
>((props, ref) => {
  const { stateProps } = useSideNavigationContext();

  return <CollapsibleContent ref={ref} {...mergeProps(stateProps, props)} />;
});
SideNavigationMenuItemCollapsibleContent.displayName = "SideNavigationMenuItemCollapsibleContent";
