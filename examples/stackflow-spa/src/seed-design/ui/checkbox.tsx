"use client";

import IconCheckmarkFatFill from "@karrotmarket/react-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/react-monochrome-icon/IconMinusFatFill";
import { Checkbox as SeedCheckbox } from "@seed-design/react";
import * as React from "react";

export interface CheckboxProps extends SeedCheckbox.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/checkbox
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ inputProps, rootRef, label, ...otherProps }, ref) => {
    return (
      <SeedCheckbox.Root ref={rootRef} {...otherProps}>
        <SeedCheckbox.Control>
          <SeedCheckbox.Indicator
            unchecked={otherProps.variant === "ghost" ? <IconCheckmarkFatFill /> : null}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </SeedCheckbox.Control>
        <SeedCheckbox.Label>{label}</SeedCheckbox.Label>
        <SeedCheckbox.HiddenInput ref={ref} {...inputProps} />
      </SeedCheckbox.Root>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckmarkProps extends SeedCheckbox.ControlProps {}

export const Checkmark = React.forwardRef<HTMLDivElement, CheckmarkProps>((props, ref) => {
  return (
    <SeedCheckbox.Control ref={ref} {...props}>
      <SeedCheckbox.Indicator
        unchecked={props.variant === "ghost" ? <IconCheckmarkFatFill /> : null}
        checked={<IconCheckmarkFatFill />}
        indeterminate={<IconMinusFatFill />}
      />
    </SeedCheckbox.Control>
  );
});
Checkmark.displayName = "Checkmark";
