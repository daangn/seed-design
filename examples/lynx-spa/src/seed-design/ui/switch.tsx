/**
 * @file ui:switch
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import * as React from "@lynx-js/react";
import { Switch as SeedSwitch } from "@seed-design/lynx-react";

export interface SwitchProps extends SeedSwitch.RootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/switch
 */
export const Switch = React.forwardRef<unknown, SwitchProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <SeedSwitch.Root ref={ref} {...otherProps}>
        <SeedSwitch.Control>
          <SeedSwitch.Thumb />
        </SeedSwitch.Control>
        {label != null ? <SeedSwitch.Label>{label}</SeedSwitch.Label> : null}
        {children}
      </SeedSwitch.Root>
    );
  },
);
Switch.displayName = "Switch";

export interface SwitchmarkProps extends Omit<SeedSwitch.RootProps, "children"> {}

/**
 * @see https://seed-design.io/lynx/components/switch
 */
export const Switchmark = React.forwardRef<unknown, SwitchmarkProps>((props, ref) => {
  return (
    <SeedSwitch.Root ref={ref} {...props}>
      <SeedSwitch.Control>
        <SeedSwitch.Thumb />
      </SeedSwitch.Control>
    </SeedSwitch.Root>
  );
});
Switchmark.displayName = "Switchmark";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
