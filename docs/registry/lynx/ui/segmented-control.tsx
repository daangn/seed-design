import * as React from "@lynx-js/react";
import { SegmentedControl as SeedSegmentedControl } from "@seed-design/lynx-react";

export interface SegmentedControlProps extends SeedSegmentedControl.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/segmented-control
 */
export const SegmentedControl = React.forwardRef<unknown, SegmentedControlProps>(
  ({ children, ...otherProps }, ref) => {
    return (
      <SeedSegmentedControl.Root ref={ref} {...otherProps}>
        {children}
        <SeedSegmentedControl.Indicator />
      </SeedSegmentedControl.Root>
    );
  },
);
SegmentedControl.displayName = "SegmentedControl";

export interface SegmentedControlItemProps extends SeedSegmentedControl.ItemProps {}

/**
 * @see https://seed-design.io/lynx/components/segmented-control#segmentedcontrolitem
 */
export const SegmentedControlItem = SeedSegmentedControl.Item;
