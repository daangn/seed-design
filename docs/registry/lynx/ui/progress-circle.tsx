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
