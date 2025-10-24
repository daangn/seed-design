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
    Omit<React.HTMLAttributes<HTMLSpanElement>, "dir"> {}

export const SliderRoot = React.forwardRef<HTMLSpanElement, SliderRootProps>(
  (
    {
      disabled,
      name,
      form,
      dir,
      min,
      max,
      step,
      minStepsBetweenThumbs,
      values,
      defaultValues,
      onValuesChange,
      onValuesCommit,
      ...props
    },
    ref,
  ) => {
    const api = useSlider({
      defaultValues,
      dir,
      disabled,
      form,
      max,
      min,
      minStepsBetweenThumbs,
      name,
      onValuesChange,
      onValuesCommit,
      step,
      values,
    });

    return (
      <SliderProvider value={api}>
        <Primitive.span
          ref={composeRefs(ref, api.refs.slider)}
          {...mergeProps(api.rootProps, props)}
        />
      </SliderProvider>
    );
  },
);
SliderRoot.displayName = "SliderRoot";

export interface SliderRangeProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {}

export const SliderRange = React.forwardRef<HTMLSpanElement, SliderRangeProps>((props, ref) => {
  const { getRangeProps } = useSliderContext();
  const rangeProps = getRangeProps();

  return <Primitive.span ref={ref} {...mergeProps(rangeProps, props)} />;
});
SliderRange.displayName = "SliderRange";

export interface SliderThumbProps extends PrimitiveProps, React.HTMLAttributes<HTMLSpanElement> {
  thumbIndex: number;
}

export const SliderThumb = React.forwardRef<HTMLSpanElement, SliderThumbProps>(
  ({ thumbIndex, ...props }, ref) => {
    const { getThumbProps, getThumbPositionProps, refs } = useSliderContext();
    const thumbProps = getThumbProps(thumbIndex);
    const positionProps = getThumbPositionProps(thumbIndex);

    // Create a callback ref to add/remove thumb from Set
    const handleThumbRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        if (node) {
          refs.thumbs.current.add(node);
        } else {
          // Clean up when unmounting - we need to iterate to find and remove
          refs.thumbs.current.forEach((thumb) => {
            // Check if this thumb is being unmounted by checking if it's still in DOM
            if (!document.body.contains(thumb)) {
              refs.thumbs.current.delete(thumb);
            }
          });
        }
      },
      [refs.thumbs],
    );

    return (
      <Primitive.span
        ref={composeRefs(ref, handleThumbRef)}
        {...mergeProps(thumbProps, positionProps, props)}
      />
    );
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
