import { type Breakpoint, breakpointNames } from "@seed-design/css/breakpoints";
import { useMemo } from "react";

import type { ResponsiveValue } from "../types/responsive";
import { isResponsiveObject } from "../types/responsive";
import { type UseBreakpointOptions, useBreakpoint } from "./useBreakpoint";

export function resolveResponsiveValue<T>(
  values: { [K in Breakpoint]?: T },
  breakpoint: Breakpoint,
): T | undefined {
  const idx = breakpointNames.indexOf(breakpoint);
  for (let i = idx; i >= 0; i--) {
    const val = values[breakpointNames[i]];

    if (val !== undefined) return val;
  }
  
  return undefined;
}

export function useBreakpointValue<T>(
  values: ResponsiveValue<T>,
  options?: UseBreakpointOptions,
): T {
  const breakpoint = useBreakpoint(options);

  return useMemo(() => {
    if (!isResponsiveObject(values)) return values;

    return resolveResponsiveValue(values, breakpoint) as T;
  }, [values, breakpoint]);
}
