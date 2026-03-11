import type { BreakpointThreshold, ResponsiveValue, UnwrapResponsive } from "../types/responsive";
import type { StyleProps } from "./styled";

function resolveThreshold<const T, const U>({
  base,
  alternate,
  above,
  below,
}: {
  base: T;
  alternate: U;
  above?: BreakpointThreshold;
  below?: BreakpointThreshold;
}): ResponsiveValue<T | U> | undefined {
  if (above) return { base, [above]: alternate };
  if (below) return { base: alternate, [below]: base };
  return undefined;
}

interface ResolveDisplayOptions<T> {
  base: T;
  /** Hide (display: none) from this breakpoint and above */
  hideFrom?: BreakpointThreshold;
  /** Show from this breakpoint and above (display: none below) */
  showFrom?: BreakpointThreshold;
}

/**
 * Creates a responsive display value for visibility control.
 * If both hideFrom and showFrom are provided, hideFrom takes precedence.
 */
export function resolveDisplay<const T extends UnwrapResponsive<StyleProps["display"]>>({
  base,
  hideFrom,
  showFrom,
}: ResolveDisplayOptions<T>) {
  return resolveThreshold({ base, alternate: "none", above: hideFrom, below: showFrom });
}
