import { useGlobalProps } from "@lynx-js/react";
import type { GlobalProps } from "@lynx-js/types";

declare const __GLOBAL_PROPS_MODE__: "reactive" | "event" | undefined;

/**
 * Reads global props according to `globalPropsMode`.
 *
 * `__GLOBAL_PROPS_MODE__` is a constant replaced at app build time, so the chosen function never
 * changes within a bundle. In `"event"` mode, `useGlobalProps()` subscribes to changes. In
 * `"reactive"` mode, the whole page re-renders when the host changes a value, so this reads
 * `lynx.__globalProps` directly: `useGlobalProps()` returns the same value there but warns on every
 * call in development builds.
 */
export const useHostGlobalProps: () => GlobalProps | undefined =
  typeof __GLOBAL_PROPS_MODE__ !== "undefined" && __GLOBAL_PROPS_MODE__ === "event"
    ? useGlobalProps
    : () => lynx.__globalProps;
