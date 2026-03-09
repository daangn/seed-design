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
