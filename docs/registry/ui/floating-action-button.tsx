"use client";

import { FloatingActionButton as SeedFloatingActionButton } from "@seed-design/react";
import * as React from "react";

export interface FloatingActionButtonProps
  extends Omit<SeedFloatingActionButton.RootProps, "children"> {
  icon: React.ReactNode;

  label: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/fab
 */
export const FloatingActionButton = React.forwardRef<
  React.ElementRef<typeof SeedFloatingActionButton.Root>,
  FloatingActionButtonProps
>(({ icon, label, ...otherProps }, ref) => {
  return (
    <SeedFloatingActionButton.Root ref={ref} {...otherProps}>
      <SeedFloatingActionButton.Icon svg={icon} />
      <SeedFloatingActionButton.Label>{label}</SeedFloatingActionButton.Label>
    </SeedFloatingActionButton.Root>
  );
});
FloatingActionButton.displayName = "FloatingActionButton";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
