import './radio.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const radioSlotNames = [
  [
    "root",
    "seed-radio__root"
  ],
  [
    "label",
    "seed-radio__label"
  ]
];

const defaultVariant = {
  "size": "medium",
  "weight": "regular"
};

const compoundVariants = [];

export const radioVariantMap = {
  "weight": [
    "regular",
    "bold"
  ],
  "size": [
    "large",
    "medium"
  ]
};

export const radioVariantKeys = Object.keys(radioVariantMap);

export function radio(props) {
  return createSlots(radioSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(radio, { splitVariantProps: (props) => splitVariantProps(props, radioVariantMap) });

// @recipe(seed): radio