/**
 * @file ui:progress-circle
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

import {
  ProgressCircle as SeedProgressCircle,
  type ProgressCircleProps as SeedProgressCircleProps,
} from "@seed-design/lynx-react";

export interface ProgressCircleProps extends SeedProgressCircleProps {}

/**
 * @see https://seed-design.io/lynx/components/progress-circle
 */
export function ProgressCircle(props: ProgressCircleProps) {
  return (
    <SeedProgressCircle.Root {...props}>
      <SeedProgressCircle.Range />
    </SeedProgressCircle.Root>
  );
}

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
