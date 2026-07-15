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
 *
 * Every key of `Extra` is validated against the wrapped component's props: the
 * `Component` param is intersected with an error brand unless `keyof Extra` is a
 * subset of `keyof P`, so a typo like `{ aschild?: never }` fails to compile at
 * the `()(Component)` call with the offending key named in the error. (Props
 * carrying a `string` index signature widen `keyof P` to `string` and opt out.)
 */
export function withStoryPreview<Extra extends object = Record<never, never>>() {
  return function wrap<P extends object>(
    Component: React.ComponentType<P> &
      (keyof Extra extends keyof P
        ? unknown
        : {
            __error: [
              "withStoryPreview: Extra has keys not on the component",
              Exclude<keyof Extra, keyof P>,
            ];
          }),
  ) {
    // Drop the error brand for rendering (P → P, not an `unknown` cast)
    const Wrapped = Component as React.ComponentType<P>;

    function StoryPreview(props: P) {
      return (
        <div
          className="not-prose example-reset flex min-h-80 w-full flex-col justify-center items-center"
          style={{ backgroundColor: "var(--seed-color-bg-layer-default)" }}
        >
          <Wrapped {...props} />
        </div>
      );
    }

    // TS can't relate `Omit<P, keyof Extra> & Extra` to a bare generic `P`
    // (Extra may genuinely narrow, e.g. ReactNode → string), so `unknown` is
    // required — the intentional mismatch is the point of this helper
    return StoryPreview as unknown as React.FC<Omit<P, keyof Extra> & Extra>;
  };
}
