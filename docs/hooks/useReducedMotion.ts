"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let mediaQuery: MediaQueryList | null = null;
const subscribers = new Set<() => void>();

function getMediaQuery() {
  if (typeof window === "undefined") return null;
  mediaQuery ??= window.matchMedia(REDUCED_MOTION_QUERY);
  return mediaQuery;
}

function notifySubscribers() {
  for (const subscriber of subscribers) subscriber();
}

function subscribe(subscriber: () => void) {
  const query = getMediaQuery();
  if (!query) return () => undefined;

  subscribers.add(subscriber);
  if (subscribers.size === 1) query.addEventListener("change", notifySubscribers);

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) query.removeEventListener("change", notifySubscribers);
  };
}

function getSnapshot() {
  return getMediaQuery()?.matches ?? true;
}

/**
 * Returns the OS-level Reduced Motion preference and updates when it changes.
 * SSR defaults to `true`, so motion only starts after the client preference is known.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
