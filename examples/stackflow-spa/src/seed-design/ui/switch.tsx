"use client";

import * as React from "react";
import { Switch as SeedSwitch } from "@seed-design/react";

export interface SwitchProps extends SeedSwitch.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  rootRef?: React.Ref<HTMLLabelElement>;

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

export interface SwitchMarkProps extends SeedSwitch.ControlProps {}

/**
 * @see https://seed-design.io/react/components/switch
 */
export const SwitchMark = React.forwardRef<HTMLDivElement, SwitchMarkProps>((props, ref) => {
  return (
    <SeedSwitch.Control ref={ref} {...props}>
      <SeedSwitch.Thumb />
    </SeedSwitch.Control>
  );
});
SwitchMark.displayName = "SwitchMark";
