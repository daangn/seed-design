import { usePressScale } from "@seed-design/react";
import clsx from "clsx";
import * as React from "react";

import "./PressScalePlainCss.css";
import * as styles from "./PressScalePressables.css";

const SIZE_CLASS = {
  medium: styles.mediumSize,
  tiny: styles.tinySquare,
  wide: styles.wideBar,
} as const satisfies Record<string, string>;

type PressableProps = React.ComponentPropsWithoutRef<"button"> & {
  size?: keyof typeof SIZE_CLASS;
};

/** Applies the ratio from hand-written CSS: see PressScalePlainCss.css. */
export function PlainCssPressable({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <button
      type="button"
      ref={pressScaleRef}
      className={clsx(pressScaleClassName, "press-scale-plain-css", className)}
      {...props}
    />
  );
}

/** Applies the ratio through `pressScale` / `pressScaleTransition`. */
export function ConstantPressable({ size = "medium", className, ...props }: PressableProps) {
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <button
      type="button"
      ref={pressScaleRef}
      className={clsx(pressScaleClassName, styles.pressable, SIZE_CLASS[size], className)}
      {...props}
    />
  );
}

function assignRef<T>(ref: React.Ref<T>, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

/**
 * Stands in for `useComposedRefs` from `@radix-ui/react-compose-refs`, which
 * this example app does not depend on. Memoized for the reason the real one is:
 * a fresh function every render makes React detach and re-attach the ref, which
 * re-registers the size observation instead of leaving it to fire on resize.
 */
function useComposedRefs<T>(refA: React.Ref<T>, refB: React.Ref<T>) {
  return React.useCallback(
    (node: T | null) => {
      assignRef(refA, node);
      assignRef(refB, node);
    },
    [refA, refB],
  );
}

export const ComposedRefPressable = React.forwardRef<HTMLButtonElement, PressableProps>(
  ({ size = "medium", className, ...props }, ref) => {
    const { pressScaleRef, pressScaleClassName } = usePressScale();

    return (
      <button
        type="button"
        ref={useComposedRefs<HTMLButtonElement>(pressScaleRef, ref)}
        className={clsx(pressScaleClassName, styles.pressable, SIZE_CLASS[size], className)}
        {...props}
      />
    );
  },
);
ComposedRefPressable.displayName = "ComposedRefPressable";

/** Deliberately broken: the class without the ref, so no size is published. */
export function ClassOnlyPressable({ size = "medium", className, ...props }: PressableProps) {
  const { pressScaleClassName } = usePressScale();

  return (
    <button
      type="button"
      className={clsx(
        pressScaleClassName,
        styles.pressable,
        styles.misconfigured,
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    />
  );
}

/** Deliberately broken: the ref without the class, so no ratio is derived. */
export function RefOnlyPressable({ size = "medium", className, ...props }: PressableProps) {
  const { pressScaleRef } = usePressScale();

  return (
    <button
      type="button"
      ref={pressScaleRef}
      className={clsx(styles.pressable, styles.misconfigured, SIZE_CLASS[size], className)}
      {...props}
    />
  );
}

export function NestedPressable({
  optOut = false,
  children,
}: {
  optOut?: boolean;
  children: React.ReactNode;
}) {
  const { pressScaleRef, pressScaleClassName } = usePressScale();

  return (
    <div
      ref={pressScaleRef}
      data-probe={optOut ? "wrapper·off" : "wrapper"}
      className={clsx(pressScaleClassName, styles.nestedWrapper, optOut && styles.markOptOut)}
    >
      {children}
    </div>
  );
}
