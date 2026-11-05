// Duplicated in packages/qvism-preset/src/utils/breakpoint.ts, which emits the
// matching media queries and cannot import from here (css is generated from it).
// Edit both together — nothing checks, and drift silently splits those media
// queries from the runtime store that reads these names.

// NOTE: this array should be in ascending order from smallest to largest breakpoint
export const breakpointNames = ["base", "sm", "md", "lg", "xl"];

export const breakpoints = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1280,
  xl: 1440,
};

export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
};
