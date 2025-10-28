import { slider, type SliderVariantProps } from "@seed-design/css/recipes/slider";
import { sliderTick, type SliderTickVariantProps } from "@seed-design/css/recipes/slider-tick";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Slider, useSliderContext } from "@seed-design/react-slider";
import { forwardRef, type HTMLAttributes } from "react";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { splitMultipleVariantsProps } from "../../utils/splitMultipleVariantsProps";
import clsx from "clsx";
import { mergeProps } from "@seed-design/dom-utils";

const { withContext, ClassNamesProvider } = createSlotRecipeContext(slider);
const { PropsProvider: TickPropsProvider, useProps: useTickProps } =
  createRecipeContext(sliderTick);
const withStateProps = createWithStateProps([useSliderContext]);

export interface SliderRootProps
  extends SliderVariantProps,
    SliderTickVariantProps,
    Slider.RootProps {}

// export const SliderRoot = withProvider<HTMLDivElement, SliderRootProps>(Slider.Root, "root");

export const SliderRoot = forwardRef<HTMLDivElement, SliderRootProps>((props, ref) => {
  const [{ slider: sliderVariantProps, sliderTick: sliderTickVariantProps }, otherProps] =
    splitMultipleVariantsProps(props, { slider, sliderTick });

  return (
    <TickPropsProvider value={sliderTickVariantProps}>
      <ClassNamesProvider value={slider(sliderVariantProps)}>
        <Slider.Root ref={ref} {...sliderVariantProps} {...otherProps} />
      </ClassNamesProvider>
    </TickPropsProvider>
  );
});

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

export const SliderRange = withContext<HTMLDivElement, SliderRangeProps>(Slider.Range, "range");

export interface SliderThumbProps extends Slider.ThumbProps {}

export const SliderThumb = withContext<HTMLDivElement, SliderThumbProps>(Slider.Thumb, "thumb");

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
