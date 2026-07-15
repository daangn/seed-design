"use client";

import type * as React from "react";

/**
 * Wraps a story component with the same centered canvas as ComponentExample.
 * Must be called from a client module — the returned component crosses the
 * RSC boundary as a client reference when passed to `defineStory`.
 *
 * `Extra` redeclares props at the call site so they survive the node_modules
 * control filter (lib/story-controls-filter-loader.mjs):
 *
 * ```tsx
 * withStoryPreview<{ children?: string }>()(ActionButton)
 * ```
 *
 * The assertion is type-only — the wrapped component still receives whatever
 * props the controls produce. Curried because TypeScript cannot partially
 * infer type arguments (`Extra` explicit, `P` inferred).
 */
export function withStoryPreview<Extra extends object = Record<never, never>>() {
  return function wrap<P extends object>(Component: React.ComponentType<P>) {
    function StoryPreview(props: P) {
      return (
        <div
          className="not-prose example-reset flex min-h-80 w-full flex-col justify-center items-center"
          style={{ backgroundColor: "var(--seed-color-bg-layer-default)" }}
        >
          <Component {...props} />
        </div>
      );
    }

    // TS can't relate `Omit<P, keyof Extra> & Extra` to a bare generic `P`
    // (Extra may genuinely narrow, e.g. ReactNode → string), so `unknown` is
    // required — the intentional mismatch is the point of this helper
    return StoryPreview as unknown as React.FC<Omit<P, keyof Extra> & Extra>;
  };
}
