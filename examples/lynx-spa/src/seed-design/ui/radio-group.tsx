/**
 * @file ui:radio-group
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import * as React from "@lynx-js/react";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemIndicator,
  RadioGroupItemLabel,
  RadioGroupRoot,
  type RadioGroupItemProps,
  type RadioGroupRootProps,
} from "@seed-design/lynx-react";

export interface RadioGroupProps extends RadioGroupRootProps {}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const RadioGroup = React.forwardRef<unknown, RadioGroupProps>(
  ({ children, ...otherProps }, ref) => {
    return (
      <RadioGroupRoot ref={ref} {...otherProps}>
        {children}
      </RadioGroupRoot>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

export interface RadioProps extends RadioGroupItemProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/radio-group
 */
export const Radio = React.forwardRef<unknown, RadioProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <RadioGroupItem ref={ref} {...otherProps}>
        <RadioGroupItemControl>
          <RadioGroupItemIndicator />
        </RadioGroupItemControl>
        {label != null ? <RadioGroupItemLabel>{label}</RadioGroupItemLabel> : null}
        {children}
      </RadioGroupItem>
    );
  },
);
Radio.displayName = "Radio";

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
