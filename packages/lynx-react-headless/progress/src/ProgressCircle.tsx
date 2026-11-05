import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useProgress, type UseProgressProps } from "./useProgress.js";
import { ProgressCircleProvider, useProgressCircleContext } from "./useProgressCircleContext.js";

type ViewProps = IntrinsicElements["view"];

export interface ProgressCircleRootProps
  extends UseProgressProps,
    Omit<ViewProps, keyof UseProgressProps> {}

/**
 * 스타일 없이 progressbar 접근성을 연결하는 native `<view>`입니다.
 * 하위 요소는 `useProgressCircleContext`로 `indeterminate`·`percent`를 읽어 표현을 그립니다.
 */
export const ProgressCircleRoot = React.forwardRef<unknown, ProgressCircleRootProps>(
  (props, ref) => {
    const { children, value, minValue, maxValue, ...nativeProps } = props;
    const api = useProgress({ value, minValue, maxValue });

    return (
      <ProgressCircleProvider value={api}>
        <view
          {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
          {...api.rootProps}
          {...nativeProps}
        >
          {children}
        </view>
      </ProgressCircleProvider>
    );
  },
);
ProgressCircleRoot.displayName = "ProgressCircleRoot";

export interface ProgressCircleTrackProps extends ViewProps {}

/** 진행률과 관계없이 전체 원을 그리는 무스타일 native `<view>`입니다. */
export const ProgressCircleTrack = React.forwardRef<unknown, ProgressCircleTrackProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useProgressCircleContext();

    return (
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    );
  },
);
ProgressCircleTrack.displayName = "ProgressCircleTrack";

export interface ProgressCircleRangeProps extends ViewProps {}

/** 진행된 부분을 그리는 무스타일 native `<view>`입니다. */
export const ProgressCircleRange = React.forwardRef<unknown, ProgressCircleRangeProps>(
  (props, ref) => {
    const { children, ...nativeProps } = props;
    useProgressCircleContext();

    return (
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    );
  },
);
ProgressCircleRange.displayName = "ProgressCircleRange";
