import { ScaleFeedback, useScaleFeedback } from "@seed-design/react";
import clsx from "clsx";
import * as React from "react";

import "./ScaleFeedbackPlainCss.css";
import * as styles from "./ScaleFeedbackPressables.css";

const SIZE_CLASS = {
  medium: styles.mediumSize,
  tiny: styles.tinySquare,
  wide: styles.wideBar,
} as const satisfies Record<string, string>;

type PressableProps = React.ComponentPropsWithoutRef<"button"> & {
  size?: keyof typeof SIZE_CLASS;
};

/** Applies the ratio from hand-written CSS: see ScaleFeedbackPlainCss.css. */
export function PlainCssPressable({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

  return (
    <button
      type="button"
      ref={scaleFeedbackRef}
      className={clsx(scaleFeedbackClassName, "scale-feedback-plain-css", className)}
      {...props}
    />
  );
}

/** Applies the ratio through `feedbackScale` / `feedbackScaleTransition`. */
export function ConstantPressable({ size = "medium", className, ...props }: PressableProps) {
  const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

  return (
    <button
      type="button"
      ref={scaleFeedbackRef}
      className={clsx(scaleFeedbackClassName, styles.pressable, SIZE_CLASS[size], className)}
      {...props}
    />
  );
}

/** Opts in by wrapping, so its own `ref` is all this component has to pass down. */
export const SlottedPressable = React.forwardRef<HTMLButtonElement, PressableProps>(
  ({ size = "medium", className, ...props }, ref) => (
    <ScaleFeedback>
      <button
        type="button"
        ref={ref}
        className={clsx(styles.pressable, SIZE_CLASS[size], className)}
        {...props}
      />
    </ScaleFeedback>
  ),
);
SlottedPressable.displayName = "SlottedPressable";

/**
 * Hands its child a fresh `ref` on every render, which is what makes React detach
 * and re-attach it. Clicking re-renders, so the readout shows whether the
 * published size survives the round trip.
 */
export function UnstableRefPressable({ size = "medium", className, ...props }: PressableProps) {
  const [renderCount, setRenderCount] = React.useState(0);
  const nodeRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <ScaleFeedback>
      <button
        type="button"
        ref={(node) => {
          nodeRef.current = node;
        }}
        className={clsx(styles.pressable, SIZE_CLASS[size], className)}
        {...props}
        onClick={() => setRenderCount((count) => count + 1)}
      >
        리렌더 {renderCount}회
      </button>
    </ScaleFeedback>
  );
}

/** Deliberately broken: the class without the ref, so no size is published. */
export function ClassOnlyPressable({ size = "medium", className, ...props }: PressableProps) {
  const { scaleFeedbackClassName } = useScaleFeedback();

  return (
    <button
      type="button"
      className={clsx(
        scaleFeedbackClassName,
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
  const { scaleFeedbackRef } = useScaleFeedback();

  return (
    <button
      type="button"
      ref={scaleFeedbackRef}
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
  const { scaleFeedbackRef, scaleFeedbackClassName } = useScaleFeedback();

  return (
    <div
      ref={scaleFeedbackRef}
      className={clsx(scaleFeedbackClassName, styles.nestedWrapper, optOut && styles.markOptOut)}
    >
      {children}
    </div>
  );
}
