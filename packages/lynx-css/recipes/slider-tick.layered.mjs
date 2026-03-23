import './slider-tick.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const sliderTickSlotNames = [
  [
    "root",
    "seed-slider-tick"
  ],
  [
    "text",
    "seed-slider-tick__text"
  ]
];

const defaultVariant = {
  "weight": "thin"
};

const compoundVariants = [];

export const sliderTickVariantMap = {
  "weight": [
    "thin",
    "thick"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const sliderTickVariantKeys = Object.keys(sliderTickVariantMap);

export function sliderTick(props) {
  return Object.fromEntries(
    sliderTickSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(sliderTick, { splitVariantProps: (props) => splitVariantProps(props, sliderTickVariantMap) });

// @recipe(seed): slider-tick