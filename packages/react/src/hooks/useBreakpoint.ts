import type { Breakpoint } from "@seed-design/css/breakpoints";
import { createContext, useContext, useSyncExternalStore } from "react";

import * as store from "../primitives/breakpoint-store";

export interface UseBreakpointOptions {
  defaultBreakpoint?: Breakpoint;
}

export interface BreakpointContextValue {
  breakpoint: Breakpoint;
  defaultBreakpoint: Breakpoint;
}

export const BreakpointContext = createContext<BreakpointContextValue | null>(null);

export function useBreakpoint(options?: UseBreakpointOptions): Breakpoint {
  const ctx = useContext(BreakpointContext);
  const defaultBp = options?.defaultBreakpoint ?? ctx?.defaultBreakpoint ?? "base";

  const storeBreakpoint = useSyncExternalStore(store.subscribe, store.getSnapshot, () => defaultBp);

  return ctx ? ctx.breakpoint : storeBreakpoint;
}
