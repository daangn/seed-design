"use client";

import {
  ToggleButton as SeedToggleButton,
  type ToggleButtonProps as SeedToggleButtonProps,
} from "@seed-design/react";
import * as React from "react";
import { LoadingIndicator } from "./loading-indicator";

export interface ToggleButtonProps extends SeedToggleButtonProps {}

/**
 * @see https://seed-design.io/docs/react/components/toggle-button
 * If `asChild` is enabled, manual handling of `LoadingIndicator` is required.
 */
export const ToggleButton = React.forwardRef<
  React.ElementRef<typeof SeedToggleButton>,
  ToggleButtonProps
>(({ loading = false, children, ...otherProps }, ref) => {
  return (
    <SeedToggleButton ref={ref} loading={loading} {...otherProps}>
      {loading && !otherProps.asChild ? (
        <LoadingIndicator>{children}</LoadingIndicator>
      ) : (
        children
      )}
    </SeedToggleButton>
  );
});
ToggleButton.displayName = "ToggleButton";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
