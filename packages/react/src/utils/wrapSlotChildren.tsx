import * as React from "react";

/**
 * Wraps `children` with `wrap`. When `asChild` is set, `children` is the
 * consumer's single slot target — clone it and wrap its own children instead,
 * so the consumer element stays the root and the wrapper lands inside it.
 * (Equivalent to Slot 1.3.0's `Slottable` child render-prop form, but works
 * across `@radix-ui/react-slot` 1.2.x/1.3.x so no dependency floor bump is
 * required.)
 *
 * Bails out (no wrapper, so no pressed scale) instead of breaking the slot
 * contract when the target is:
 * - not a single React element,
 * - itself an `asChild` component — injecting a wrapper between chained slots
 *   would make the wrapper the inner slot target and steal the root semantics,
 * - childless — nothing to scale, and void elements (`img`) or
 *   `dangerouslySetInnerHTML` targets must not receive children,
 * - using render-prop children.
 */
export function wrapSlotChildren(
  asChild: boolean | undefined,
  children: React.ReactNode,
  wrap: (children: React.ReactNode) => React.ReactElement,
) {
  if (!asChild) return wrap(children);
  if (!React.isValidElement<{ children?: React.ReactNode; asChild?: boolean }>(children))
    return children;
  if (children.props.asChild) return children;
  if (children.props.children == null) return children;
  if (typeof children.props.children === "function") return children;

  return React.cloneElement(children, undefined, wrap(children.props.children));
}
