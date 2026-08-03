import { useComposedRefs } from "@radix-ui/react-compose-refs";
import clsx from "clsx";
import * as React from "react";
import { useElementSizeVars } from "./elementSizeVars";

// Duplicated from packages/qvism-preset/src/utils/press-scale.ts
// since @seed-design/react cannot depend on @seed-design/qvism-preset (it is private, and css is generated from it)
// might export the global class names from @seed-design/css later

const PRESS_SCALE_CLASS_NAME = "seed-press-scale";

/**
 * Opts an element into the press scale: put `pressScaleRef` and
 * `pressScaleClassName` on the same element, and it publishes
 * `--seed-press-scale`, a ratio that shrinks it by a fixed 2px when consumed.
 *
 * The two halves belong together — the size vars `useElementSizeVars` publishes,
 * and the class that derives the ratio from them — so the hook hands them back
 * as a pair. If one goes missing the derivation stays guaranteed-invalid and
 * `var(--seed-press-scale, 1)` falls back to 1: a mistake costs the effect
 * rather than producing a wrong scale.
 *
 * Applying the ratio is yours, because the selector that scales the element is
 * usually the same one that changes its background, and splitting them across
 * two rules lets them fire under different conditions:
 *
 *   .my-button {
 *     scale: 1;
 *     transition: background-color 0.2s, var(--seed-press-scale-transition);
 *   }
 *   .my-button:active {
 *     background-color: ...;
 *     scale: var(--seed-press-scale, 1);
 *   }
 *
 * The resting `scale: 1` is not a transition seed — it keeps the element a
 * stacking context throughout, instead of becoming one mid-press and dragging
 * `position: fixed` descendants with it.
 */
export function usePressScale() {
  const { sizeVarsRef } = useElementSizeVars();

  return { pressScaleRef: sizeVarsRef, pressScaleClassName: PRESS_SCALE_CLASS_NAME };
}

/**
 * Wraps a component so its element opts into the press scale — for one-liner
 * factory components (`withContext`/`withProvider` results). Hand-written
 * forwardRef components call `usePressScale` directly instead.
 */
export function withPressScale<P>(
  Component: React.ForwardRefExoticComponent<P>,
): React.ForwardRefExoticComponent<P>;
export function withPressScale(
  Component: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLElement> & { className?: string }
  >,
): React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement> & { className?: string }> {
  const Pressable = React.forwardRef<HTMLElement, { className?: string }>((props, ref) => {
    const { pressScaleRef, pressScaleClassName } = usePressScale();
    const composedRef = useComposedRefs(pressScaleRef, ref);

    return (
      <Component
        {...props}
        ref={composedRef}
        className={clsx(pressScaleClassName, props.className)}
      />
    );
  });

  Pressable.displayName = Component.displayName;
  return Pressable;
}
