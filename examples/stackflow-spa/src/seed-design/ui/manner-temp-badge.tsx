"use client";

import {
  Celcius,
  MannerTempBadge as SeedMannerTempBadge,
  type MannerTempBadgeProps as SeedMannerTempBadgeProps,
} from "@seed-design/react";
import * as React from "react";
import { mannerTempToLevel } from "../lib/manner-temp-level";

export interface MannerTempBadgeProps
  extends Omit<SeedMannerTempBadgeProps, "children" | "asChild"> {
  /**
   * The manner temperature of the badge.
   * Level will be calculated based on this value.
   * If level is provided, this will be ignored.
   */
  temperature: number;
}

export const MannerTempBadge = React.forwardRef<
  HTMLSpanElement,
  MannerTempBadgeProps
>(({ temperature, level, ...otherProps }, ref) => {
  return (
    <SeedMannerTempBadge
      ref={ref}
      level={level ?? mannerTempToLevel(temperature)}
      {...otherProps}
    >
      <Celcius value={temperature} />
    </SeedMannerTempBadge>
  );
});
MannerTempBadge.displayName = "MannerTempBadge";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
