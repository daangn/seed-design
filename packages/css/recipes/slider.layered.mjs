import './slider.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sliderSlotNames = [
  [
    "root",
    "ride-slider__root"
  ],
  [
    "track",
    "ride-slider__track"
  ],
  [
    "control",
    "ride-slider__control"
  ],
  [
    "range",
    "ride-slider__range"
  ],
  [
    "thumb",
    "ride-slider__thumb"
  ],
  [
    "tick",
    "ride-slider__tick"
  ],
  [
    "markers",
    "ride-slider__markers"
  ],
  [
    "valueIndicatorRoot",
    "ride-slider__valueIndicatorRoot"
  ],
  [
    "valueIndicatorArrow",
    "ride-slider__valueIndicatorArrow"
  ],
  [
    "valueIndicatorArrowTip",
    "ride-slider__valueIndicatorArrowTip"
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