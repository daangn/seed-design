import { composeRefs } from "@radix-ui/react-compose-refs";
import * as React from "react";

/**
 * Publishes an element's rendered size as CSS custom properties.
 *
 * The size is a plain fact about the element rather than a feature, so this
 * util keeps unitless `--seed-element-width` / `--seed-element-height` in sync
 * on the element and stops there. Whatever needs the size derives its own
 * values from those vars in CSS.
 *
 * Today the only consumer is the press scale mechanism, which owns its formula
 * and parameter tokens in `@seed-design/qvism-preset` (utils/press-scale.ts) —
 * the var names must stay in sync with that file. Press detection stays in CSS
 * (`:active` gates), so no interaction tracking happens here; without JS the
 * vars are simply never set and the recipes fall back to scale 1.
 */

// One observer for every measured element; created lazily so the module stays
// importable during SSR.
let sharedObserver: ResizeObserver | null = null;

function getSharedObserver() {
  sharedObserver ??= new ResizeObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      const size = entry.borderBoxSize?.[0];
      const width = size ? size.inlineSize : element.offsetWidth;
      const height = size ? size.blockSize : element.offsetHeight;

      element.style.setProperty("--seed-element-width", String(width));
      element.style.setProperty("--seed-element-height", String(height));
    }
  });

  return sharedObserver;
}

/**
 * Returns a callback ref that keeps the size vars in sync on the element it is
 * attached to. Compose it with the element's other refs.
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
    if (node) getSharedObserver().observe(node);
  }, []);

  return { sizeVarsRef };
}

/**
 * Wraps a component so its element reports its size — for one-liner factory
 * components (`withContext`/`withProvider` results). Hand-written forwardRef
 * components call `useElementSizeVars` directly instead.
 */
export function withElementSizeVars<P>(
  Component: React.ForwardRefExoticComponent<P>,
): React.ForwardRefExoticComponent<P>;
export function withElementSizeVars(
  Component: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>,
): React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>> {
  const Measured = React.forwardRef<HTMLElement, object>((props, ref) => {
    const { sizeVarsRef } = useElementSizeVars();

    return <Component {...props} ref={composeRefs(sizeVarsRef, ref)} />;
  });

  Measured.displayName = Component.displayName;
  return Measured;
}
