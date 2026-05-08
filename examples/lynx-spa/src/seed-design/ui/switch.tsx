/**
 * @file ui:switch
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import * as React from '@lynx-js/react';
import {
  SwitchControl,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  type SwitchRootProps,
} from '@seed-design/lynx-react';

export interface SwitchProps extends SwitchRootProps {
  label?: React.ReactNode;
}

/**
 * @see https://seed-design.io/lynx/components/switch
 */
export const Switch = React.forwardRef<unknown, SwitchProps>(
  ({ label, children, ...otherProps }, ref) => {
    return (
      <SwitchRoot ref={ref} {...otherProps}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        {label != null ? <SwitchLabel>{label}</SwitchLabel> : null}
        {children}
      </SwitchRoot>
    );
  },
);
Switch.displayName = 'Switch';

export interface SwitchmarkProps extends Omit<SwitchRootProps, 'children'> {}

/**
 * @see https://seed-design.io/lynx/components/switch
 */
export const Switchmark = React.forwardRef<unknown, SwitchmarkProps>(
  (props, ref) => {
    return (
      <SwitchRoot ref={ref} {...props}>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </SwitchRoot>
    );
  },
);
Switchmark.displayName = 'Switchmark';

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
