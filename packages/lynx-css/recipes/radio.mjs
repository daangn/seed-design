import './radio.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const radioSlotNames = [
  [
    "root",
    "seed-radio__root"
  ],
  [
    "control",
    "seed-radio__control"
  ],
  [
    "label",
    "seed-radio__label"
  ]
];

const defaultVariant = {
  "weight": "regular",
  "size": "medium",
  "disabled": false
};

const compoundVariants = [];

export const radioVariantMap = {
  "weight": [
    "regular",
    "bold"
  ],
  "size": [
    "medium",
    "large"
  ],
  "disabled": [
    true,
    false
  ]
};

export const radioVariantKeys = Object.keys(radioVariantMap);

export function radio(props) {
  return createSlots(radioSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(radio, { splitVariantProps: (props) => splitVariantProps(props, radioVariantMap) });

// @recipe(seed): radio