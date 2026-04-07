"use client";

import {
  ControlChip as SeedControlChip,
  type ControlChipBaseProps as SeedControlChipBaseProps,
  type ControlChipProps as SeedControlChipProps,
} from "@ride-developer/react";
import { Checkbox, RadioGroup } from "@ride-developer/react/primitive";
import * as React from "react";

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 */
export interface ToggleControlChipProps extends SeedControlChipBaseProps, Checkbox.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 * @see https://v3.seed-design.io/react/components/control-chip
 */
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

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 */
export interface ButtonControlChipProps extends SeedControlChipProps {}

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 * @see https://v3.seed-design.io/react/components/control-chip
 */
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

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 */
export interface RadioControlChipRootProps extends RadioGroup.RootProps {}

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 * @see https://v3.seed-design.io/react/components/control-chip
 */
export const RadioControlChipRoot = RadioGroup.Root;

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 */
export interface RadioControlChipItemProps extends SeedControlChipBaseProps, RadioGroup.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 */
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

/**
 * @deprecated Use Chip.Toggle or Chip.Button instead.
 * @see https://v3.seed-design.io/react/components/control-chip
 */
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
