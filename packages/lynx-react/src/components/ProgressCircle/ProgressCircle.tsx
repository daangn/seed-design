import { createContext, useContext, useEffect, useMemo, useRef, useState } from "@lynx-js/react";
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

// --- Pie clip-path generation ---

function pieClipPath(size: number, angleDeg: number): string | undefined {
  if (angleDeg >= 360) return undefined;
  if (angleDeg <= 0) return 'path("M 0 0 Z")';

  const c = size / 2;
  // Use a slightly larger radius so the pie fully covers the donut ring edge
  const r = c + 1;
  const rad = (angleDeg * Math.PI) / 180;
  const endX = c + r * Math.sin(rad);
  const endY = c - r * Math.cos(rad);
  const largeArc = angleDeg > 180 ? 1 : 0;

  return `path("M ${c} ${c} L ${c} ${c - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z")`;
}

// --- Indeterminate animation ---

const DURATION = 1200;

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

function useIndeterminateAnimation(): IndeterminateState {
  const [state, setState] = useState<IndeterminateState>(() => sampleIndeterminate(0));

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const t = ((Date.now() - start) % DURATION) / DURATION;
      setState(sampleIndeterminate(t));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return state;
}

// --- Animated progress (determinate) ---

const TRANSITION_DURATION = 300;

function useAnimatedProgress(target: number): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = Date.now();

    if (rafRef.current) clearInterval(rafRef.current);

    rafRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      if (elapsed >= TRANSITION_DURATION) {
        setDisplay(target);
        if (rafRef.current) clearInterval(rafRef.current);
        rafRef.current = null;
        return;
      }
      const t = elapsed / TRANSITION_DURATION;
      const eased = cubicBezier(t, 0, 0, 0.15, 1);
      setDisplay(fromRef.current + (target - fromRef.current) * eased);
    }, 16);

    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, [target]);

  return display;
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
  const animatedProgress = useAnimatedProgress(progress);
  const angleDeg = animatedProgress * 360;
  const clipPath = pieClipPath(numSize, angleDeg);

  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;

  return (
    <>
      <view
        className={classes.range}
        style={{
          position: "absolute",
          width: `${numSize}px`,
          height: `${numSize}px`,
          borderRadius: "50%",
          clipPath,
        }}
      />
      <RoundCap
        angle={0}
        halfSize={halfSize}
        ringCenterR={ringCenterR}
        capSize={capSize}
        capClass={classes.cap}
      />
      <RoundCap
        angle={angleDeg}
        halfSize={halfSize}
        ringCenterR={ringCenterR}
        capSize={capSize}
        capClass={classes.cap}
      />
    </>
  );
}

function IndeterminateRange({ numSize, classes }: { numSize: number; classes: Classes }) {
  const anim = useIndeterminateAnimation();
  const clipPath = pieClipPath(numSize, anim.arcLength);

  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;

  const headRad = (anim.arcLength * Math.PI) / 180;
  const headCapX = halfSize + ringCenterR * Math.sin(headRad) - capSize / 2;
  const headCapY = halfSize - ringCenterR * Math.cos(headRad) - capSize / 2;

  const tailCapX = halfSize - capSize / 2;
  const tailCapY = halfSize - ringCenterR - capSize / 2;

  return (
    <view
      style={{
        position: "absolute",
        width: `${numSize}px`,
        height: `${numSize}px`,
        transform: `rotate(${anim.containerDeg}deg)`,
      }}
    >
      <view
        className={classes.range}
        style={{
          position: "absolute",
          width: `${numSize}px`,
          height: `${numSize}px`,
          borderRadius: "50%",
          clipPath,
        }}
      />
      <view
        className={classes.cap}
        style={{
          width: `${capSize}px`,
          height: `${capSize}px`,
          left: `${tailCapX}px`,
          top: `${tailCapY}px`,
        }}
      />
      <view
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

interface RoundCapProps {
  halfSize: number;
  ringCenterR: number;
  capSize: number;
  angle: number;
  capClass: string;
}

function RoundCap({ halfSize, ringCenterR, capSize, angle, capClass }: RoundCapProps) {
  const rad = (angle * Math.PI) / 180;
  return (
    <view
      className={capClass}
      style={{
        width: `${capSize}px`,
        height: `${capSize}px`,
        left: `${halfSize + ringCenterR * Math.sin(rad) - capSize / 2}px`,
        top: `${halfSize - ringCenterR * Math.cos(rad) - capSize / 2}px`,
      }}
    />
  );
}

export const ProgressCircle = {
  Root,
  Track,
  Range,
};
