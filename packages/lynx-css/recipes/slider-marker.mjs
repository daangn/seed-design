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