import { slider, type SliderVariantProps } from "@seed-design/css/recipes/slider";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Slider, useSliderContext } from "@seed-design/react-slider";
import type { HTMLAttributes } from "react";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withContext, withProvider } = createSlotRecipeContext(slider);
const withStateProps = createWithStateProps([useSliderContext]);

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

export const SliderRange = withContext<HTMLDivElement, SliderRangeProps>(Slider.Range, "range");

export interface SliderThumbProps extends Slider.ThumbProps {}

export const SliderThumb = withContext<HTMLDivElement, SliderThumbProps>(Slider.Thumb, "thumb");

export interface SliderHiddenInputProps extends Slider.HiddenInputProps {}

export const SliderHiddenInput = Slider.HiddenInput;
