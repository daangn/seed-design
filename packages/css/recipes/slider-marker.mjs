import './slider-marker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "align": "center"
};

const compoundVariants = [];

export const sliderMarkerVariantMap = {
  "align": [
    "start",
    "center",
    "end"
  ]
};

export const sliderMarkerVariantKeys = Object.keys(sliderMarkerVariantMap);

export function sliderMarker(props) {
  return createClassName(
    "seed-slider-marker",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(sliderMarker, { splitVariantProps: (props) => splitVariantProps(props, sliderMarkerVariantMap) });

// @recipe(seed): slider-marker