import type { BreakpointThreshold, UnwrapResponsive } from "../types/responsive";
import type { StyleProps } from "./styled";

/**
 * Converts hideFrom/showFrom into a responsive display object.
 * Each component passes its own baseDisplay (e.g. "block", "flex", "grid").
 */
export function resolveDisplay(
  baseValue: UnwrapResponsive<StyleProps["display"]>,
  hideFrom?: BreakpointThreshold,
  showFrom?: BreakpointThreshold,
): StyleProps["display"] | undefined {
  if (hideFrom) return { base: baseValue, [hideFrom]: "none" };

  if (showFrom) return { base: "none", [showFrom]: baseValue };

  return undefined;
}
