import * as React from "@lynx-js/react";
import {
  MannerTempBadge as SeedMannerTempBadge,
  type MannerTempBadgeProps as SeedMannerTempBadgeProps,
} from "@seed-design/lynx-react";
import { mannerTempToLevel } from "../lib/manner-temp-level";

export interface MannerTempBadgeProps extends Omit<SeedMannerTempBadgeProps, "children"> {
  /**
   * The manner temperature of the badge.
   * Level will be calculated based on this value.
   * If level is provided, this will be ignored.
   */
  temperature: number;
}

/**
 * @see https://seed-design.io/lynx/components/manner-temp-badge
 */
export const MannerTempBadge = React.forwardRef<unknown, MannerTempBadgeProps>(
  ({ temperature, level, ...otherProps }, ref) => {
    return (
      <SeedMannerTempBadge
        ref={ref}
        level={level ?? mannerTempToLevel(temperature)}
        {...otherProps}
      >
        {`${temperature}°C`}
      </SeedMannerTempBadge>
    );
  },
);
MannerTempBadge.displayName = "MannerTempBadge";
