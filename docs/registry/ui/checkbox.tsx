"use client";

import IconCheckmarkFatFill from "@daangn/react-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@daangn/react-monochrome-icon/IconMinusFatFill";
import { Checkbox as SeedCheckbox } from "@seed-design/react";
import * as React from "react";

export interface CheckboxProps extends SeedCheckbox.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/docs/react/components/checkbox
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ inputProps, rootRef, label, variant = "square", ...otherProps }, ref) => {
    return (
      <SeedCheckbox.Root ref={rootRef} variant={variant} {...otherProps}>
        <SeedCheckbox.Control>
          <SeedCheckbox.Indicator
            unchecked={variant === "ghost" ? <IconCheckmarkFatFill /> : null}
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
