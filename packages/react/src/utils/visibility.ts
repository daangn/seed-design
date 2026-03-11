import type { BreakpointThreshold, ResponsiveValue } from "../types/responsive";

/**
 * Creates a responsive value that switches at a breakpoint threshold.
 * Returns `baseValue` below the threshold and `thresholdValue` from it.
 */
export function resolveThreshold<T>(
  baseValue: T,
  thresholdValue: T,
  from?: BreakpointThreshold,
): ResponsiveValue<T> | undefined {
  if (!from) return undefined;
  return { base: baseValue, [from]: thresholdValue };
}
