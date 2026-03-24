// Duplicated from packages/css/breakpoints/index.mjs
// since qvism-preset cannot depend on @seed-design/css (css is generated from qvism-preset)
// might define breakpoint in rootage later

export const breakpointValues = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1280,
  xl: 1440,
} as const;

type NonBaseBreakpoint = Exclude<keyof typeof breakpointValues, "base">;

export const breakpoints = {
  up: <T extends NonBaseBreakpoint>(name: T) =>
    `@media (min-width: ${breakpointValues[name]}px)` as const,
};
