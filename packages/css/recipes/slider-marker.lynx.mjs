import './slider-marker.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sliderMarkerSlotNames = [
  [
    "root",
    "seed-slider-marker"
  ],
  [
    "text",
    "seed-slider-marker__text"
  ]
];

const defaultVariant = {
  "align": "center"
};

const compoundVariants = [];

export const sliderMarkerVariantMap = {
  "align": [
    "start",
    "center",
    "end"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const sliderMarkerVariantKeys = Object.keys(sliderMarkerVariantMap);

export function sliderMarker(props) {
  return Object.fromEntries(
    sliderMarkerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(sliderMarker, { splitVariantProps: (props) => splitVariantProps(props, sliderMarkerVariantMap) });

// @recipe(seed): slider-marker