import type * as React from "@lynx-js/react";
import clsx from "clsx";
import { mergeProps } from "../../utils/merge-props";
import {
  forwardRef,
  runOnMainThread,
  useEffect,
  useMainThreadRef,
  type MainThreadRef,
} from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { LynxViewRef } from "../../types";
import { computeRingGeometry } from "./ring-geometry";
import { IndeterminateRange } from "./indeterminate-range";
import {
  useStyledProgressCircleContext,
  type Classes,
  type MainThreadProgress,
  type ProgressCircleRangeProps,
} from "./progress-circle-core";
export { ProgressCircleRoot, ProgressCircleTrack } from "./progress-circle-core";
export type {
  ProgressCircleRootProps,
  ProgressCircleTrackProps,
  ProgressCircleRangeProps,
  RootProps,
} from "./progress-circle-core";
const TRANSITION_DURATION = 300;
function bgPieClipPath(size: number, angleDeg: number): string | undefined {
  if (angleDeg >= 360) return undefined;
  if (angleDeg <= 0) return 'path("M 0 0 Z")';
  const c = size / 2;
  const r = c + 1;
  const rad = (angleDeg * Math.PI) / 180;
  const endX = c + r * Math.sin(rad);
  const endY = c - r * Math.cos(rad);
  const largeArc = angleDeg > 180 ? 1 : 0;
  return `path("M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z")`;
}

////////////////////////////////////////////////////////////////////////////////////

// --- Main-thread-only utilities (for animations) ---
// Compiled into the main thread bundle. Must NOT be called from render code.

function cubicBezier(rawT: number, x1: number, y1: number, x2: number, y2: number): number {
  "main thread";
  const t = Math.max(0, Math.min(1, rawT));
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  let currentT = t;
  for (let i = 0; i < 8; i++) {
    const currentX = ((ax * currentT + bx) * currentT + cx) * currentT - t;
    const currentDx = (3 * ax * currentT + 2 * bx) * currentT + cx;
    if (Math.abs(currentDx) < 1e-6) break;
    currentT = currentT - currentX / currentDx;
  }
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  return ((ay * currentT + by) * currentT + cy) * currentT;
}

function pieClipPath(size: number, angleDeg: number): string | undefined {
  "main thread";
  if (angleDeg >= 360) return undefined;
  if (angleDeg <= 0) return 'path("M 0 0 Z")';
  const c = size / 2;
  const r = c + 1;
  const rad = (angleDeg * Math.PI) / 180;
  const endX = c + r * Math.sin(rad);
  const endY = c - r * Math.cos(rad);
  const largeArc = angleDeg > 180 ? 1 : 0;
  return `path("M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z")`;
}

////////////////////////////////////////////////////////////////////////////////////

