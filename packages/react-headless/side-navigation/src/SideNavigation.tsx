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
  const { stateProps, rootProps } = useSideNavigationContext();

  return <Primitive.nav ref={ref} {...mergeProps(stateProps, rootProps, props)} />;
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

export interface SideNavigationItemCollapsibleRootProps
  extends UseSideNavigationCollapsibleProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationItemCollapsibleRoot = forwardRef<
  HTMLDivElement,
  SideNavigationItemCollapsibleRootProps
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
SideNavigationItemCollapsibleRoot.displayName = "SideNavigationItemCollapsibleRoot";

export interface SideNavigationItemCollapsibleTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationItemCollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  SideNavigationItemCollapsibleTriggerProps
>((props, ref) => {
  const { stateProps } = useSideNavigationContext();

  return <CollapsibleTrigger ref={ref} {...mergeProps(stateProps, props)} />;
});
SideNavigationItemCollapsibleTrigger.displayName = "SideNavigationItemCollapsibleTrigger";

export interface SideNavigationItemCollapsibleContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationItemCollapsibleContent = forwardRef<
  HTMLDivElement,
  SideNavigationItemCollapsibleContentProps
>((props, ref) => {
  const { stateProps } = useSideNavigationContext();

  return <CollapsibleContent ref={ref} {...mergeProps(stateProps, props)} />;
});
SideNavigationItemCollapsibleContent.displayName = "SideNavigationItemCollapsibleContent";
