"use client";

import { clsx } from "cn";
import { PopoverContent } from "fumadocs-ui/components/ui/popover";
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
import { forwardRef, type ButtonHTMLAttributes, type ComponentPropsWithoutRef } from "react";

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

export const DocsMenuTriggerButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-r2 border-0 bg-bg-transparent-selected px-3.5 py-2 t4-medium text-fg-neutral transition-colors duration-color-transition hover:bg-bg-transparent-selected-pressed data-[open]:bg-bg-transparent-selected-pressed data-[state=open]:bg-bg-transparent-selected-pressed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:text-fg-neutral",
        className,
      )}
      {...props}
    />
  );
});
DocsMenuTriggerButton.displayName = "DocsMenuTriggerButton";

export function DocsPopoverContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof PopoverContent>) {
  return (
    <PopoverContent className={clsx("shadow-[var(--seed-shadow-s2)]!", className)} {...props} />
  );
}
