"use client";

import { createContext, useContext, type ReactNode } from "react";
import { createTopNavigationAdapter, type TopNavigationAdapter } from "./top-navigation/adapter";
import type { TopNavigationHost } from "./top-navigation/host";

const TopNavigationContext = createContext<TopNavigationAdapter | null>(null);

// One adapter per host, so a render StrictMode repeats does not subscribe to its events twice.
const adapters = new WeakMap<TopNavigationHost, TopNavigationAdapter>();

export interface HostUIProviderProps {
  /**
   * Pass it only when the app has decided the host can draw the bar. SEED trusts it and draws no
   * web `NextAppBar`; without it the web bar is drawn. Keep the same object across renders, such
   * as one created at module level: a new one gets a new adapter.
   *
   * @experimental
   */
  topNavigation?: TopNavigationHost | null;
  children: ReactNode;
}

/** Hands UI the host can draw itself, such as the top navigation, to that host. */
export function HostUIProvider({ topNavigation, children }: HostUIProviderProps) {
  const adapter = topNavigation
    ? (adapters.get(topNavigation) ?? createTopNavigationAdapter(topNavigation))
    : null;
  if (topNavigation && adapter) adapters.set(topNavigation, adapter);

  return <TopNavigationContext.Provider value={adapter}>{children}</TopNavigationContext.Provider>;
}

/** Whether the host draws the top navigation or the web does. `"web"` without a provider too. */
export const useTopNavigationMode = () =>
  useContext(TopNavigationContext) ? ("host" as const) : ("web" as const);

/** @internal For `@seed-design/stackflow`, which declares each screen's bar. */
export const useTopNavigationAdapter = () => useContext(TopNavigationContext);
