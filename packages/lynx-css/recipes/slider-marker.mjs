import './slider-marker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "align": "center",
  "dir": "ltr",
  "disabled": false
};

const compoundVariants = [
  {
    "align": "start",
    "dir": "ltr"
  },
  {
    "align": "center",
    "dir": "ltr"
  },
  {
    "align": "end",
    "dir": "ltr"
  },
  {
    "align": "start",
    "dir": "rtl"
  },
  {
    "align": "center",
    "dir": "rtl"
  },
  {
    "align": "end",
    "dir": "rtl"
  }
];

export const sliderMarkerVariantMap = {
  "align": [
    "start",
    "center",
    "end"
  ],
  "dir": [
    "ltr",
    "rtl"
  ],
  "disabled": [
    true,
    false
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const sliderMarkerSeedTagSpec = {
  name: "SliderMarker",
  axes: [],
  defaults: {},
};
