import { createContext, useContext, useEffect, useMemo, useRef, useState } from "@lynx-js/react";
import clsx from "clsx";
import { progressCircle } from "./recipes/progress-circle";
import type { ProgressCircleVariantProps } from "./recipes/progress-circle";

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

function useProgressCircle() {
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

const DURATION = 1200;

interface IndeterminateState {
  containerDeg: number;
  rightDeg: number;
  leftDeg: number;
  headCapDeg: number;
}

function sampleIndeterminate(t: number): IndeterminateState {
  const containerEased = cubicBezier(t, 0.35, 0.25, 0.65, 0.75);
  const headEased = cubicBezier(t, 0.35, 0, 0.65, 1);
  const tailEased = cubicBezier(t, 0.35, 0, 0.65, 0.6);

  const headLength = headEased <= 0.75 ? (headEased / 0.75) * 360 : 360;
  const tailOffset = tailEased <= 1 / 3 ? 0 : ((tailEased - 1 / 3) / (2 / 3)) * 360;
  const arcLength = Math.max(0, headLength - tailOffset);
  const containerDeg = containerEased * 360 + tailOffset;

  let rightDeg: number;
  let leftDeg: number;
  if (arcLength <= 180) {
    rightDeg = 180 + arcLength;
    leftDeg = 180;
  } else {
    rightDeg = 360;
    leftDeg = 180 + (arcLength - 180);
  }

  return { containerDeg, rightDeg, leftDeg, headCapDeg: arcLength };
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

  const progress = isDeterminate
    ? ((props.value ?? 0) - (props.minValue ?? 0)) / ((props.maxValue ?? 1) - (props.minValue ?? 0))
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

function Range() {
  const { numSize, isDeterminate, progress, classes } = useProgressCircle();

  if (!isDeterminate) {
    return <IndeterminateRange numSize={numSize} classes={classes} />;
  }

  return <DeterminateRange numSize={numSize} progress={progress} classes={classes} />;
}

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
  const { leftDegree, rightDegree } = determinateDegrees(animatedProgress);
  const showCaps = true;
  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;

  return (
    <>
      <HalfCircle side="LEFT" size={numSize} degree={leftDegree} classes={classes} />
      <HalfCircle side="RIGHT" size={numSize} degree={rightDegree} classes={classes} />
      {showCaps && (
        <>
          <RoundCap
            angle={0}
            halfSize={halfSize}
            ringCenterR={ringCenterR}
            capSize={capSize}
            capClass={classes.cap}
          />
          <RoundCap
            angle={animatedProgress * 360}
            halfSize={halfSize}
            ringCenterR={ringCenterR}
            capSize={capSize}
            capClass={classes.cap}
          />
        </>
      )}
    </>
  );
}

export const ProgressCircle = {
  Root,
  Track,
  Range,
};

type Classes = ReturnType<typeof progressCircle>;

function IndeterminateRange({ numSize, classes }: { numSize: number; classes: Classes }) {
  const anim = useIndeterminateAnimation();
  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSz = halfSize - innerR;

  const headRad = (anim.headCapDeg * Math.PI) / 180;
  const headCapX = halfSize + ringCenterR * Math.sin(headRad) - capSz / 2;
  const headCapY = halfSize - ringCenterR * Math.cos(headRad) - capSz / 2;

  const tailCapX = halfSize - capSz / 2;
  const tailCapY = halfSize - ringCenterR - capSz / 2;

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
        className={classes.halfContainer}
        style={{ width: `${halfSize}px`, height: `${numSize}px`, position: "absolute", right: 0 }}
      >
        <view
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "flex-end",
            right: 0,
            width: `${numSize}px`,
            height: `${numSize}px`,
            transform: `rotate(${anim.rightDeg}deg)`,
          }}
        >
          <view
            className={classes.range}
            style={{ width: `${halfSize}px`, height: `${numSize}px` }}
          />
        </view>
      </view>

      <view
        className={classes.halfContainer}
        style={{ width: `${halfSize}px`, height: `${numSize}px`, position: "absolute", left: 0 }}
      >
        <view
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "flex-start",
            left: 0,
            width: `${numSize}px`,
            height: `${numSize}px`,
            transform: `rotate(${anim.leftDeg}deg)`,
          }}
        >
          <view
            className={classes.range}
            style={{ width: `${halfSize}px`, height: `${numSize}px` }}
          />
        </view>
      </view>

      <view
        className={classes.cap}
        style={{
          width: `${capSz}px`,
          height: `${capSz}px`,
          left: `${tailCapX}px`,
          top: `${tailCapY}px`,
        }}
      />
      <view
        className={classes.cap}
        style={{
          width: `${capSz}px`,
          height: `${capSz}px`,
          left: `${headCapX}px`,
          top: `${headCapY}px`,
        }}
      />
    </view>
  );
}

interface HalfCircleProps {
  size: number;
  side: "LEFT" | "RIGHT";
  degree?: number;
  classes: Classes;
}

function HalfCircle({ size, side, degree, classes }: HalfCircleProps) {
  return (
    <view className={classes.halfContainer} style={{ width: `${size / 2}px`, height: `${size}px` }}>
      <view
        className={classes.halfRotator(side)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          ...(degree !== undefined ? { transform: `rotate(${degree}deg)` } : {}),
        }}
      >
        <view className={classes.range} style={{ width: `${size / 2}px`, height: `${size}px` }} />
      </view>
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

function determinateDegrees(progress: number) {
  let leftDegree = 180;
  let rightDegree = 180;

  if (progress <= 0.5) {
    rightDegree = 180 + (360 - 180) * (progress / 0.5);
  } else {
    rightDegree = 0;
    leftDegree = 180 + (360 - 180) * ((progress - 0.5) / 0.5);
  }

  return { leftDegree, rightDegree };
}
