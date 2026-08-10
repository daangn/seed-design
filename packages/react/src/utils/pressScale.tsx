import { PRESS_SCALE_CLASS_NAME } from "@seed-design/css/class-names";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import clsx from "clsx";
import * as React from "react";
import { useElementSizeVars } from "./elementSizeVars";

/**
 * Opts an element into the press scale: put `pressScaleRef` and
 * `pressScaleClassName` on the same element, and it publishes
 * `--seed-press-scale`, a ratio that shrinks it by a fixed 2px when consumed.
 *
 * The two halves belong together — the size vars `useElementSizeVars` publishes,
 * and the class that derives the ratio from them — so the hook hands them back
 * as a pair. If one goes missing the derivation stays guaranteed-invalid and
 * `--seed-press-scale` resolves to 1: a mistake costs the effect rather than
 * producing a wrong scale.
 *
 * Applying the ratio is yours, because the selector that scales the element is
 * usually the same one that changes its background, and splitting them across
 * two rules lets them fire under different conditions:
 *
 *   .my-button {
 *     transition: background-color 0.2s, var(--seed-press-scale-transition);
 *   }
 *   .my-button:active {
 *     background-color: ...;
 *     scale: var(--seed-press-scale);
 *   }
 *
 * The resting `scale: 1` comes with the class rather than with the rule above:
 * it keeps the element a stacking context throughout, instead of becoming one
 * mid-press and dragging `position: fixed` descendants with it.
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
