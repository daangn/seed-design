import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useScaleFeedback } from "@seed-design/react-scale-feedback";
import clsx from "clsx";
import * as React from "react";

/**
 * Wraps a component so its element opts into scale feedback — for one-liner
 * factory components (`withContext`/`withProvider` results). Hand-written
 * forwardRef components call `useScaleFeedback` directly instead.
 */
export function withScaleFeedback<P>(
  Component: React.ForwardRefExoticComponent<P>,
): React.ForwardRefExoticComponent<P>;
export function withScaleFeedback(
  Component: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLElement> & { className?: string }
  >,
): React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement> & { className?: string }> {
  const Pressable = React.forwardRef<HTMLElement, { className?: string }>((props, ref) => {
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();
    const composedRef = useComposedRefs(scaleFeedbackRef, ref);

    return (
      <Component
        {...props}
        ref={composedRef}
        className={clsx(scaleFeedbackClassName, props.className)}
      />
    );
  });

  Pressable.displayName = Component.displayName;
  return Pressable;
}
