/**
 * @file ui:checkbox
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import * as React from "@lynx-js/react";
import IconCheckmarkFatFill from "@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill";
import IconMinusFatFill from "@karrotmarket/lynx-monochrome-icon/IconMinusFatFill";
import { Checkbox as SeedCheckbox } from "@seed-design/lynx-react";

export interface CheckboxProps extends SeedCheckbox.RootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkbox = React.forwardRef<unknown, CheckboxProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <SeedCheckbox.Root ref={ref} {...otherProps}>
        <SeedCheckbox.Control>
          <SeedCheckbox.Indicator
            unchecked={<IconCheckmarkFatFill />}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </SeedCheckbox.Control>
        {label != null ? <SeedCheckbox.Label>{label}</SeedCheckbox.Label> : null}
        {children}
      </SeedCheckbox.Root>
    );
  },
);
Checkbox.displayName = "Checkbox";

export interface CheckmarkProps extends Omit<SeedCheckbox.RootProps, "children"> {}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkmark = React.forwardRef<unknown, CheckmarkProps>((props, ref) => {
  return (
    <SeedCheckbox.Root ref={ref} {...props}>
      <SeedCheckbox.Control>
        <SeedCheckbox.Indicator
          checked={<IconCheckmarkFatFill />}
          indeterminate={<IconMinusFatFill />}
        />
      </SeedCheckbox.Control>
    </SeedCheckbox.Root>
  );
});
Checkmark.displayName = "Checkmark";

export const CheckboxGroup = SeedCheckbox.Group;
export type CheckboxGroupProps = SeedCheckbox.GroupProps;

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