export const ProgressCircleRange = /* @__PURE__ */ forwardRef<unknown, ProgressCircleRangeProps>(
  (props, ref) => {
    const { numSize, indeterminate, percent, classes, minValue, maxValue, mainThreadProgress } =
      useStyledProgressCircleContext("ProgressCircleRange");

    if (indeterminate) {
      return (
        <IndeterminateRange numSize={numSize} classes={classes} hostProps={props} hostRef={ref} />
      );
    }

    return (
      <DeterminateRange
        numSize={numSize}
        progress={percent / 100}
        classes={classes}
        minValue={minValue}
        maxValue={maxValue}
        mainThreadProgress={mainThreadProgress}
        hostProps={props}
        hostRef={ref}
      />
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

function DeterminateRange({
  numSize,
  progress,
  classes,
  minValue,
  maxValue,
  mainThreadProgress,
  hostProps,
  hostRef,
}: {
  numSize: number;
  progress: number;
  classes: Classes;
  minValue: number;
  maxValue: number;
  mainThreadProgress?: MainThreadRef<MainThreadProgress>;
  hostProps: ProgressCircleRangeProps;
  hostRef: React.ForwardedRef<unknown>;
}) {
  const { children, className, style, ...nativeProps } = hostProps;
  const rangeRef = useMainThreadRef<MainThread.Element>(null);
  const startCapRef = useMainThreadRef<MainThread.Element>(null);
  const endCapRef = useMainThreadRef<MainThread.Element>(null);
  const prevProgressRef = useMainThreadRef<number>(progress);
  const cancelRef = useMainThreadRef<number>(0);

  const { halfSize, ringCenterR, capSize } = computeRingGeometry(numSize);

  const initialAngle = progress * 360;
  const initialClipPath = bgPieClipPath(numSize, initialAngle);
  const initialEndRad = (initialAngle * Math.PI) / 180;

  function cancelAnimation() {
    "main thread";
    if (cancelRef.current) cancelAnimationFrame(cancelRef.current);
    cancelRef.current = 0;
  }

  function applyProgress(p: number) {
    "main thread";
    const angleDeg = p * 360;
    rangeRef.current?.setStyleProperty("clip-path", pieClipPath(numSize, angleDeg) ?? "none");
    const rad = (angleDeg * Math.PI) / 180;
    endCapRef.current?.setStyleProperties({
      left: `${halfSize + ringCenterR * Math.sin(rad) - capSize / 2}px`,
      top: `${halfSize - ringCenterR * Math.cos(rad) - capSize / 2}px`,
    });
  }

  function updateFromMainThread(value: number) {
    "main thread";
    cancelAnimation();
    const normalized =
      maxValue === minValue
        ? 0
        : Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));
    prevProgressRef.current = normalized;
    applyProgress(normalized);
  }

  function startAnimation(newProgress: number) {
    "main thread";
    cancelAnimation();
    const from = prevProgressRef.current ?? 0;
    prevProgressRef.current = newProgress;
    if (from === newProgress) return;
    const startTs = Date.now();
    function step() {
      const elapsed = Date.now() - startTs;
      if (elapsed >= TRANSITION_DURATION) {
        applyProgress(newProgress);
        cancelRef.current = 0;
        return;
      }
      applyProgress(
        from + (newProgress - from) * cubicBezier(elapsed / TRANSITION_DURATION, 0, 0, 0.15, 1),
      );
      cancelRef.current = requestAnimationFrame(step);
    }
    applyProgress(from);
    cancelRef.current = requestAnimationFrame(step);
  }

  function subscribe() {
    "main thread";
    if (!mainThreadProgress) return;
    mainThreadProgress.current.onChange = updateFromMainThread;
    updateFromMainThread(mainThreadProgress.current.value);
  }

  function unsubscribe() {
    "main thread";
    if (mainThreadProgress) {
      mainThreadProgress.current.onChange = undefined;
    }
    cancelAnimation();
  }

  useEffect(() => {
    if (mainThreadProgress) runOnMainThread(subscribe)();
    else runOnMainThread(startAnimation)(progress);
    return () => {
      runOnMainThread(unsubscribe)();
    };
  }, [progress, numSize, minValue, maxValue, mainThreadProgress]);

  return (
    <>
      <view
        {...mergeProps(
          {
            "main-thread:ref": rangeRef,
            style: {
              position: "absolute" as const,
              width: `${numSize}px`,
              height: `${numSize}px`,
              borderRadius: "50%",
              clipPath: initialClipPath,
            },
          },
          nativeProps,
          { style },
          hostRef ? { ref: hostRef as LynxViewRef } : {},
        )}
        className={clsx(classes.range, className)}
      >
        {children}
      </view>
      <view
        main-thread:ref={startCapRef}
        className={classes.cap}
        style={{
          width: `${capSize}px`,
          height: `${capSize}px`,
          left: `${halfSize - capSize / 2}px`,
          top: `${halfSize - ringCenterR - capSize / 2}px`,
        }}
      />
      <view
        main-thread:ref={endCapRef}
        className={classes.cap}
        style={{
          width: `${capSize}px`,
          height: `${capSize}px`,
          left: `${halfSize + ringCenterR * Math.sin(initialEndRad) - capSize / 2}px`,
          top: `${halfSize - ringCenterR * Math.cos(initialEndRad) - capSize / 2}px`,
        }}
      />
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////////

ProgressCircleRange.displayName = "ProgressCircleRange";
