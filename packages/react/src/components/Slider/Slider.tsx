import { slider, type SliderVariantProps } from "@seed-design/css/recipes/slider";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { Slider } from "@seed-design/react-slider";
import type { HTMLAttributes } from "react";

const { withContext, withProvider } = createSlotRecipeContext(slider);

export interface SliderRootProps extends SliderVariantProps, Slider.RootProps {}

export const SliderRoot = withProvider<HTMLSpanElement, SliderRootProps>(Slider.Root, "root");

export interface SliderTrackProps extends PrimitiveProps, HTMLAttributes<HTMLSpanElement> {}

export const SliderTrack = withContext<HTMLSpanElement, SliderTrackProps>(Primitive.span, "track");

export interface SliderRangeProps extends Slider.RangeProps {}

export const SliderRange = withContext<HTMLSpanElement, SliderRangeProps>(Slider.Range, "range");

export interface SliderThumbProps extends Slider.ThumbProps {}

export const SliderThumb = withContext<HTMLSpanElement, SliderThumbProps>(Slider.Thumb, "thumb");

export interface SliderHiddenInputProps extends Slider.HiddenInputProps {}

export const SliderHiddenInput = Slider.HiddenInput;
