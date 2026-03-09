import type { Breakpoint } from "@seed-design/css/breakpoints";

export type ResponsiveValue<T> = T | { [K in Breakpoint]?: T };

export function isResponsiveObject<T>(
  value: ResponsiveValue<T>,
): value is { [K in Breakpoint]?: T } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
