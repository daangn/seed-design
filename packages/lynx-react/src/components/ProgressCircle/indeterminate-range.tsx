import type * as React from "@lynx-js/react";
import clsx from "clsx";
import { mergeProps } from "../../utils/merge-props";
import { forwardRef, runOnMainThread, useEffect, useMainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { LynxViewRef } from "../../types";
import { computeRingGeometry } from "./ring-geometry";
import {
  useStyledProgressCircleContext,
  type Classes,
  type ProgressCircleRangeProps,
} from "./progress-circle-core";
function bgCubicBezier(rawT: number, x1: number, y1: number, x2: number, y2: number): number {
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

function bgSampleIndeterminate(t: number) {
  const containerEased = bgCubicBezier(t, 0.35, 0.25, 0.65, 0.75);
  const headEased = bgCubicBezier(t, 0.35, 0, 0.65, 1);
  const tailEased = bgCubicBezier(t, 0.35, 0, 0.65, 0.6);

  const headLength = headEased <= 0.75 ? (headEased / 0.75) * 360 : 360;
  const tailOffset = tailEased <= 1 / 3 ? 0 : ((tailEased - 1 / 3) / (2 / 3)) * 360;
  const arcLength = Math.max(0, headLength - tailOffset);
  const containerDeg = containerEased * 360 + tailOffset;

  return { containerDeg, arcLength };
}

const INDETERMINATE_DURATION = 1200;
const INDETERMINATE_INITIAL_PHASE = 1 / 6;

// clip-path는 보간되지 않으므로 고정 반원 두 개와 cap을 회전한다.
// 10ms 간격의 기존 곡선을 한 번만 샘플링하고 프레임 간 보간은 엔진에 맡긴다.
const INDETERMINATE_KEYFRAMES = /* @__PURE__ */ (() => {
  const container: { transform: string }[] = [];
  const firstHalf: { transform: string }[] = [];
  const secondHalf: { transform: string }[] = [];
  const head: { transform: string }[] = [];
  const intervals = INDETERMINATE_DURATION / 10;
  for (let i = 0; i <= intervals; i++) {
    const phase = INDETERMINATE_INITIAL_PHASE + i / intervals;
    const state = bgSampleIndeterminate(phase % 1);
    container.push({ transform: `rotate(${state.containerDeg + Math.floor(phase) * 720}deg)` });
    firstHalf.push({ transform: `rotate(${Math.min(180, state.arcLength)}deg)` });
    secondHalf.push({ transform: `rotate(${Math.max(0, state.arcLength - 180)}deg)` });
    head.push({ transform: `rotate(${state.arcLength}deg)` });
  }
  return { container, firstHalf, secondHalf, head };
})();

////////////////////////////////////////////////////////////////////////////////////

export function IndeterminateRange({
  numSize,
  classes,
  hostProps,
  hostRef,
}: {
  numSize: number;
  classes: Classes;
  hostProps: ProgressCircleRangeProps;
  hostRef: React.ForwardedRef<unknown>;
}) {
  const { children, className, style, ...nativeProps } = hostProps;
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const firstHalfRef = useMainThreadRef<MainThread.Element>(null);
  const secondHalfRef = useMainThreadRef<MainThread.Element>(null);
  const headRef = useMainThreadRef<MainThread.Element>(null);
  const animationsRef = useMainThreadRef<MainThread.Animation[]>([]);
  const { halfSize, ringCenterR, capSize } = computeRingGeometry(numSize);
  const capStyle = {
    width: `${capSize}px`,
    height: `${capSize}px`,
    left: `${halfSize - capSize / 2}px`,
    top: `${halfSize - ringCenterR - capSize / 2}px`,
  };

  function stopAnimations() {
    "main thread";
    for (const animation of animationsRef.current) animation.cancel();
    animationsRef.current = [];
  }

  function startAnimations() {
    "main thread";
    stopAnimations();
    const options = {
      duration: INDETERMINATE_DURATION,
      iterations: Infinity,
      easing: "linear",
    };
    const targets = [
      containerRef.current,
      firstHalfRef.current,
      secondHalfRef.current,
      headRef.current,
    ];
    const keyframes = [
      INDETERMINATE_KEYFRAMES.container,
      INDETERMINATE_KEYFRAMES.firstHalf,
      INDETERMINATE_KEYFRAMES.secondHalf,
      INDETERMINATE_KEYFRAMES.head,
    ];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (target) animationsRef.current.push(target.animate(keyframes[i]!, options));
    }
  }

  useEffect(() => {
    runOnMainThread(startAnimations)();
    return () => {
      runOnMainThread(stopAnimations)();
    };
  }, [numSize]);

  return (
    <view
      main-thread:ref={containerRef}
      className="seed-progress-circle__spinner"
      style={INDETERMINATE_KEYFRAMES.container[0]}
    >
      <view
        {...mergeProps(nativeProps, { style }, hostRef ? { ref: hostRef as LynxViewRef } : {})}
        className={clsx(classes.range, "seed-progress-circle__indeterminate-range", className)}
      >
        <view className="seed-progress-circle__half seed-progress-circle__half--first">
          <view
            main-thread:ref={firstHalfRef}
            className={clsx(classes.range, "seed-progress-circle__semicircle--first")}
            style={INDETERMINATE_KEYFRAMES.firstHalf[0]}
          />
        </view>
        <view className="seed-progress-circle__half seed-progress-circle__half--second">
          <view
            main-thread:ref={secondHalfRef}
            className={clsx(classes.range, "seed-progress-circle__semicircle--second")}
            style={INDETERMINATE_KEYFRAMES.secondHalf[0]}
          />
        </view>
        {children}
      </view>
      <view className={classes.cap} style={capStyle} />
      <view
        main-thread:ref={headRef}
        className="seed-progress-circle__spinner"
        style={INDETERMINATE_KEYFRAMES.head[0]}
      >
        <view className={classes.cap} style={capStyle} />
      </view>
    </view>
  );
}

export const IndeterminateProgressCircleRange = forwardRef<unknown, ProgressCircleRangeProps>(
  (props, ref) => {
    const { numSize, classes } = useStyledProgressCircleContext("ProgressCircleRange");
    return (
      <IndeterminateRange numSize={numSize} classes={classes} hostProps={props} hostRef={ref} />
    );
  },
);
IndeterminateProgressCircleRange.displayName = "IndeterminateProgressCircleRange";
