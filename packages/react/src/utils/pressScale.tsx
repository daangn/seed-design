import { composeRefs } from "@radix-ui/react-compose-refs";
import * as React from "react";

/**
 * Runtime half of the press scale mechanism.
 *
 * This side only reports layout size: it keeps unitless `--seed-press-width` /
 * `--seed-press-height` in sync on the element. The pressed scale itself is
 * derived in CSS by `createPressScaleStyles` in `@seed-design/qvism-preset`
 * (utils/press-scale.ts), which owns the formula and its parameter tokens —
 * the var names must stay in sync with that file. Press detection stays in CSS
 * (`:active` gates), so no press tracking happens here, and without JS the
 * recipes fall back to scale 1.
 */

// One observer for every press-scaled element; created lazily so the module
// stays importable during SSR.
let sharedObserver: ResizeObserver | null = null;

function getSharedObserver() {
  sharedObserver ??= new ResizeObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      const size = entry.borderBoxSize?.[0];
      const width = size ? size.inlineSize : element.offsetWidth;
      const height = size ? size.blockSize : element.offsetHeight;

      element.style.setProperty("--seed-press-width", String(width));
      element.style.setProperty("--seed-press-height", String(height));
    }
  });

  return sharedObserver;
}

/**
 * Returns a callback ref that keeps the press scale size vars in sync on the
 * element it is attached to. Compose it with the element's other refs.
 */
export function usePressScale() {
  const elementRef = React.useRef<HTMLElement | null>(null);

  const pressScaleRef = React.useCallback((node: HTMLElement | null) => {
    const previous = elementRef.current;
    if (previous && previous !== node) {
      getSharedObserver().unobserve(previous);
      previous.style.removeProperty("--seed-press-width");
      previous.style.removeProperty("--seed-press-height");
    }

    elementRef.current = node;
    if (node) getSharedObserver().observe(node);
  }, []);

  return { pressScaleRef };
}

/**
 * Wraps a component so its element reports press scale sizes — for one-liner
 * factory components (`withContext`/`withProvider` results). Hand-written
 * forwardRef components call `usePressScale` directly instead.
 */
export function withPressScale<P>(
  Component: React.ForwardRefExoticComponent<P>,
): React.ForwardRefExoticComponent<P>;
export function withPressScale(
  Component: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>,
): React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>> {
  const PressScaled = React.forwardRef<HTMLElement, object>((props, ref) => {
    const { pressScaleRef } = usePressScale();

    return <Component {...props} ref={composeRefs(pressScaleRef, ref)} />;
  });

  PressScaled.displayName = Component.displayName;
  return PressScaled;
}
