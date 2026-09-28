import { Chip as SeedChip, Checkbox, RadioGroup } from "@seed-design/react";
import * as React from "react";

// Create a base props interface that doesn't include DOM attributes to avoid conflicts
export interface ChipBaseProps
  extends Omit<SeedChip.RootProps, keyof React.ButtonHTMLAttributes<HTMLButtonElement>> {}

export interface ToggleChipProps extends SeedChip.ToggleProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ToggleChip = React.forwardRef<HTMLInputElement, ToggleChipProps>(
  ({ children, inputProps, rootRef, ...props }, ref) => (
    <SeedChip.Toggle ref={rootRef} {...props}>
      {children}
      <Checkbox.HiddenInput ref={ref} {...inputProps} />
    </SeedChip.Toggle>
  ),
);
ToggleChip.displayName = "Chip.Toggle";

export interface ButtonChipProps extends ChipBaseProps, SeedChip.RootProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const ButtonChip = SeedChip.Root;

export interface RadioChipRootProps extends SeedChip.RadioRootProps {}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const RadioChipRoot = SeedChip.RadioRoot;

export interface RadioChipItemProps extends SeedChip.RadioItemProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;
}

/**
 * @see https://seed-design.io/react/components/chip
 */
export const RadioChipItem = React.forwardRef<HTMLInputElement, RadioChipItemProps>(
  ({ children, inputProps, rootRef, ...props }, ref) => (
    <SeedChip.RadioItem ref={rootRef} {...props}>
      {children}
      <RadioGroup.ItemHiddenInput ref={ref} {...inputProps} />
    </SeedChip.RadioItem>
  ),
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
