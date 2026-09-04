import * as React from "@lynx-js/react";
import {
  NotificationBadge,
  NotificationBadgePositioner,
  SegmentedControl as SeedSegmentedControl,
} from "@seed-design/lynx-react";

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

export interface SegmentedControlItemProps
  extends Omit<SeedSegmentedControl.ItemProps, "notification"> {
  notification?: boolean;
}

/**
 * @see https://seed-design.io/lynx/components/segmented-control#segmentedcontrolitem
 */
export const SegmentedControlItem = React.forwardRef<unknown, SegmentedControlItemProps>(
  ({ children, notification, ...otherProps }, ref) => {
    return (
      <SeedSegmentedControl.Item
        ref={ref}
        {...otherProps}
        notification={
          notification ? (
            <NotificationBadgePositioner size="small" attach="text">
              <NotificationBadge />
            </NotificationBadgePositioner>
          ) : undefined
        }
      >
        {children}
      </SeedSegmentedControl.Item>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";
