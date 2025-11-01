import './slider-tick.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "weight": "thin"
};

const compoundVariants = [];

export const sliderTickVariantMap = {
  "weight": [
    "thin",
    "thick"
  ]
};

export const sliderTickVariantKeys = Object.keys(sliderTickVariantMap);

export function sliderTick(props) {
  return createClassName(
    "seed-slider-tick",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(sliderTick, { splitVariantProps: (props) => splitVariantProps(props, sliderTickVariantMap) });

// @recipe(seed): slider-tick