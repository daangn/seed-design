import type { Breakpoint } from "@seed-design/css/breakpoints";
import type * as React from "react";
import { useMemo, useSyncExternalStore } from "react";

import { BreakpointContext } from "../hooks/useBreakpoint";
import * as store from "../primitives/breakpoint-store";

export interface BreakpointProviderProps {
  defaultBreakpoint?: Breakpoint;
  children: React.ReactNode;
}

export function BreakpointProvider({
  defaultBreakpoint = "base",
  children,
}: BreakpointProviderProps) {
  const breakpoint = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => defaultBreakpoint,
  );

  const value = useMemo(() => ({ breakpoint, defaultBreakpoint }), [breakpoint, defaultBreakpoint]);

  return <BreakpointContext.Provider value={value}>{children}</BreakpointContext.Provider>;
}
