import type * as React from "@lynx-js/react";
import {
  createContext,
  runOnMainThread,
  useContext,
  useEffect,
  useMemo,
  useMainThreadRef,
} from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import clsx from "clsx";
import { progressCircle } from "@seed-design/lynx-css/recipes/progress-circle";
import type { ProgressCircleVariantProps } from "@seed-design/lynx-css/recipes/progress-circle";

type Tone = "neutral" | "brand" | "staticWhite" | "inherit";
type Size = "14" | "16" | "18" | "24" | "40";

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

// --- Background-thread-only utilities (for initial render) ---

function computeRingGeometry(numSize: number) {
  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;
  return { halfSize, innerR, ringCenterR, capSize };
}

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

function sampleIndeterminate(t: number) {
  "main thread";
  const containerEased = cubicBezier(t, 0.35, 0.25, 0.65, 0.75);
  const headEased = cubicBezier(t, 0.35, 0, 0.65, 1);
  const tailEased = cubicBezier(t, 0.35, 0, 0.65, 0.6);

  const headLength = headEased <= 0.75 ? (headEased / 0.75) * 360 : 360;
  const tailOffset = tailEased <= 1 / 3 ? 0 : ((tailEased - 1 / 3) / (2 / 3)) * 360;
  const arcLength = Math.max(0, headLength - tailOffset);
  const containerDeg = containerEased * 360 + tailOffset;

  return { containerDeg, arcLength };
}

// --- Animation constants ---

const INDETERMINATE_DURATION = 1200;
const TRANSITION_DURATION = 300;

// --- Components ---

export interface ProgressCircleRootProps extends ProgressCircleVariantProps {
  minValue?: number;
  maxValue?: number;
  value?: number;
  children?: React.ReactNode;
  className?: string;
}

export type RootProps = ProgressCircleRootProps;

/**
 * Lynx에서 SVG를 사용할 수 없어 CSS clip-path 기반 pie sector로 구현.
 *
 * **Known Issues:**
 * - clip-path가 Lynx에서 animatable이 아니라 JS RAF로 매 프레임 SVG path 생성
 * - Lynx main thread에서 모듈 레벨 Map 미지원으로 인스턴스 간 RAF 공유 불가
 * - 다수 인스턴스 동시 렌더링 시 성능 저하 가능
 *
 * Lynx SVG + stroke-dasharray 지원 시 CSS-only 애니메이션으로 전환 예정.
 */
export const ProgressCircleRoot = (props: ProgressCircleRootProps) => {
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
};

export const ProgressCircleRange = () => {
  const { numSize, isDeterminate, progress, classes } = useProgressCircleCtx();

  if (!isDeterminate) {
    return <IndeterminateRange numSize={numSize} classes={classes} />;
  }

  return <DeterminateRange numSize={numSize} progress={progress} classes={classes} />;
};

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
  const cancelRef = useMainThreadRef<number>(0);

  const { halfSize, ringCenterR, capSize } = computeRingGeometry(numSize);

  const initialAngle = progress * 360;
  const initialClipPath = bgPieClipPath(numSize, initialAngle);
  const initialEndRad = (initialAngle * Math.PI) / 180;

  function startAnimation(newProgress: number) {
    "main thread";

    if (cancelRef.current) {
      cancelAnimationFrame(cancelRef.current);
      cancelRef.current = 0;
    }

    const from = prevProgressRef.current ?? 0;
    prevProgressRef.current = newProgress;
    if (from === newProgress) return;

    const rangeEl = rangeRef.current;
    const endCapEl = endCapRef.current;
    let startTs = 0;

    function applyProgress(p: number): void {
      const angleDeg = p * 360;
      const cp = pieClipPath(numSize, angleDeg);
      if (cp) {
        rangeEl?.setStyleProperty("clip-path", cp);
      } else {
        rangeEl?.setStyleProperty("clip-path", "none");
      }

      const rad = (angleDeg * Math.PI) / 180;
      endCapEl?.setStyleProperties({
        left: `${halfSize + ringCenterR * Math.sin(rad) - capSize / 2}px`,
        top: `${halfSize - ringCenterR * Math.cos(rad) - capSize / 2}px`,
      });
    }

    function step(ts: number): void {
      if (!startTs) startTs = Number(ts);
      const elapsed = ts - startTs;
      if (elapsed >= TRANSITION_DURATION) {
        applyProgress(newProgress);
        cancelRef.current = 0;
        return;
      }
      const t = elapsed / TRANSITION_DURATION;
      const eased = cubicBezier(t, 0, 0, 0.15, 1);
      applyProgress(from + (newProgress - from) * eased);
      cancelRef.current = requestAnimationFrame(step);
    }

    applyProgress(from);
    cancelRef.current = requestAnimationFrame(step);
  }

  function cancelAnimation() {
    "main thread";
    if (cancelRef.current) {
      cancelAnimationFrame(cancelRef.current);
      cancelRef.current = 0;
    }
  }

  useEffect(() => {
    runOnMainThread(startAnimation)(progress);
    return () => {
      runOnMainThread(cancelAnimation)();
    };
  }, [progress, numSize]);

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
  const rafIdRef = useMainThreadRef<number>(0);

  const { halfSize, ringCenterR, capSize } = computeRingGeometry(numSize);

  function startLoop() {
    "main thread";

    const containerEl = containerRef.current;
    const rangeEl = rangeRef.current;
    const headCapEl = headCapRef.current;
    let startTs = 0;

    function tick(ts: number): void {
      if (!startTs) startTs = Number(ts);

      const elapsed = ts - startTs;
      const t = (elapsed % INDETERMINATE_DURATION) / INDETERMINATE_DURATION;
      const state = sampleIndeterminate(t);

      containerEl?.setStyleProperty("transform", `rotate(${state.containerDeg}deg)`);

      const clipPath = pieClipPath(numSize, state.arcLength);
      if (clipPath) {
        rangeEl?.setStyleProperty("clip-path", clipPath);
      } else {
        rangeEl?.setStyleProperty("clip-path", "none");
      }

      const headRad = (state.arcLength * Math.PI) / 180;
      headCapEl?.setStyleProperties({
        left: `${halfSize + ringCenterR * Math.sin(headRad) - capSize / 2}px`,
        top: `${halfSize - ringCenterR * Math.cos(headRad) - capSize / 2}px`,
      });
      rafIdRef.current = requestAnimationFrame(tick);
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }

  function stopLoop() {
    "main thread";
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }
  }

  useEffect(() => {
    runOnMainThread(startLoop)();
    return () => {
      runOnMainThread(stopLoop)();
    };
  }, [numSize]);

  const initialClipPath = 'path("M 0 0 Z")';

  return (
    <view
      main-thread:ref={containerRef}
      style={{
        position: "absolute",
        width: `${numSize}px`,
        height: `${numSize}px`,
        transform: "rotate(0deg)",
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
          left: `${halfSize - capSize / 2}px`,
          top: `${halfSize - ringCenterR - capSize / 2}px`,
        }}
      />
      <view
        main-thread:ref={headCapRef}
        className={classes.cap}
        style={{
          width: `${capSize}px`,
          height: `${capSize}px`,
          left: `${halfSize - capSize / 2}px`,
          top: `${halfSize - ringCenterR - capSize / 2}px`,
        }}
      />
    </view>
  );
}

ProgressCircleRoot.displayName = "ProgressCircleRoot";
ProgressCircleRange.displayName = "ProgressCircleRange";
