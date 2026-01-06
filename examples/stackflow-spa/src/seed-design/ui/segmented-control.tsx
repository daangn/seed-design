import { HStack, SegmentedControl as SeedSegmentedControl } from "@seed-design/react";
import { NotificationBadgePositioner, NotificationBadge } from "@seed-design/react";
import * as React from "react";

export interface SegmentedControlProps extends SeedSegmentedControl.RootProps {}

/**
 * @see https://seed-design.io/react/components/segmented-control
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ children, ...otherProps }, ref) => {
    if (!otherProps["aria-label"] && !otherProps["aria-labelledby"]) {
      console.warn(
        "SegmentedControl component requires either an `aria-label` or `aria-labelledby` attribute.",
      );
    }

    if (otherProps.value === undefined && otherProps.defaultValue === undefined) {
      console.warn(
        "SegmentedControl component requires either a `value` or `defaultValue` attribute.",
      );
    }

    return (
      <SeedSegmentedControl.Root ref={ref} {...otherProps}>
        {children}
        <SeedSegmentedControl.Indicator />
      </SeedSegmentedControl.Root>
    );
  },
);
SegmentedControl.displayName = "SegmentedControl";

export interface SegmentedControlItemProps extends SeedSegmentedControl.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  notification?: boolean;
}

/**
 * @see https://seed-design.io/react/components/segmented-control#segmentedcontrolitem
 */
export const SegmentedControlItem = React.forwardRef<HTMLInputElement, SegmentedControlItemProps>(
  ({ children, inputProps, rootRef, notification, ...otherProps }, ref) => {
    return (
      <SeedSegmentedControl.Item ref={rootRef} {...otherProps}>
        <SeedSegmentedControl.ItemHiddenInput ref={ref} {...inputProps} />
        {notification ? (
          <HStack position="relative" align="flex-start">
            {children}
            <NotificationBadgePositioner size="small" attach="text">
              <NotificationBadge />
            </NotificationBadgePositioner>
          </HStack>
        ) : (
          children
        )}
      </SeedSegmentedControl.Item>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";
