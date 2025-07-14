"use client";

import { RadioGroup as SeedRadioGroup } from "@seed-design/react";
import * as React from "react";

export interface RadioGroupProps extends SeedRadioGroup.RootProps {}

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioGroup = SeedRadioGroup.Root;

export interface RadioGroupItemProps extends SeedRadioGroup.ItemProps {
  label?: React.ReactNode;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ label, inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedRadioGroup.Item ref={rootRef} {...otherProps}>
        <SeedRadioGroup.ItemControl>
          <SeedRadioGroup.ItemIndicator
            checked={
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="currentColor" />
              </svg>
            }
          />
        </SeedRadioGroup.ItemControl>
        {label && <SeedRadioGroup.ItemLabel>{label}</SeedRadioGroup.ItemLabel>}
        <SeedRadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
      </SeedRadioGroup.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export interface RadioMarkProps extends SeedRadioGroup.ItemControlProps {}

/**
 * @see https://seed-design.io/react/components/radio-group
 */
export const RadioMark = React.forwardRef<HTMLDivElement, RadioMarkProps>((props, ref) => {
  return (
    <SeedRadioGroup.ItemControl ref={ref} {...props}>
      <SeedRadioGroup.ItemIndicator
        checked={
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
          </svg>
        }
      />
    </SeedRadioGroup.ItemControl>
  );
});
RadioMark.displayName = "RadioMark";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
