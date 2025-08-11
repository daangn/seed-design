"use client";

import * as React from "react";
import { Switch as SeedSwitch } from "@seed-design/react";

export interface SwitchProps extends SeedSwitch.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

  /**
   * label is supported in small size only currently.
   */
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/switch
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ inputProps, rootRef, label, ...otherProps }, ref) => {
    return (
      <SeedSwitch.Root ref={rootRef} {...otherProps}>
        <SeedSwitch.Control>
          <SeedSwitch.Thumb />
        </SeedSwitch.Control>
        {label && <SeedSwitch.Label>{label}</SeedSwitch.Label>}
        <SeedSwitch.HiddenInput ref={ref} {...inputProps} />
      </SeedSwitch.Root>
    );
  },
);
Switch.displayName = "Switch";
