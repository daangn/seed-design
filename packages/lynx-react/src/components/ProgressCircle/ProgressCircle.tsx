import type * as React from "@lynx-js/react";
import {
  forwardRef,
  runOnMainThread,
  useEffect,
  useMemo,
  useMainThreadRef,
  type MainThreadRef,
} from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import clsx from "clsx";
import { progressCircle } from "@seed-design/lynx-css/recipes/progress-circle";
import type {
  ProgressCircleSlotName,
  ProgressCircleVariantProps,
} from "@seed-design/lynx-css/recipes/progress-circle";
import {
  ProgressCircleProvider,
  ProgressCircleTrack as HeadlessProgressCircleTrack,
  useProgress,
  useProgressCircleContext,
  type UseProgressCircleContext,
  type UseProgressProps,
} from "@seed-design/lynx-react-progress";
import type { LynxAccessibilityProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";

////////////////////////////////////////////////////////////////////////////////////

type Classes = Record<ProgressCircleSlotName, string>;

interface StyledProgressCircleContextValue extends UseProgressCircleContext {
  mainThreadProgress?: MainThreadRef<MainThreadProgress>;
  numSize: number;
  classes: Classes;
}

function isStyledProgressCircleContext(
  context: UseProgressCircleContext,
): context is StyledProgressCircleContextValue {
  return "classes" in context;
}

function useStyledProgressCircleContext(consumer: string): StyledProgressCircleContextValue {
  const context = useProgressCircleContext();
  if (!isStyledProgressCircleContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <ProgressCircleRoot/>.`);
  }
  return context;
}

////////////////////////////////////////////////////////////////////////////////////

// --- Background-thread-only utilities (for initial render) ---

function computeRingGeometry(numSize: number) {
  const halfSize = numSize / 2;
  const innerR = 0.53 * Math.SQRT2 * halfSize;
  const ringCenterR = (halfSize + innerR) / 2;
  const capSize = halfSize - innerR;
  return { halfSize, innerR, ringCenterR, capSize };
}

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

////////////////////////////////////////////////////////////////////////////////////

// --- Animation constants ---

const INDETERMINATE_DURATION = 1200;
const INDETERMINATE_INITIAL_PHASE = 1 / 6;
const TRANSITION_DURATION = 300;

////////////////////////////////////////////////////////////////////////////////////

// --- Components ---

interface MainThreadProgress {
  value: number;
  onChange?: (value: number) => void;
}

export interface ProgressCircleRootProps
  extends ProgressCircleVariantProps,
    UseProgressProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  /**
   * @platform Lynx
   * MT에서 value와 같은 척도로 원호를 즉시 갱신하는 단일 구독 채널입니다.
   * determinate일 때 BG value보다 우선하며 indeterminate·unmount 때 구독을 해제합니다.
   */
  mainThreadProgress?: MainThreadRef<MainThreadProgress>;
}

export type RootProps = ProgressCircleRootProps;

////////////////////////////////////////////////////////////////////////////////////

/**
 * `@seed-design/lynx-react-progress`의 진행률·접근성 위에 SEED recipe와 Lynx 전용 원형 표현을 조립한다.
 *
 * Lynx에서 SVG를 사용할 수 없어 CSS clip-path 기반 pie sector로 구현.
 *
 * **Known Issues:**
 * - clip-path가 Lynx에서 animatable이 아니라 JS RAF로 매 프레임 SVG path 생성
 * - Lynx main thread에서 모듈 레벨 Map 미지원으로 인스턴스 간 RAF 공유 불가
 * - 다수 인스턴스 동시 렌더링 시 성능 저하 가능
 *
 * Lynx SVG + stroke-dasharray 지원 시 CSS-only 애니메이션으로 전환 예정.
 */
export const ProgressCircleRoot = forwardRef<unknown, ProgressCircleRootProps>((props, ref) => {
  const [variantProps, otherProps] = progressCircle.splitVariantProps(props);
  const {
    children,
    className,
    style,
    minValue,
    maxValue,
    value,
    mainThreadProgress,
    ...nativeProps
  } = otherProps;
  const size = variantProps.size ?? "40";
  const tone = variantProps.tone ?? "neutral";
  const numSize = Number(size);

  const api = useProgress({ value, minValue, maxValue });
  const classes = useMemo(() => progressCircle({ tone, size }), [tone, size]);
  const contextValue = useMemo<StyledProgressCircleContextValue>(
    () => ({ ...api, numSize, classes, mainThreadProgress }),
    [api, numSize, classes, mainThreadProgress],
  );

  return (
    <ProgressCircleProvider value={contextValue}>
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, api.rootProps, nativeProps)}
        className={clsx(classes.root, className)}
        style={{ ...style, width: `${numSize}px`, height: `${numSize}px` }}
      >
        {children}
      </view>
    </ProgressCircleProvider>
  );
});

////////////////////////////////////////////////////////////////////////////////////

export interface ProgressCircleTrackProps
  extends Pick<LynxStyledElementProps, "className" | "style"> {}

/**
 * 진행률과 관계없이 전체 링을 tone의 트랙 색으로 그린다. Range보다 먼저 렌더링한다.
 */
export const ProgressCircleTrack = forwardRef<unknown, ProgressCircleTrackProps>((props, ref) => {
  const { className, ...nativeProps } = props;
  const { classes } = useStyledProgressCircleContext("ProgressCircleTrack");

  return (
    <HeadlessProgressCircleTrack
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.track, className)}
    />
  );
});

////////////////////////////////////////////////////////////////////////////////////

export const ProgressCircleRange = () => {
  const { numSize, indeterminate, percent, classes, minValue, maxValue, mainThreadProgress } =
    useStyledProgressCircleContext("ProgressCircleRange");

  if (indeterminate) {
    return <IndeterminateRange numSize={numSize} classes={classes} />;
  }

  return (
    <DeterminateRange
      numSize={numSize}
      progress={percent / 100}
      classes={classes}
      minValue={minValue}
      maxValue={maxValue}
      mainThreadProgress={mainThreadProgress}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////////

function DeterminateRange({
  numSize,
  progress,
  classes,
  minValue,
  maxValue,
  mainThreadProgress,
}: {
  numSize: number;
  progress: number;
  classes: Classes;
  minValue: number;
  maxValue: number;
  mainThreadProgress?: MainThreadRef<MainThreadProgress>;
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

////////////////////////////////////////////////////////////////////////////////////

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
    const startTs = Date.now();

    function tick(): void {
      const elapsed = Date.now() - startTs;
      const t =
        ((elapsed + INDETERMINATE_DURATION * INDETERMINATE_INITIAL_PHASE) %
          INDETERMINATE_DURATION) /
        INDETERMINATE_DURATION;
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

  const initialState = bgSampleIndeterminate(INDETERMINATE_INITIAL_PHASE);
  const initialClipPath = bgPieClipPath(numSize, initialState.arcLength);
  const initialHeadRad = (initialState.arcLength * Math.PI) / 180;

  return (
    <view
      main-thread:ref={containerRef}
      style={{
        position: "absolute",
        width: `${numSize}px`,
        height: `${numSize}px`,
        transform: `rotate(${initialState.containerDeg}deg)`,
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
          left: `${halfSize + ringCenterR * Math.sin(initialHeadRad) - capSize / 2}px`,
          top: `${halfSize - ringCenterR * Math.cos(initialHeadRad) - capSize / 2}px`,
        }}
      />
    </view>
  );
}

ProgressCircleRoot.displayName = "ProgressCircleRoot";
ProgressCircleTrack.displayName = "ProgressCircleTrack";
ProgressCircleRange.displayName = "ProgressCircleRange";
