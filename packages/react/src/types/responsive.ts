import type { Breakpoint } from "@seed-design/css/breakpoints";

// Before: `T | { [K in Breakpoint]?: T }`
// When T is an object (e.g. ButtonProps), union excess property check is weak
// and allows mixing T's keys with Breakpoint keys without error.
// The intersection with `never`-mapped keys forces TypeScript to reject the mix.
type ResponsiveObject<T> = { [K in Breakpoint]?: T } & (T extends object
  ? { [K in Exclude<keyof T & string, Breakpoint>]?: never }
  : {});

export type ResponsiveValue<T> = T | ResponsiveObject<T>;

export type UnwrapResponsive<T> = T extends ResponsiveValue<infer U> ? U : T;

export type BreakpointThreshold = Exclude<Breakpoint, "base">;

export function isResponsiveObject<T>(value: ResponsiveValue<T>): value is ResponsiveObject<T> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
