import * as React from "react";

/**
 * Publishes an element's rendered size as CSS custom properties.
 *
 * The size is a plain fact about the element rather than a feature, so this
 * util keeps unitless `--seed-element-width` / `--seed-element-height` in sync
 * on the element and stops there. Whatever needs the size derives its own
 * values from those vars in CSS.
 *
 * The names must stay in sync with `@seed-design/qvism-preset`
 * (utils/scale-feedback.ts), which owns the formula that consumes them. Press
 * detection stays in CSS (`:active` gates), so nothing here tracks interaction;
 * without JS the vars are simply never set and consumers fall back to scale 1.
 */

// One observer for every measured element; created lazily so the module stays
// importable during SSR.
let sharedObserver: ResizeObserver | null = null;

function getSharedObserver() {
  sharedObserver ??= new ResizeObserver((entries) => {
    // `borderBoxSize` is absent before Safari 15.4, inside the range SEED
    // supports, so the `offsetWidth` / `offsetHeight` fallback is a live path
    // rather than a formality. Reading every entry before writing any property
    // is what keeps it free: layout is already clean when observations are
    // broadcast, so the reads force nothing, while a write interleaved between
    // them would dirty layout and make every later read reflow.
    const measurements = entries.map((entry) => {
      const element = entry.target as HTMLElement;
      const size = entry.borderBoxSize?.[0];

      return {
        element,
        width: size ? size.inlineSize : element.offsetWidth,
        height: size ? size.blockSize : element.offsetHeight,
      };
    });

    for (const { element, width, height } of measurements) {
      element.style.setProperty("--seed-element-width", String(width));
      element.style.setProperty("--seed-element-height", String(height));
    }
  });

  return sharedObserver;
}

/**
 * Returns a callback ref that keeps the size vars in sync on the element it is
 * attached to. Compose it with the element's other refs however you like: being
 * handed an element it already watches is a no-op, so the observation survives a
 * ref whose identity changes every render and the vars are republished on resize
 * rather than on render.
 *
 * Teardown still runs when the ref genuinely leaves an element — it is unobserved
 * and its vars removed — so an element that keeps the class but loses the ref
 * falls back to a ratio of 1 instead of holding a stale one.
 */
export function useElementSizeVars() {
  // What React last handed the ref, against what the observer is watching. The
  // two disagree for exactly one commit whenever a ref identity changes, because
  // React detaches with `null` before re-attaching the very same element.
  const attachedRef = React.useRef<HTMLElement | null>(null);
  const observedRef = React.useRef<HTMLElement | null>(null);

  const release = React.useCallback(() => {
    const observed = observedRef.current;
    if (!observed) return;

    observedRef.current = null;
    getSharedObserver().unobserve(observed);
    observed.style.removeProperty("--seed-element-width");
    observed.style.removeProperty("--seed-element-height");
  }, []);

  const sizeVarsRef = React.useCallback(
    (node: HTMLElement | null) => {
      attachedRef.current = node;

      if (!node) {
        // A commit runs to completion synchronously, so this cannot land before
        // the re-attach that an identity change performs within the same commit.
        // By the time it runs, the two refs tell a detached element apart from
        // one that never actually left.
        queueMicrotask(() => {
          if (attachedRef.current === observedRef.current) return;

          release();
        });
        return;
      }

      if (observedRef.current === node) return;

      release();
      observedRef.current = node;
      // `box` selects which box change marks the element active — it does not
      // decide which sizes the entry carries (all of them are always present).
      // Observing the content box would miss a border-box change that leaves the
      // content box untouched, e.g. a variant that only alters padding.
      //
      // Before Safari 15.4 `observe` declares no options at all, so this argument
      // is dropped and that miss is exactly what happens there. Bounded: the ratio
      // stays valid, only derived from the last size whose content box moved.
      getSharedObserver().observe(node, { box: "border-box" });
    },
    [release],
  );

  return { sizeVarsRef };
}
