import { slider, type SliderVariantProps } from "@seed-design/css/recipes/slider";
import { sliderTick, type SliderTickVariantProps } from "@seed-design/css/recipes/slider-tick";
import {
  sliderMarker,
  type SliderMarkerVariantProps,
} from "@seed-design/css/recipes/slider-marker";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Slider, useSliderContext } from "@seed-design/react-slider";
import { forwardRef, type HTMLAttributes } from "react";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { createRecipeContext } from "../../utils/createRecipeContext";
import clsx from "clsx";
import { mergeProps } from "@seed-design/dom-utils";
import { useFieldContext } from "@seed-design/react-field";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(slider);
const { withContext: withTickContext } = createRecipeContext(sliderTick);
const { withContext: withMarkerContext } = createRecipeContext(sliderMarker);

const withFieldStateProps = createWithStateProps([{ useContext: useFieldContext, strict: false }]);
const withStateProps = createWithStateProps([
  useSliderContext,
  { useContext: useFieldContext, strict: false },
]);

export interface SliderRootProps extends SliderVariantProps, Slider.RootProps {}

export const SliderRoot = withProvider<HTMLDivElement, SliderRootProps>(Slider.Root, "root");

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
    const mergedProps = mergeProps(fieldContext?.inputAriaAttributes ?? {}, props); // intentionally omits Field stateProps here because each thumb is styled individually

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
SliderThumb.displayName = "SliderThumb";

export interface SliderHiddenInputProps extends Slider.HiddenInputProps {}

export const SliderHiddenInput = Slider.HiddenInput;

export interface SliderTickProps extends SliderTickVariantProps, Slider.TickProps {}

export const SliderTick = withTickContext<HTMLDivElement, SliderTickProps>(Slider.Tick);

export interface SliderMarkersProps extends PrimitiveProps, HTMLAttributes<HTMLDivElement> {}

export const SliderMarkers = withContext<HTMLDivElement, SliderMarkersProps>(
  withStateProps(Primitive.div),
  "markers",
);

export interface SliderMarkerProps extends SliderMarkerVariantProps, Slider.MarkerProps {}

export const SliderMarker = withMarkerContext<HTMLDivElement, SliderMarkerProps>(
  withFieldStateProps(Slider.Marker),
);

export interface SliderTooltipRootProps extends Slider.TooltipRootProps {}

export const SliderTooltipRoot = withContext<HTMLDivElement, SliderTooltipRootProps>(
  Slider.TooltipRoot,
  "tooltipRoot",
);

export interface SliderTooltipLabelProps extends Slider.TooltipLabelProps {}

export const SliderTooltipLabel = Slider.TooltipLabel;

export interface SliderTooltipArrowProps extends PrimitiveProps, HTMLAttributes<HTMLDivElement> {}

export const SliderTooltipArrow = withContext<HTMLDivElement, SliderTooltipArrowProps>(
  withStateProps(Primitive.div),
  "tooltipArrow",
);

export interface SliderTooltipArrowTipProps extends React.SVGProps<SVGSVGElement> {
  /**
   * radius of the arrow tip
   * @default 2
   */
  tipRadius?: number;
}

// TODO: get value from rootage spec
const ARROW_TIP_WIDTH = 10;
const ARROW_TIP_HEIGHT = 7;

export const SliderTooltipArrowTip = forwardRef<SVGSVGElement, SliderTooltipArrowTipProps>(
  ({ tipRadius = 2, className, ...otherProps }, ref) => {
    const pathData = `M0,0
      H${ARROW_TIP_WIDTH}
      L${ARROW_TIP_WIDTH / 2 + tipRadius},${ARROW_TIP_HEIGHT - tipRadius}
      Q${ARROW_TIP_WIDTH / 2},${ARROW_TIP_HEIGHT} ${ARROW_TIP_WIDTH / 2 - tipRadius},${ARROW_TIP_HEIGHT - tipRadius}
      Z`;

    const classNames = useClassNames();

    return (
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${ARROW_TIP_WIDTH} ${ARROW_TIP_HEIGHT}`}
        ref={ref}
        className={clsx(classNames.tooltipArrowTip, className)}
        {...otherProps}
      >
        <path stroke="none" d={pathData} />
      </svg>
    );
  },
);
SliderTooltipArrowTip.displayName = "SliderTooltipArrowTip";
