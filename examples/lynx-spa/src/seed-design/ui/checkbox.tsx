/**
 * @file ui:checkbox
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import * as React from '@lynx-js/react';
import IconCheckmarkFatFill from '@karrotmarket/lynx-monochrome-icon/IconCheckmarkFatFill';
import IconMinusFatFill from '@karrotmarket/lynx-monochrome-icon/IconMinusFatFill';
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  type CheckboxGroupProps,
  type CheckboxRootProps,
} from '@seed-design/lynx-react';

export interface CheckboxProps extends CheckboxRootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkbox = React.forwardRef<unknown, CheckboxProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <CheckboxRoot ref={ref} {...otherProps}>
        <CheckboxControl>
          <CheckboxIndicator
            unchecked={otherProps.variant === 'ghost' ? <IconCheckmarkFatFill /> : undefined}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </CheckboxControl>
        {label != null ? <CheckboxLabel>{label}</CheckboxLabel> : null}
        {children}
      </CheckboxRoot>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export interface CheckmarkProps extends Omit<CheckboxRootProps, 'children'> {}

/**
 * @see https://seed-design.io/lynx/components/checkbox
 */
export const Checkmark = React.forwardRef<unknown, CheckmarkProps>(
  (props, ref) => {
    return (
      <CheckboxRoot ref={ref} {...props}>
        <CheckboxControl>
          <CheckboxIndicator
            unchecked={props.variant === 'ghost' ? <IconCheckmarkFatFill /> : undefined}
            checked={<IconCheckmarkFatFill />}
            indeterminate={<IconMinusFatFill />}
          />
        </CheckboxControl>
      </CheckboxRoot>
    );
  },
);
Checkmark.displayName = 'Checkmark';

export { CheckboxGroup };
export type { CheckboxGroupProps };

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
