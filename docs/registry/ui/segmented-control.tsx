"use client";

import {
  ConsistentWidth,
  SegmentedControl as SeedSegmentedControl,
} from "@seed-design/react";
import * as React from "react";

export interface SegmentedControlProps extends SeedSegmentedControl.RootProps {}

/**
 * @see https://seed-design.io/docs/react/components/segmented-control
 */
export const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(({ children, ...otherProps }, ref) => {
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
});
SegmentedControl.displayName = "SegmentedControl";

export interface SegmentedControlItemProps
  extends SeedSegmentedControl.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  /**
   * The label of the item.
   * Type is restricted to string for consistent width between font-weight changes.
   * If you need to render a React element, use each element separately.
   */
  children: string;
}

/**
 * @see https://seed-design.io/docs/react/components/segmented-control#segmentedcontrolitem
 */
export const SegmentedControlItem = React.forwardRef<
  HTMLInputElement,
  SegmentedControlItemProps
>(({ children, inputProps, rootRef, ...otherProps }, ref) => {
  return (
    <SeedSegmentedControl.Item ref={rootRef} {...otherProps}>
      <SeedSegmentedControl.ItemHiddenInput ref={ref} {...inputProps} />
      <ConsistentWidth>{children}</ConsistentWidth>
    </SeedSegmentedControl.Item>
  );
});
SegmentedControlItem.displayName = "SegmentedControlItem";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
