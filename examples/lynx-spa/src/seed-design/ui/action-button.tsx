/**
 * @file ui:action-button
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import * as React from '@lynx-js/react';
import {
  ActionButton as SeedActionButton,
  type ActionButtonProps as SeedActionButtonProps,
} from '@seed-design/lynx-react';

export interface ActionButtonProps extends SeedActionButtonProps {}

/**
 * @see https://seed-design.io/lynx/components/action-button
 */
export const ActionButton = React.forwardRef<
  React.ElementRef<typeof SeedActionButton>,
  ActionButtonProps
>((props, ref) => {
  return <SeedActionButton ref={ref} {...props} />;
});
ActionButton.displayName = 'ActionButton';

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
