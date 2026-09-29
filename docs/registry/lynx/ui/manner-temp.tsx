import * as React from "@lynx-js/react";
import {
  MannerTemp as SeedMannerTemp,
  MannerTempEmote,
  type MannerTempProps as SeedMannerTempProps,
} from "@seed-design/lynx-react";
import { mannerTempToLevel } from "../lib/manner-temp-level";

export interface MannerTempProps extends Omit<SeedMannerTempProps, "children"> {
  /**
   * The manner temperature of the MannerTemp component.
   * Level will be calculated based on this value.
   * If level is provided, this will be ignored.
   */
  temperature: number;
}

/**
 * @see https://seed-design.io/lynx/components/manner-temp
 */
export const MannerTemp = React.forwardRef<unknown, MannerTempProps>(
  ({ temperature, level, ...otherProps }, ref) => {
    return (
      <SeedMannerTemp ref={ref} level={level ?? mannerTempToLevel(temperature)} {...otherProps}>
        {`${temperature}°C`}
        <MannerTempEmote />
      </SeedMannerTemp>
    );
  },
);
MannerTemp.displayName = "MannerTemp";
