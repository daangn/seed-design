// minWidth comes from the "viewport-width" collection in packages/rootage/collections.yaml,
// the same source that generates @seed-design/css/breakpoints and the Tailwind screens.

import collections from "@seed-design/rootage-artifacts/collections";

type ViewportWidthCollection = Extract<
  (typeof collections.data)[number],
  { name: "viewport-width" }
>;

type Breakpoint = ViewportWidthCollection["modes"][number]["id"];

const viewportWidth = collections.data.find(
  (collection): collection is ViewportWidthCollection => collection.name === "viewport-width",
)!;

export const breakpointValues = Object.fromEntries(
  viewportWidth.modes.map(({ id, minWidth }) => [id, minWidth]),
) as { [M in ViewportWidthCollection["modes"][number] as M["id"]]: M["minWidth"] };

type NonBaseBreakpoint = Exclude<Breakpoint, "base">;

export const breakpoints = {
  up: <T extends NonBaseBreakpoint>(name: T) =>
    `@media (min-width: ${breakpointValues[name]}px)` as const,
};
