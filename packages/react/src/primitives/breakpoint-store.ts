import { type Breakpoint, breakpointNames, mediaQueries } from "@seed-design/css/breakpoints";

type Listener = () => void;

const thresholds = breakpointNames.filter(
  (name): name is Exclude<Breakpoint, "base"> => name !== "base",
);

let listeners: Set<Listener> | null = null;
let mediaQueryLists: MediaQueryList[] | null = null;
let currentBreakpoint: Breakpoint = "base";

function computeBreakpoint(): Breakpoint {
  if (!mediaQueryLists) return "base";
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (mediaQueryLists[i].matches) return thresholds[i];
  }
  return "base";
}

function handleChange() {
  const next = computeBreakpoint();
  if (next !== currentBreakpoint) {
    currentBreakpoint = next;
    for (const fn of listeners ?? []) fn();
  }
}

function init() {
  mediaQueryLists = thresholds.map((name) => window.matchMedia(mediaQueries[name]));
  currentBreakpoint = computeBreakpoint();
  for (const mql of mediaQueryLists) {
    mql.addEventListener("change", handleChange);
  }
}

function teardown() {
  if (mediaQueryLists) {
    for (const mql of mediaQueryLists) {
      mql.removeEventListener("change", handleChange);
    }
    mediaQueryLists = null;
  }
  currentBreakpoint = "base";
}

export function subscribe(listener: Listener): () => void {
  if (!listeners) {
    listeners = new Set();
    init();
  }
  listeners.add(listener);

  return () => {
    listeners?.delete(listener);
    if (listeners?.size === 0) {
      teardown();
      listeners = null;
    }
  };
}

export function getSnapshot(): Breakpoint {
  return currentBreakpoint;
}

export function getServerSnapshot(): Breakpoint {
  return "base";
}
