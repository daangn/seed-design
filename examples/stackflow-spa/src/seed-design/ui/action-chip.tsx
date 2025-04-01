"use client";

import {
  ActionChip as SeedActionChip,
  type ActionChipProps as SeedActionChipProps,
} from "@seed-design/react";
import * as React from "react";

export interface ActionChipProps extends SeedActionChipProps {}

export const ActionChip = React.forwardRef<HTMLButtonElement, ActionChipProps>(
  ({ ...otherProps }, ref) => {
    return <SeedActionChip ref={ref} {...otherProps} />;
  },
);
ActionChip.displayName = "ActionChip";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
