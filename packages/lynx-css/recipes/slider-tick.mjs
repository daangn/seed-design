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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const sliderTickSeedTagSpec = {
  name: "SliderTick",
  axes: ["weight"],
  defaults: { weight: "thin" },
};
