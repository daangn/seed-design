import type * as React from "@lynx-js/react";
import clsx from "clsx";
import { mergeProps } from "../../utils/merge-props";
import { forwardRef, useMemo, type MainThreadRef } from "@lynx-js/react";
import {
  progressCircle,
  type ProgressCircleSlotName,
  type ProgressCircleVariantProps,
} from "@seed-design/lynx-css/recipes/progress-circle";
import {
  ProgressCircleProvider,
  ProgressCircleTrack as HeadlessProgressCircleTrack,
  useProgress,
  useProgressCircleContext,
  type UseProgressCircleContext,
  type UseProgressProps,
} from "@seed-design/lynx-react-progress";
import type { LynxHostProps, LynxViewRef } from "../../types";
export type Classes = Record<ProgressCircleSlotName, string>;

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

export function useStyledProgressCircleContext(consumer: string): StyledProgressCircleContextValue {
  const context = useProgressCircleContext();
  if (!isStyledProgressCircleContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <ProgressCircleRoot/>.`);
  }
  return context;
}

export interface MainThreadProgress {
  value: number;
  onChange?: (value: number) => void;
}

export interface ProgressCircleRootProps
  extends ProgressCircleVariantProps,
    UseProgressProps,
    Omit<LynxHostProps<"view">, keyof UseProgressProps> {
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
 * Lynx에서 SVG를 사용할 수 없어 고정 clip-path로 링을 그린다.
 * Indeterminate는 반원·cap의 transform을 엔진에서 보간하고,
 * determinate는 Main Thread에서 pie sector를 갱신한다.
 */
export const ProgressCircleRoot = /* @__PURE__ */ forwardRef<unknown, ProgressCircleRootProps>(
  (props, ref) => {
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
          style={{ width: `${numSize}px`, height: `${numSize}px`, ...style }}
        >
          {children}
        </view>
      </ProgressCircleProvider>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface ProgressCircleTrackProps extends LynxHostProps<"view"> {}

/**
 * 진행률과 관계없이 전체 링을 tone의 트랙 색으로 그린다. Range보다 먼저 렌더링한다.
 */
export const ProgressCircleTrack = /* @__PURE__ */ forwardRef<unknown, ProgressCircleTrackProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const { classes } = useStyledProgressCircleContext("ProgressCircleTrack");

    return (
      <HeadlessProgressCircleTrack
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes.track, className)}
      >
        {children}
      </HeadlessProgressCircleTrack>
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface ProgressCircleRangeProps extends LynxHostProps<"view"> {}

ProgressCircleRoot.displayName = "ProgressCircleRoot";
ProgressCircleTrack.displayName = "ProgressCircleTrack";
