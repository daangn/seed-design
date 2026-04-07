"use client";

import {
  Celsius,
  MannerTempEmote,
  MannerTemp as SeedMannerTemp,
  SuffixIcon,
  type MannerTempProps as SeedMannerTempProps,
} from "@ride-developer/react";
import * as React from "react";
import { mannerTempToLevel } from "../lib/manner-temp-level";

export interface MannerTempProps extends Omit<SeedMannerTempProps, "children" | "asChild"> {
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
      <SeedMannerTemp ref={ref} level={level ?? mannerTempToLevel(temperature)} {...otherProps}>
        <Celsius value={temperature} />
        <SuffixIcon svg={<MannerTempEmote />} />
      </SeedMannerTemp>
    );
  },
);
MannerTemp.displayName = "MannerTemp";
