import { createContext, useContext, useEffect, useMemo, useMainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import clsx from "clsx";
import { progressCircle } from "@seed-design/lynx-css/recipes/progress-circle";
import type { ProgressCircleVariantProps } from "@seed-design/lynx-css/recipes/progress-circle";

type Tone = "neutral" | "brand" | "staticWhite";
type Size = "24" | "40";

interface ProgressCircleContextValue {
  tone: Tone;
  numSize: number;
  isDeterminate: boolean;
  progress: number;
  classes: ReturnType<typeof progressCircle>;
}

const ProgressCircleContext = createContext<ProgressCircleContextValue | null>(null);

function useProgressCircleCtx() {
  const ctx = useContext(ProgressCircleContext);
  if (!ctx) {
    throw new Error("ProgressCircle compound components must be used within ProgressCircle.Root");
  }
  return ctx;
}

// --- Math utilities ---
// These pure functions are shared by both main thread and background thread code.

function cubicBezier(rawT: number, x1: number, y1: number, x2: number, y2: number): number {
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

// --- Indeterminate animation constants ---

const INDETERMINATE_DURATION = 1200;

interface IndeterminateState {
  containerDeg: number;
  arcLength: number;
}

function sampleIndeterminate(t: number): IndeterminateState {
  const containerEased = cubicBezier(t, 0.35, 0.25, 0.65, 0.75);
  const headEased = cubicBezier(t, 0.35, 0, 0.65, 1);
  const tailEased = cubicBezier(t, 0.35, 0, 0.65, 0.6);

  const headLength = headEased <= 0.75 ? (headEased / 0.75) * 360 : 360;
  const tailOffset = tailEased <= 1 / 3 ? 0 : ((tailEased - 1 / 3) / (2 / 3)) * 360;
  const arcLength = Math.max(0, headLength - tailOffset);
  const containerDeg = containerEased * 360 + tailOffset;

  return { containerDeg, arcLength };
}

// --- Shared indeterminate animation loop ---
// Uses a single requestAnimationFrame loop on the main thread to drive all
// indeterminate ProgressCircle instances. This avoids N independent setInterval
// timers and N setState re-renders per frame.
//
// Pattern reference: lynx-ui (official Lynx UI library) uses requestAnimationFrame
// + 'main thread' directive + setStyleProperty() for all animations.

interface IndeterminateSubscriber {
  containerRef: MainThread.Element | null;
  rangeRef: MainThread.Element | null;
  headCapRef: MainThread.Element | null;
  tailCapRef: MainThread.Element | null;
  numSize: number;
}

/**
 * Compute all derived style values for an indeterminate circle and apply them
 * directly via setStyleProperties (no React re-render).
 */
function applyIndeterminateStyles(sub: IndeterminateSubscriber, state: IndeterminateState): void {
  "main thread";

  const { numSize } = sub;
  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;

  // Container rotation
  sub.containerRef?.setStyleProperty("transform", `rotate(${state.containerDeg}deg)`);

  // Range clip-path
  const clipPath = pieClipPath(numSize, state.arcLength);
  if (clipPath) {
    sub.rangeRef?.setStyleProperty("clip-path", clipPath);
  } else {
    sub.rangeRef?.setStyleProperty("clip-path", "none");
  }

  // Head cap position
  const headRad = (state.arcLength * Math.PI) / 180;
  const headCapX = halfSize + ringCenterR * Math.sin(headRad) - capSize / 2;
  const headCapY = halfSize - ringCenterR * Math.cos(headRad) - capSize / 2;
  sub.headCapRef?.setStyleProperties({
    left: `${headCapX}px`,
    top: `${headCapY}px`,
  });

  // Tail cap position (always at 12 o'clock in local coords)
  const tailCapX = halfSize - capSize / 2;
  const tailCapY = halfSize - ringCenterR - capSize / 2;
  sub.tailCapRef?.setStyleProperties({
    left: `${tailCapX}px`,
    top: `${tailCapY}px`,
  });
}

// Module-level shared animation state for indeterminate circles.
// One RAF loop serves all subscribers.
const indeterminateSubscribers = new Map<number, IndeterminateSubscriber>();
let indeterminateRafId = 0;
let indeterminateStartTs = 0;
let nextSubscriberId = 0;

function indeterminateTick(ts: number): void {
  "main thread";

  if (!indeterminateStartTs) {
    indeterminateStartTs = Number(ts);
  }

  const elapsed = ts - indeterminateStartTs;
  const t = (elapsed % INDETERMINATE_DURATION) / INDETERMINATE_DURATION;
  const state = sampleIndeterminate(t);

  indeterminateSubscribers.forEach((sub) => {
    applyIndeterminateStyles(sub, state);
  });

  if (indeterminateSubscribers.size > 0) {
    indeterminateRafId = requestAnimationFrame(indeterminateTick);
  }
}

function subscribeIndeterminate(sub: IndeterminateSubscriber): number {
  "main thread";

  const id = nextSubscriberId++;
  indeterminateSubscribers.set(id, sub);

  // Start loop if this is the first subscriber
  if (indeterminateSubscribers.size === 1) {
    indeterminateStartTs = 0;
    indeterminateRafId = requestAnimationFrame(indeterminateTick);
  }

  return id;
}

function unsubscribeIndeterminate(id: number): void {
  "main thread";

  indeterminateSubscribers.delete(id);

  // Stop loop if no more subscribers
  if (indeterminateSubscribers.size === 0 && indeterminateRafId) {
    cancelAnimationFrame(indeterminateRafId);
    indeterminateRafId = 0;
  }
}

// --- Determinate animation (RAF-based) ---
// Short-lived (300ms) transition when progress value changes.
// Each instance gets its own RAF since transitions are independent and brief.

const TRANSITION_DURATION = 300;

function animateDeterminateProgress(
  from: number,
  to: number,
  numSize: number,
  rangeRef: MainThread.Element | null,
  startCapRef: MainThread.Element | null,
  endCapRef: MainThread.Element | null,
): { cancel: () => void } {
  "main thread";

  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;
  let rafId = 0;
  let startTs = 0;

  function applyProgress(progress: number): void {
    "main thread";

    const angleDeg = progress * 360;
    const clipPath = pieClipPath(numSize, angleDeg);

    if (clipPath) {
      rangeRef?.setStyleProperty("clip-path", clipPath);
    } else {
      rangeRef?.setStyleProperty("clip-path", "none");
    }

    // End cap position
    const rad = (angleDeg * Math.PI) / 180;
    endCapRef?.setStyleProperties({
      left: `${halfSize + ringCenterR * Math.sin(rad) - capSize / 2}px`,
      top: `${halfSize - ringCenterR * Math.cos(rad) - capSize / 2}px`,
    });

    // Start cap is always at 12 o'clock (angle 0)
    startCapRef?.setStyleProperties({
      left: `${halfSize - capSize / 2}px`,
      top: `${halfSize - ringCenterR - capSize / 2}px`,
    });
  }

  function step(ts: number): void {
    "main thread";

    if (!startTs) {
      startTs = Number(ts);
    }

    const elapsed = ts - startTs;
    if (elapsed >= TRANSITION_DURATION) {
      applyProgress(to);
      return;
    }

    const t = elapsed / TRANSITION_DURATION;
    const eased = cubicBezier(t, 0, 0, 0.15, 1);
    const current = from + (to - from) * eased;
    applyProgress(current);
    rafId = requestAnimationFrame(step);
  }

  // Apply initial state immediately
  applyProgress(from);
  rafId = requestAnimationFrame(step);

  return {
    cancel: () => {
      "main thread";
      cancelAnimationFrame(rafId);
    },
  };
}

// --- Components ---

export interface RootProps extends ProgressCircleVariantProps {
  minValue?: number;
  maxValue?: number;
  value?: number;
  children?: React.ReactNode;
  className?: string;
}

function Root(props: RootProps) {
  const size: Size = (props.size as Size) ?? "40";
  const tone: Tone = (props.tone as Tone) ?? "neutral";
  const numSize = Number(size);

  const isDeterminate =
    props.minValue !== undefined && props.maxValue !== undefined && props.value !== undefined;

  const range = (props.maxValue ?? 1) - (props.minValue ?? 0);
  const progress = isDeterminate
    ? range === 0
      ? 0
      : ((props.value ?? 0) - (props.minValue ?? 0)) / range
    : 0;

  const classes = progressCircle({ tone, size });

  const ctx = useMemo(
    () => ({ tone, numSize, isDeterminate, progress, classes }),
    [tone, numSize, isDeterminate, progress, classes],
  );

  return (
    <ProgressCircleContext.Provider value={ctx}>
      <view
        className={clsx(classes.root, props.className)}
        style={{ width: `${numSize}px`, height: `${numSize}px` }}
      >
        {props.children}
      </view>
    </ProgressCircleContext.Provider>
  );
}

function Track() {
  return null;
}

function Range() {
  const { numSize, isDeterminate, progress, classes } = useProgressCircleCtx();

  if (!isDeterminate) {
    return <IndeterminateRange numSize={numSize} classes={classes} />;
  }

  return <DeterminateRange numSize={numSize} progress={progress} classes={classes} />;
}

type Classes = ReturnType<typeof progressCircle>;

function DeterminateRange({
  numSize,
  progress,
  classes,
}: {
  numSize: number;
  progress: number;
  classes: Classes;
}) {
  const rangeRef = useMainThreadRef<MainThread.Element>(null);
  const startCapRef = useMainThreadRef<MainThread.Element>(null);
  const endCapRef = useMainThreadRef<MainThread.Element>(null);
  const prevProgressRef = useMainThreadRef<number>(progress);
  const cancelRef = useMainThreadRef<(() => void) | null>(null);

  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;

  // Initial angle for first render
  const initialAngle = progress * 360;
  const initialClipPath = pieClipPath(numSize, initialAngle);
  const initialEndRad = (initialAngle * Math.PI) / 180;

  // Start animation on main thread when progress changes
  const startAnimation = (newProgress: number) => {
    "main thread";

    cancelRef.current?.();

    const from = prevProgressRef.current ?? 0;
    const { cancel } = animateDeterminateProgress(
      from,
      newProgress,
      numSize,
      rangeRef.current,
      startCapRef.current,
      endCapRef.current,
    );
    cancelRef.current = cancel;
    prevProgressRef.current = newProgress;
  };

  useEffect(() => {
    startAnimation(progress);

    return () => {
      const cleanup = () => {
        "main thread";
        cancelRef.current?.();
      };
      cleanup();
    };
  }, [progress]);

  return (
    <>
      <view
        main-thread:ref={rangeRef}
        className={classes.range}
        style={{
          position: "absolute",
          width: `${numSize}px`,
          height: `${numSize}px`,
          borderRadius: "50%",
          clipPath: initialClipPath,
        }}
      />
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

function IndeterminateRange({ numSize, classes }: { numSize: number; classes: Classes }) {
  const containerRef = useMainThreadRef<MainThread.Element>(null);
  const rangeRef = useMainThreadRef<MainThread.Element>(null);
  const headCapRef = useMainThreadRef<MainThread.Element>(null);
  const tailCapRef = useMainThreadRef<MainThread.Element>(null);
  const subIdRef = useMainThreadRef<number>(-1);

  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;

  // Subscribe to shared animation loop on mount
  const startLoop = () => {
    "main thread";

    subIdRef.current = subscribeIndeterminate({
      containerRef: containerRef.current,
      rangeRef: rangeRef.current,
      headCapRef: headCapRef.current,
      tailCapRef: tailCapRef.current,
      numSize,
    });
  };

  const stopLoop = () => {
    "main thread";

    if (subIdRef.current >= 0) {
      unsubscribeIndeterminate(subIdRef.current);
      subIdRef.current = -1;
    }
  };

  useEffect(() => {
    startLoop();
    return () => {
      stopLoop();
    };
  }, []);

  // Initial state for first render (t=0)
  const initial = sampleIndeterminate(0);
  const initialClipPath = pieClipPath(numSize, initial.arcLength);

  const tailCapX = halfSize - capSize / 2;
  const tailCapY = halfSize - ringCenterR - capSize / 2;
  const headRad = (initial.arcLength * Math.PI) / 180;
  const headCapX = halfSize + ringCenterR * Math.sin(headRad) - capSize / 2;
  const headCapY = halfSize - ringCenterR * Math.cos(headRad) - capSize / 2;

  return (
    <view
      main-thread:ref={containerRef}
      style={{
        position: "absolute",
        width: `${numSize}px`,
        height: `${numSize}px`,
        transform: `rotate(${initial.containerDeg}deg)`,
      }}
    >
      <view
        main-thread:ref={rangeRef}
        className={classes.range}
        style={{
          position: "absolute",
          width: `${numSize}px`,
          height: `${numSize}px`,
          borderRadius: "50%",
          clipPath: initialClipPath,
        }}
      />
      <view
        main-thread:ref={tailCapRef}
        className={classes.cap}
        style={{
          width: `${capSize}px`,
          height: `${capSize}px`,
          left: `${tailCapX}px`,
          top: `${tailCapY}px`,
        }}
      />
      <view
        main-thread:ref={headCapRef}
        className={classes.cap}
        style={{
          width: `${capSize}px`,
          height: `${capSize}px`,
          left: `${headCapX}px`,
          top: `${headCapY}px`,
        }}
      />
    </view>
  );
}

export const ProgressCircle = {
  Root,
  Track,
  Range,
};
