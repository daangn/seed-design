import { PRESS_SCALE_CLASS_NAME } from "@seed-design/css/press-scale";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { createSlot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";
import { useElementSizeVars } from "./elementSizeVars";

/**
 * Opts an element into the press scale: put `pressScaleRef` and
 * `pressScaleClassName` on the same element, and it publishes
 * `--seed-press-scale`, a ratio that shrinks it by a fixed 2px when consumed.
 * `PressScale` pairs them up for an element you render; reach for the hook when
 * you can't wrap one, such as inside a component already assembling its own
 * `ref` and `className`.
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

const PressScaleSlot = createSlot("PressScale");

export interface PressScaleProps {
  children: React.ReactElement;
}

/**
 * Opts its child into the press scale, so the ref and the class can no longer
 * land on different elements or go missing one at a time. The child keeps its own
 * `ref` and `className`, and applying the ratio is still yours — see
 * `usePressScale` for the rule this expects you to write.
 *
 * There is no `asChild` prop because rendering an element of our own is never the
 * right answer: that element would be the one measured, and a block wrapper around
 * an inline-block button reports the container's width, so the ratio would come
 * out wrong rather than absent. The resting `scale: 1` would settle on the wrapper
 * too, leaving the child to become a stacking context mid-press.
 */
export const PressScale = React.forwardRef<HTMLElement, PressScaleProps>(({ children }, ref) => {
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  const childRef = React.useRef<HTMLElement | null>(null);
  const composedRef = useComposedRefs(pressScaleRef, childRef, ref);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    // Slot throws on children it can't slot onto, but a Fragment child is a valid
    // element it silently declines to hand a ref to, and a component child is free
    // to drop what it is handed. Both leave a ratio of 1 and no other trace.
    const node = childRef.current;
    if (!node) {
      console.warn(
        "PressScale: the child never forwarded `ref` to a DOM element, so its size is never measured. A Fragment cannot receive one.",
      );
      return;
    }

    if (!node.classList.contains(PRESS_SCALE_CLASS_NAME)) {
      console.warn(
        "PressScale: the child dropped the `className` it was handed, so no ratio is derived. Forward `className` to the element that takes `ref`.",
      );
    }
  }, []);

  return (
    <PressScaleSlot ref={composedRef} className={pressScaleClassName}>
      {children}
    </PressScaleSlot>
  );
});

PressScale.displayName = "PressScale";

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
