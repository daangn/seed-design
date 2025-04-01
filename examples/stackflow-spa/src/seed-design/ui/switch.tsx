"use client";

import * as React from "react";
import { Switch as SeedSwitch } from "@seed-design/react";

export interface SwitchProps extends SeedSwitch.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ inputProps, rootRef, ...otherProps }, ref) => {
    return (
      <SeedSwitch.Root ref={rootRef} {...otherProps}>
        <SeedSwitch.Control>
          <SeedSwitch.Thumb />
        </SeedSwitch.Control>
        <SeedSwitch.HiddenInput ref={ref} {...inputProps} />
      </SeedSwitch.Root>
    );
  },
);
Switch.displayName = "Switch";
