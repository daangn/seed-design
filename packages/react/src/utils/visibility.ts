import type { BreakpointThreshold } from "../types/responsive";

/**
 * Converts hideFrom/showFrom into a responsive display object.
 * Each component passes its own baseDisplay (e.g. "block", "flex", "grid").
 */
export function resolveVisibility(
  baseDisplay: string,
  hideFrom?: BreakpointThreshold,
  showFrom?: BreakpointThreshold,
): string | Record<string, string> | undefined {
  if (hideFrom) {
    return { base: baseDisplay, [hideFrom]: "none" };
  }
  if (showFrom) {
    return { base: "none", [showFrom]: baseDisplay };
  }
  return undefined;
}
