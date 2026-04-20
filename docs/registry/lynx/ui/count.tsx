import { Count as SeedCount, type CountProps as SeedCountProps } from "@seed-design/lynx-react";

export interface CountProps extends SeedCountProps {}

/**
 * @see https://seed-design.io/lynx/components/count
 */
export function Count(props: CountProps) {
  return <SeedCount {...props} />;
}
