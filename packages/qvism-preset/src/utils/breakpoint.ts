// Duplicated from packages/css/breakpoints/index.mjs
// since qvism-preset cannot depend on @seed-design/css (css is generated from qvism-preset)
// the names now come from rootage; only the pixel values are still duplicated

import type collections from "@seed-design/rootage-artifacts/collections";

/**
 * Rootage declares which breakpoints exist, as the modes of its `viewport-width`
 * collection; it carries no pixel values, so those stay here. The `satisfies`
 * below is what ties the two together — adding, removing or renaming a mode in
 * rootage fails this file until the values follow.
 */
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
