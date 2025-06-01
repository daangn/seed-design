"use client";

import { Fab as SeedFab } from "@seed-design/react";
import * as React from "react";

export interface FabProps extends Omit<SeedFab.RootProps, "children"> {
  icon: React.ReactNode;

  label: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/fab
 */
export const Fab = React.forwardRef<
  React.ElementRef<typeof SeedFab.Root>,
  FabProps
>(({ icon, label, ...otherProps }, ref) => {
  return (
    <SeedFab.Root ref={ref} {...otherProps}>
      <SeedFab.Icon svg={icon} />
      <SeedFab.Label>{label}</SeedFab.Label>
    </SeedFab.Root>
  );
});
Fab.displayName = "Fab";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
