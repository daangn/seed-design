"use client";

import { SCALE_FEEDBACK_CLASS_NAME } from "@seed-design/css/scale-feedback";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { createSlot } from "@radix-ui/react-slot";
import * as React from "react";
import { useElementSizeVars } from "./elementSizeVars";

/**
 * Opts an element into scale feedback: put `scaleFeedbackRef` and
 * `scaleFeedbackClassName` on the same element, and it publishes
 * `--seed-feedback-scale`, a ratio that shrinks it by a fixed 2px when consumed.
 * `ScaleFeedback` pairs them up for an element you render; reach for the hook when
 * you can't wrap one, such as inside a component already assembling its own
 * `ref` and `className`.
 *
 * The two halves belong together — the size vars `useElementSizeVars` publishes,
 * and the class that derives the ratio from them — so the hook hands them back
 * as a pair. If one goes missing the derivation stays guaranteed-invalid and
 * `--seed-feedback-scale` resolves to 1: a mistake costs the effect rather than
 * producing a wrong scale.
 *
 * Applying the ratio is yours, because the selector that scales the element is
 * usually the same one that changes its background, and splitting them across
 * two rules lets them fire under different conditions:
 *
 *   .my-button {
 *     transition: background-color 0.2s, var(--seed-feedback-scale-transition);
 *   }
 *   .my-button:active {
 *     background-color: ...;
 *     scale: var(--seed-feedback-scale);
 *   }
 *
 * The resting `scale: 1` comes with the class rather than with the rule above:
 * it keeps the element a stacking context throughout, instead of becoming one
 * mid-press and dragging `position: fixed` descendants with it.
 */
export function useScaleFeedback() {
  const { sizeVarsRef } = useElementSizeVars();

  return { scaleFeedbackRef: sizeVarsRef, scaleFeedbackClassName: SCALE_FEEDBACK_CLASS_NAME };
}

const ScaleFeedbackSlot = createSlot("ScaleFeedback");

export interface ScaleFeedbackProps {
  children: React.ReactElement;
}

/**
 * Opts its child into scale feedback, so the ref and the class can no longer
 * land on different elements or go missing one at a time. The child keeps its own
 * `ref` and `className`, and applying the ratio is still yours — see
 * `useScaleFeedback` for the rule this expects you to write.
 *
 * There is no `asChild` prop because rendering an element of our own is never the
 * right answer: that element would be the one measured, and a block wrapper around
 * an inline-block button reports the container's width, so the ratio would come
 * out wrong rather than absent. The resting `scale: 1` would settle on the wrapper
 * too, leaving the child to become a stacking context mid-press.
 */
export const ScaleFeedback = React.forwardRef<HTMLElement, ScaleFeedbackProps>(
  ({ children }, ref) => {
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

    const childRef = React.useRef<HTMLElement | null>(null);
    const composedRef = useComposedRefs(scaleFeedbackRef, childRef, ref);

    React.useEffect(() => {
      if (process.env.NODE_ENV === "production") return;

      // Slot throws on children it can't slot onto, but a Fragment child is a valid
      // element it silently declines to hand a ref to, and a component child is free
      // to drop what it is handed. Both leave a ratio of 1 and no other trace.
      const node = childRef.current;
      if (!node) {
        console.warn(
          "ScaleFeedback: the child never forwarded `ref` to a DOM element, so its size is never measured. A Fragment cannot receive one.",
        );
        return;
      }

      if (!node.classList.contains(SCALE_FEEDBACK_CLASS_NAME)) {
        console.warn(
          "ScaleFeedback: the child dropped the `className` it was handed, so no ratio is derived. Forward `className` to the element that takes `ref`.",
        );
      }
    }, []);

    return (
      <ScaleFeedbackSlot ref={composedRef} className={scaleFeedbackClassName}>
        {children}
      </ScaleFeedbackSlot>
    );
  },
);

ScaleFeedback.displayName = "ScaleFeedback";
