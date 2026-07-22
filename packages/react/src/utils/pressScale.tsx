import { useComposedRefs } from "@radix-ui/react-compose-refs";
import clsx from "clsx";
import * as React from "react";
import { useElementSizeVars } from "./elementSizeVars";

/**
 * Opts an element into the press scale.
 *
 * The input to the effect has two halves and both belong on the same element:
 * the size vars `useElementSizeVars` publishes, and the class that derives
 * `--seed-press-scale` from them. This hook hands the pair back together so
 * they cannot drift apart — and if one does go missing the derivation chain
 * stays guaranteed-invalid, so every consumer falls back to `scale: 1`. A
 * mistake costs the effect rather than producing a wrong scale.
 *
 * What it does not own is the gate: which selector applies the scale, what the
 * resting value is, and whether the scale lands on `scale` or on a custom
 * property for an inner layout layer all stay with the recipe.
 */
// Defined once in `@seed-design/qvism-preset` (global.ts, `PRESS_SCALE_CLASS_NAME`)
// and shipped in base.css — the name must stay in sync with that file.
const PRESS_SCALE_CLASS_NAME = "seed-press-scale";

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
