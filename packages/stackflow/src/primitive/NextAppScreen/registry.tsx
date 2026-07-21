import { createContext, useContext, useState } from "react";
import type { NextAppScreenTransitionStyle } from "./types";

export interface NextScreenRegistration {
  transitionStyle: NextAppScreenTransitionStyle;
  rootEl: HTMLElement | null;
  layerEl: HTMLElement | null;
  dimEl: HTMLElement | null;
}

/**
 * Per-stack registry of mounted Next screens, keyed by activity id.
 *
 * Two consumers:
 * - behind screens read the top screen's `transitionStyle` so their behind
 *   visuals follow the top's style (React state — no stale DOM reads),
 * - the swipe-back gesture looks up the behind screen's elements to write the
 *   displacement variables on them directly.
 */
export function createNextScreenRegistry() {
  const entries = new Map<string, NextScreenRegistration>();
  const listeners = new Set<() => void>();
  let version = 0;

  function notify() {
    version += 1;
    for (const listener of listeners) listener();
  }

  return {
    register(activityId: string, registration: NextScreenRegistration) {
      entries.set(activityId, registration);
      notify();
    },
    unregister(activityId: string) {
      if (!entries.delete(activityId)) return;

      notify();
    },
    get: (activityId: string) => entries.get(activityId),
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getVersion: () => version,
  };
}

export type NextScreenRegistry = ReturnType<typeof createNextScreenRegistry>;

const NextScreenRegistryContext = createContext<NextScreenRegistry | null>(null);

export function NextScreenRegistryProvider({ children }: { children: React.ReactNode }) {
  const [registry] = useState(createNextScreenRegistry);

  return (
    <NextScreenRegistryContext.Provider value={registry}>
      {children}
    </NextScreenRegistryContext.Provider>
  );
}

export const useNextScreenRegistry = () => useContext(NextScreenRegistryContext);
