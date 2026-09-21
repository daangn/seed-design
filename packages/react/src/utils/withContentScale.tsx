import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Slottable } from "@radix-ui/react-slot";
import { ContentScale, useScaleFeedback } from "@seed-design/react-scale-feedback";
import clsx from "clsx";
import * as React from "react";

/**
 * Wraps a component so its element opts into scale feedback and renders its
 * children inside a `ContentScale` box, for slots whose recipe publishes
 * `--seed-content-scale` instead of scaling the element itself.
 *
 * The children go through `Slottable`, so the box lands inside whichever element
 * ends up rendered: the component's own element, or the `asChild` child, whose
 * children are wrapped in its place.
 */
export function withContentScale<P>(
  Component: React.ForwardRefExoticComponent<P>,
): React.ForwardRefExoticComponent<P>;
export function withContentScale(
  Component: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }
  >,
): React.ForwardRefExoticComponent<
  React.RefAttributes<HTMLElement> & { className?: string; children?: React.ReactNode }
> {
  const Pressable = React.forwardRef<
    HTMLElement,
    { className?: string; children?: React.ReactNode }
  >(({ children, ...props }, ref) => {
    const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();
    const composedRef = useComposedRefs(scaleFeedbackRef, ref);

    return (
      <Component
        {...props}
        ref={composedRef}
        className={clsx(scaleFeedbackClassName, props.className)}
      >
        <Slottable child={children}>
          {(content) => <ContentScale>{content}</ContentScale>}
        </Slottable>
      </Component>
    );
  });

  Pressable.displayName = Component.displayName;
  return Pressable;
}
