"use client";

import {
  Celcius,
  MannerTempEmote,
  MannerTemp as SeedMannerTemp,
  SuffixIcon,
  type MannerTempProps as SeedMannerTempProps,
} from "@seed-design/react";
import * as React from "react";
import { mannerTempToLevel } from "../lib/manner-temp-level";

export interface MannerTempProps
  extends Omit<SeedMannerTempProps, "children" | "asChild"> {
  /**
   * The manner temperature of the MannerTemp component.
   * Level will be calculated based on this value.
   * If level is provided, this will be ignored.
   */
  temperature: number;
}

export const MannerTemp = React.forwardRef<HTMLSpanElement, MannerTempProps>(
  ({ temperature, level, ...otherProps }, ref) => {
    return (
      <SeedMannerTemp
        ref={ref}
        level={level ?? mannerTempToLevel(temperature)}
        {...otherProps}
      >
        <Celcius value={temperature} />
        <SuffixIcon svg={<MannerTempEmote />} />
      </SeedMannerTemp>
    );
  },
);
MannerTemp.displayName = "MannerTemp";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
