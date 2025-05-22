"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import { useProgress, useProgressCircle, type UseProgressProps } from "./useProgress";
import { ProgressCircleProvider, useProgressCircleContext } from "./useProgressCircleContext";

export interface ProgressCircleRootProps
  extends UseProgressProps,
    PrimitiveProps,
    React.SVGAttributes<SVGSVGElement> {}

export const ProgressCircleRoot = forwardRef<SVGSVGElement, ProgressCircleRootProps>(
  (props, ref) => {
    const { value, maxValue, minValue, ...otherProps } = props;

    const api = useProgressCircle(
      useProgress({
        value,
        maxValue,
        minValue,
      }),
    );
    const mergedProps = mergeProps(api.rootProps as ProgressCircleRootProps, otherProps);

    return (
      <ProgressCircleProvider value={api}>
        <Primitive.svg ref={ref} {...mergedProps} />
      </ProgressCircleProvider>
    );
  },
);
ProgressCircleRoot.displayName = "ProgressCircleRoot";

export interface ProgressCircleTrackProps
  extends PrimitiveProps,
    React.SVGAttributes<SVGCircleElement> {}

export const ProgressCircleTrack = forwardRef<SVGCircleElement, ProgressCircleTrackProps>(
  (props, ref) => {
    const { trackProps } = useProgressCircleContext();
    const mergedProps = mergeProps(trackProps as ProgressCircleTrackProps, props);
    return <Primitive.circle ref={ref} {...mergedProps} />;
  },
);
ProgressCircleTrack.displayName = "ProgressCircleTrack";

export interface ProgressCircleRangeProps
  extends PrimitiveProps,
    React.SVGAttributes<SVGCircleElement> {}

export const ProgressCircleRange = forwardRef<SVGCircleElement, ProgressCircleRangeProps>(
  (props, ref) => {
    const { rangeProps } = useProgressCircleContext();
    const mergedProps = mergeProps(rangeProps as ProgressCircleRangeProps, props);
    return <Primitive.circle ref={ref} {...mergedProps} />;
  },
);
ProgressCircleRange.displayName = "ProgressCircleRange";
