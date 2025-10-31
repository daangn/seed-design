import { slider, type SliderVariantProps } from "@seed-design/css/recipes/slider";
import { sliderTick, type SliderTickVariantProps } from "@seed-design/css/recipes/slider-tick";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Slider, useSliderContext } from "@seed-design/react-slider";
import { forwardRef, useRef, type HTMLAttributes } from "react";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import clsx from "clsx";
import { mergeProps } from "@seed-design/dom-utils";
import { useFieldContext } from "@seed-design/react-field";

const { withContext, ClassNamesProvider, useClassNames } = createSlotRecipeContext(slider);
const { PropsProvider: TickPropsProvider, useProps: useTickProps } =
  createRecipeContext(sliderTick);

const withFieldStateProps = createWithStateProps([{ useContext: useFieldContext, strict: false }]);
const withStateProps = createWithStateProps([
  useSliderContext,
  { useContext: useFieldContext, strict: false },
]);

export interface SliderRootProps
  extends SliderVariantProps,
    SliderTickVariantProps,
    Slider.RootProps {}

export const SliderRoot = forwardRef<HTMLDivElement, SliderRootProps>(
  ({ className, ...props }, ref) => {
    const [{ slider: sliderVariantProps, sliderTick: sliderTickVariantProps }, otherProps] =
      splitMultipleVariantsProps(props, { slider, sliderTick });

    const classNames = slider(sliderVariantProps);

    return (
      <TickPropsProvider value={sliderTickVariantProps}>
        <ClassNamesProvider value={classNames}>
          <Slider.Root ref={ref} className={clsx(classNames.root, className)} {...otherProps} />
        </ClassNamesProvider>
      </TickPropsProvider>
    );
  },
);

export interface SliderControlProps extends PrimitiveProps, HTMLAttributes<HTMLDivElement> {}

export const SliderControl = withContext<HTMLDivElement, SliderControlProps>(
  withStateProps(Primitive.div),
  "control",
);

export interface SliderTrackProps extends PrimitiveProps, HTMLAttributes<HTMLDivElement> {}

export const SliderTrack = withContext<HTMLDivElement, SliderTrackProps>(
  withStateProps(Primitive.div),
  "track",
);

export interface SliderRangeProps extends Slider.RangeProps {}

export const SliderRange = withContext<HTMLDivElement, SliderRangeProps>(
  withFieldStateProps(Slider.Range),
  "range",
);

export interface SliderThumbProps extends Slider.ThumbProps {}

export const SliderThumb = forwardRef<HTMLDivElement, Slider.ThumbProps>(
  ({ thumbIndex, className, ...props }, ref) => {
    const classNames = useClassNames();

    const fieldContext = useFieldContext({ strict: false });

    // intentionally omits Field stateProps here because each thumb is styled individually
    const mergedProps = mergeProps(fieldContext?.inputAriaAttributes ?? {}, props);

    return (
      <Slider.Thumb
        ref={ref}
        className={clsx(classNames.thumb, className)}
        thumbIndex={thumbIndex}
        {...mergedProps}
      />
    );
  },
);

export interface SliderHiddenInputProps extends Slider.HiddenInputProps {}

export const SliderHiddenInput = Slider.HiddenInput;

export interface SliderTickProps extends SliderTickVariantProps, Slider.TickProps {}

export const SliderTick = forwardRef<HTMLDivElement, SliderTickProps>(
  ({ value, ...props }, ref) => {
    const parentVariantProps = useTickProps();

    const [variantProps, { className, ...otherProps }] = sliderTick.splitVariantProps(props);
    const recipeClassName = sliderTick(mergeProps(parentVariantProps, variantProps));

    return (
      <Slider.Tick
        value={value}
        ref={ref}
        className={clsx(recipeClassName, className)}
        {...otherProps}
      />
    );
  },
);

export interface SliderMarkersProps extends PrimitiveProps, HTMLAttributes<HTMLDivElement> {}

export const SliderMarkers = withContext<HTMLDivElement, SliderMarkersProps>(
  withStateProps(Primitive.div),
  "markers",
);

export interface SliderMarkerProps extends Slider.MarkerProps {}

export const SliderMarker = withContext<HTMLDivElement, SliderMarkerProps>(
  withFieldStateProps(Slider.Marker),
  "marker",
);

export interface SliderTooltipProps extends PrimitiveProps, Slider.TooltipRootProps {
  /**
   * @default 2
   */
  tipRadius?: number;

  thumbIndex: number;
}

export const SliderTooltip = forwardRef<HTMLDivElement, SliderTooltipProps>(
  ({ thumbIndex, tipRadius = 2, className, ...props }, ref) => {
    const classNames = useClassNames();

    const arrowRef = useRef<HTMLDivElement>(null);

    const width = 10;
    const height = 7;

    const pathData = `M0,0
      H${width}
      L${width / 2 + tipRadius},${height - tipRadius}
      Q${width / 2},${height} ${width / 2 - tipRadius},${height - tipRadius}
      Z`;

    return (
      <Slider.TooltipRoot
        thumbIndex={thumbIndex}
        ref={ref}
        className={clsx(classNames.tooltipRoot, className)}
        {...props}
      >
        <Primitive.div ref={arrowRef} className={classNames.tooltipArrow}>
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
            className={classNames.tooltipArrowTip}
          >
            <path stroke="none" d={pathData} />
          </svg>
        </Primitive.div>
        <Slider.TooltipLabel thumbIndex={thumbIndex} />
      </Slider.TooltipRoot>
    );
  },
);
SliderTooltip.displayName = "SliderTooltip";
