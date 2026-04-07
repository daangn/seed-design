import { ProgressCircle as SeedProgressCircle } from "@ride-developer/react";
import * as React from "react";

export interface ProgressCircleProps extends SeedProgressCircle.RootProps {}

/**
 * @see https://seed-design.io/react/components/progress-circle
 */
export const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>((props, ref) => {
  return (
    <SeedProgressCircle.Root ref={ref} {...props}>
      <SeedProgressCircle.Track />
      <SeedProgressCircle.Range />
    </SeedProgressCircle.Root>
  );
});

ProgressCircle.displayName = "ProgressCircle";
