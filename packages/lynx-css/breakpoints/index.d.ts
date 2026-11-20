// Generated from the "viewport-width" collection of @seed-design/rootage-artifacts. Do not edit.

export declare const breakpointNames: readonly ["base", "sm", "md", "lg", "xl"];

export type Breakpoint = (typeof breakpointNames)[number];

export declare const breakpoints: Record<Breakpoint, number>;

export declare const mediaQueries: Record<Exclude<Breakpoint, "base">, string>;
