"use client";

import {
  ControlChip as SeedControlChip,
  type ControlChipBaseProps as SeedControlChipBaseProps,
  type ControlChipProps as SeedControlChipProps,
} from "@seed-design/react";
import { Checkbox, RadioGroup } from "@seed-design/react/primitive";
import * as React from "react";

export interface ToggleControlChipProps extends SeedControlChipBaseProps, Checkbox.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

export const ToggleControlChip = React.forwardRef<HTMLInputElement, ToggleControlChipProps>(
  ({ children, size, layout = "withText", inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedControlChip asChild size={size} layout={layout}>
        <Checkbox.Root ref={rootRef} {...otherProps}>
          {children}
          <Checkbox.HiddenInput ref={ref} {...inputProps} />
        </Checkbox.Root>
      </SeedControlChip>
    );
  },
);
ToggleControlChip.displayName = "ControlChip.Toggle";

export interface ButtonControlChipProps extends SeedControlChipProps {}

export const ButtonControlChip = React.forwardRef<HTMLButtonElement, ButtonControlChipProps>(
  ({ children, ...otherProps }, ref) => {
    return (
      <SeedControlChip ref={ref} {...otherProps}>
        {children}
      </SeedControlChip>
    );
  },
);
ButtonControlChip.displayName = "ControlChip.Button";

export interface RadioControlChipRootProps extends RadioGroup.RootProps {}

export const RadioControlChipRoot = RadioGroup.Root;

export interface RadioControlChipItemProps extends SeedControlChipBaseProps, RadioGroup.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

export const RadioControlChipItem = React.forwardRef<HTMLInputElement, RadioControlChipItemProps>(
  ({ children, inputProps, rootRef, size, layout = "withText", ...otherProps }, ref) => {
    return (
      <SeedControlChip asChild size={size} layout={layout}>
        <RadioGroup.Item ref={rootRef} {...otherProps}>
          {children}
          <RadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        </RadioGroup.Item>
      </SeedControlChip>
    );
  },
);
RadioControlChipItem.displayName = "ControlChip.RadioItem";

export const ControlChip = Object.assign(
  () => {
    console.warn(
      "ControlChip is a base component and should not be rendered. Use ControlChip.Toggle or ControlChip.Button instead.",
    );
  },
  {
    Toggle: ToggleControlChip,
    Button: ButtonControlChip,
    RadioRoot: RadioControlChipRoot,
    RadioItem: RadioControlChipItem,
  },
);

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
