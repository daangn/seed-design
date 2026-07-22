import * as React from "react";

/**
 * Publishes an element's rendered size as CSS custom properties.
 *
 * The size is a plain fact about the element rather than a feature, so this
 * util keeps unitless `--seed-element-width` / `--seed-element-height` in sync
 * on the element and stops there. Whatever needs the size derives its own
 * values from those vars in CSS.
 *
 * Today the only consumer is the press scale mechanism, reached through
 * `usePressScale`, which owns its formula and parameters in
 * `@seed-design/qvism-preset` (utils/press-scale.ts) — the var names must stay
 * in sync with that file. Press detection stays in CSS (`:active` gates), so no
 * interaction tracking happens here; without JS the vars are simply never set
 * and the recipes fall back to scale 1.
 */

// One observer for every measured element; created lazily so the module stays
// importable during SSR.
let sharedObserver: ResizeObserver | null = null;

function getSharedObserver() {
  sharedObserver ??= new ResizeObserver((entries) => {
    // Read every entry before writing any property. `borderBoxSize` is absent
    // on older engines, and the `offsetWidth` / `offsetHeight` fallback forces
    // a synchronous layout — interleaved with the writes below that would
    // thrash once per entry instead of once per callback.
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
 * attached to. Compose it with the element's other refs using `useComposedRefs`
 * — a bare `composeRefs` returns a new function every render, which makes React
 * detach and re-attach the ref, and that re-registers the observation and
 * republishes the vars on every render rather than on every resize.
 */
export function useElementSizeVars() {
  const elementRef = React.useRef<HTMLElement | null>(null);

  const sizeVarsRef = React.useCallback((node: HTMLElement | null) => {
    const previous = elementRef.current;
    if (previous && previous !== node) {
      getSharedObserver().unobserve(previous);
      previous.style.removeProperty("--seed-element-width");
      previous.style.removeProperty("--seed-element-height");
    }

    elementRef.current = node;
    // `box` selects which box change marks the element active — it does not
    // decide which sizes the entry carries (all of them are always present).
    // Observing the content box would miss a border-box change that leaves the
    // content box untouched, e.g. a variant that only alters padding.
    if (node) getSharedObserver().observe(node, { box: "border-box" });
  }, []);

  return { sizeVarsRef };
}
