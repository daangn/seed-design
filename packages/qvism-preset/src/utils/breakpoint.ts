// the pixel values are duplicated from packages/css/breakpoints/index.mjs
// since qvism-preset cannot depend on @seed-design/css (css is generated from qvism-preset)
// edit both together — nothing checks, and drift silently splits the generated media queries from the runtime store that reads the same names

import type collections from "@seed-design/rootage-artifacts/collections";

type Breakpoint = Extract<
  (typeof collections.data)[number],
  { name: "viewport-width" }
>["modes"][number]["id"];

export const breakpointValues = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1280,
  xl: 1440,
} as const satisfies Record<Breakpoint, number>;

type NonBaseBreakpoint = Exclude<Breakpoint, "base">;

export const breakpoints = {
  up: <T extends NonBaseBreakpoint>(name: T) =>
    `@media (min-width: ${breakpointValues[name]}px)` as const,
};
