"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { useSlider, type UseSliderProps } from "./useSlider";
import { SliderProvider, useSliderContext } from "./useSliderContext";
import { composeRefs } from "@radix-ui/react-compose-refs";

export interface SliderRootProps
  extends UseSliderProps,
    PrimitiveProps,
    // UseSliderProps takes dir to determine start/end
    Omit<React.HTMLAttributes<HTMLDivElement>, "dir"> {}

export const SliderRoot = React.forwardRef<HTMLDivElement, SliderRootProps>(
  (
    {
      allowedValues,
      defaultValues,
      dir,
      disabled,
      dragStartDelayInMilliseconds,
      getAriaLabel,
      getAriaValuetext,
      getAriaLabelledby,
      getTooltipChildren,
      invalid,
      max,
      min,
      minStepsBetweenThumbs,
      jumpMultiplier,
      name,
      onValuesChange,
      onValuesCommit,
      readOnly,
      step,
      values,
      ...props
    },
    ref,
  ) => {
    const api = useSlider({
      allowedValues,
      defaultValues,
      dir,
      disabled,
      dragStartDelayInMilliseconds,
      getAriaLabel,
      getAriaValuetext,
      getAriaLabelledby,
      getTooltipChildren,
      invalid,
      max,
      min,
      minStepsBetweenThumbs,
      jumpMultiplier,
      name,
      onValuesChange,
      onValuesCommit,
      readOnly,
      step,
      values,
    });

    return (
      <SliderProvider value={api}>
        <Primitive.div
          ref={composeRefs(ref, api.refs.root)}
          {...mergeProps(api.rootProps, props)}
        />
      </SliderProvider>
    );
  },
);
SliderRoot.displayName = "SliderRoot";

export interface SliderRangeProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const SliderRange = React.forwardRef<HTMLDivElement, SliderRangeProps>((props, ref) => {
  const { getRangeProps } = useSliderContext();
  const rangeProps = getRangeProps();

  return <Primitive.div ref={ref} {...mergeProps(rangeProps, props)} />;
});
SliderRange.displayName = "SliderRange";

export interface SliderThumbProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  thumbIndex: number;
}

export const SliderThumb = React.forwardRef<HTMLDivElement, SliderThumbProps>(
  ({ thumbIndex, ...props }, ref) => {
    const { getThumbProps, refs } = useSliderContext();

    const thumbRef = React.useRef<HTMLDivElement>(null);
    const thumbProps = getThumbProps(thumbIndex);

    React.useEffect(() => {
      const node = thumbRef.current;
      if (node) refs.thumbs.current.add(node);

      return () => {
        if (node) refs.thumbs.current.delete(node);
      };
    }, [refs.thumbs]);

    return <Primitive.div ref={composeRefs(ref, thumbRef)} {...mergeProps(thumbProps, props)} />;
  },
);
SliderThumb.displayName = "SliderThumb";

export interface SliderHiddenInputProps
  extends PrimitiveProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  thumbIndex: number;
}

export const SliderHiddenInput = React.forwardRef<HTMLInputElement, SliderHiddenInputProps>(
  ({ thumbIndex, ...props }, ref) => {
    const { getHiddenInputProps } = useSliderContext();
    const hiddenInputProps = getHiddenInputProps(thumbIndex);

    return <Primitive.input ref={ref} {...mergeProps(hiddenInputProps, props)} />;
  },
);
SliderHiddenInput.displayName = "SliderHiddenInput";

export interface SliderTickProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const SliderTick = React.forwardRef<HTMLDivElement, SliderTickProps>(
  ({ value, ...props }, ref) => {
    const { getTickProps } = useSliderContext();
    const tickProps = getTickProps(value);

    return <Primitive.div ref={ref} {...mergeProps(tickProps, props)} />;
  },
);
SliderTick.displayName = "SliderTick";

export interface SliderMarkerProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const SliderMarker = React.forwardRef<HTMLDivElement, SliderMarkerProps>(
  ({ value, ...props }, ref) => {
    const { getMarkerProps } = useSliderContext();
    const markerProps = getMarkerProps(value);

    return <Primitive.div ref={ref} {...mergeProps(markerProps, props)} />;
  },
);
SliderMarker.displayName = "SliderMarker";

export interface SliderTooltipRootProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {
  thumbIndex: number;
}

export const SliderTooltipRoot = React.forwardRef<HTMLDivElement, SliderTooltipRootProps>(
  ({ thumbIndex, ...props }, ref) => {
    const { getTooltipProps } = useSliderContext();
    const { rootProps } = getTooltipProps(thumbIndex);

    return <Primitive.div ref={ref} {...mergeProps(rootProps, props)} />;
  },
);
SliderTooltipRoot.displayName = "SliderTooltipRoot";

export interface SliderTooltipLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {
  thumbIndex: number;
}

export const SliderTooltipLabel = React.forwardRef<HTMLSpanElement, SliderTooltipLabelProps>(
  ({ thumbIndex, ...props }, ref) => {
    const { getTooltipProps } = useSliderContext();
    const { labelProps } = getTooltipProps(thumbIndex);

    return <Primitive.span ref={ref} {...mergeProps(labelProps, props)} />;
  },
);
SliderTooltipLabel.displayName = "SliderTooltipLabel";
