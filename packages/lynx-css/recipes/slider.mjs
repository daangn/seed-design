import './slider.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sliderSlotNames = [
  [
    "root",
    "seed-slider__root"
  ],
  [
    "track",
    "seed-slider__track"
  ],
  [
    "control",
    "seed-slider__control"
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
    "tick",
    "seed-slider__tick"
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
    "valueIndicatorArrowTip",
    "seed-slider__valueIndicatorArrowTip"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const sliderVariantMap = {};

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