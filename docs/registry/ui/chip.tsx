"use client";

import type { ChipVariantProps } from "@seed-design/css/recipes/chip";
import { Chip as SeedChip } from "@seed-design/react";
import type { PrimitiveProps } from "@seed-design/react-primitive";
import { Checkbox, RadioGroup } from "@seed-design/react/primitive";
import { chip } from "@seed-design/css/recipes/chip";
import * as React from "react";

// Create a base props interface that doesn't include DOM attributes to avoid conflicts
export interface ChipBaseProps extends PrimitiveProps, ChipVariantProps {}

export interface ToggleChipProps extends ChipBaseProps, Checkbox.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ToggleChip = React.forwardRef<HTMLInputElement, ToggleChipProps>(
  ({ children, inputProps, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = chip.splitVariantProps(props);

    return (
      <SeedChip.Root asChild {...variantProps}>
        <Checkbox.Root ref={rootRef} {...otherProps}>
          {children}
          <Checkbox.HiddenInput ref={ref} {...inputProps} />
        </Checkbox.Root>
      </SeedChip.Root>
    );
  },
);
ToggleChip.displayName = "Chip.Toggle";

export interface ButtonChipProps extends ChipBaseProps, SeedChip.RootProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ButtonChip = SeedChip.Root;

export interface RadioChipRootProps extends RadioGroup.RootProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const RadioChipRoot = RadioGroup.Root;

export interface RadioChipItemProps extends ChipBaseProps, RadioGroup.ItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const RadioChipItem = React.forwardRef<HTMLInputElement, RadioChipItemProps>(
  ({ children, inputProps, rootRef, ...props }, ref) => {
    const [variantProps, otherProps] = chip.splitVariantProps(props);

    return (
      <SeedChip.Root asChild {...variantProps}>
        <RadioGroup.Item ref={rootRef} {...otherProps}>
          {children}
          <RadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
        </RadioGroup.Item>
      </SeedChip.Root>
    );
  },
);
RadioChipItem.displayName = "Chip.RadioItem";

export interface ChipLabelProps extends SeedChip.LabelProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ChipLabel = SeedChip.Label;

export interface ChipPrefixIconProps extends SeedChip.PrefixIconProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ChipPrefixIcon = SeedChip.PrefixIcon;

export interface ChipPrefixAvatarProps extends SeedChip.PrefixAvatarProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ChipPrefixAvatar = SeedChip.PrefixAvatar;

export interface ChipSuffixIconProps extends SeedChip.SuffixIconProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ChipSuffixIcon = SeedChip.SuffixIcon;

/**
 * @see https://seed-design.io/react/components/chip
 */
export const Chip = Object.assign(
  () => {
    console.warn(
      "Chip is a base component and should not be rendered. Use Chip.Toggle or Chip.Button instead.",
    );
  },
  {
    Toggle: ToggleChip,
    Button: ButtonChip,
    RadioRoot: RadioChipRoot,
    RadioItem: RadioChipItem,
    Label: ChipLabel,
    PrefixIcon: ChipPrefixIcon,
    PrefixAvatar: ChipPrefixAvatar,
    SuffixIcon: ChipSuffixIcon,
  },
);

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
