"use client";

import clsx from "clsx";
import {
  MenuContent,
  type MenuContentProps,
  MenuGroup,
  type MenuGroupProps,
  MenuItem,
  type MenuItemProps,
  MenuRoot,
  type MenuRootProps,
  MenuTrigger,
  type MenuTriggerProps,
} from "@/registry/react/ui/menu";

/**
 * Retarget the SEED flyout recipe's surface var to the neutral fd-popover gray and lower its
 * s3 shadow to s2 — an element-level override shared by the docs menu and the nav-menu flyout
 * (full rationale in header/docs-nav-menu-content).
 */
export const FLYOUT_NEUTRAL_SURFACE =
  "[--seed-color-bg-layer-floating:var(--color-fd-popover)] [--seed-shadow-s3:var(--seed-shadow-s2)]";

export function DocsMenuRoot(props: MenuRootProps) {
  return <MenuRoot size="small" {...props} />;
}

export function DocsMenuTrigger(props: MenuTriggerProps) {
  return <MenuTrigger {...props} />;
}

export function DocsMenuContent({ className, ...props }: MenuContentProps) {
  return <MenuContent className={clsx(FLYOUT_NEUTRAL_SURFACE, className)} {...props} />;
}

export function DocsMenuGroup(props: MenuGroupProps) {
  return <MenuGroup {...props} />;
}

export function DocsMenuItem({ className, ...props }: MenuItemProps) {
  return <MenuItem className={clsx("cursor-pointer", className)} {...props} />;
}

export { DocsMenuTriggerButton } from "./docs-menu-trigger-button";
