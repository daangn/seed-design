import './checkbox.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const checkboxSlotNames = [
  [
    "root",
    "seed-checkbox__root"
  ],
  [
    "label",
    "seed-checkbox__label"
  ]
];

const defaultVariant = {
  "size": "medium",
  "weight": "regular"
};

const compoundVariants = [];

export const checkboxVariantMap = {
  "weight": [
    "regular",
    "bold"
  ],
  "size": [
    "large",
    "medium"
  ]
};

export const checkboxVariantKeys = Object.keys(checkboxVariantMap);

export function checkbox(props) {
  return createSlots(checkboxSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(checkbox, { splitVariantProps: (props) => splitVariantProps(props, checkboxVariantMap) });

// @recipe(seed): checkbox