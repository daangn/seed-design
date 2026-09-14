import './slider.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sliderSlotNames = [
  [
    "root",
    "seed-slider__root"
  ],
  [
    "control",
    "seed-slider__control"
  ],
  [
    "track",
    "seed-slider__track"
  ],
  [
    "range",
    "seed-slider__range"
  ],
  [
    "thumb",
    "seed-slider__thumb"
  ],
  [
    "markers",
    "seed-slider__markers"
  ],
  [
    "valueIndicatorRoot",
    "seed-slider__valueIndicatorRoot"
  ],
  [
    "valueIndicatorArrow",
    "seed-slider__valueIndicatorArrow"
  ],
  [
    "valueIndicatorLabel",
    "seed-slider__valueIndicatorLabel"
  ]
];

const defaultVariant = {
  "disabled": false,
  "dragging": false,
  "thumbDragging": false,
  "valueIndicatorShown": false,
  "valueIndicatorEverShown": false
};

const compoundVariants = [];

export const sliderVariantMap = {
  "disabled": [
    true,
    false
  ],
  "dragging": [
    true,
    false
  ],
  "thumbDragging": [
    true,
    false
  ],
  "valueIndicatorShown": [
    true,
    false
  ],
  "valueIndicatorEverShown": [
    true,
    false
  ]
};

export const sliderVariantKeys = Object.keys(sliderVariantMap);

export function slider(props) {
  return Object.fromEntries(
    sliderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(slider, { splitVariantProps: (props) => splitVariantProps(props, sliderVariantMap) });

// @recipe(seed): slider