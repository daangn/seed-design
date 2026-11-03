import './select.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const selectSlotNames = [
  [
    "positioner",
    "seed-select__positioner"
  ],
  [
    "content",
    "seed-select__content"
  ],
  [
    "scrollArea",
    "seed-select__scrollArea"
  ],
  [
    "group",
    "seed-select__group"
  ],
  [
    "groupLabel",
    "seed-select__groupLabel"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const selectVariantMap = {
  "size": [
    "large",
    "medium",
    "responsive"
  ]
};

export const selectVariantKeys = Object.keys(selectVariantMap);

export function select(props) {
  return createSlots(selectSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(select, { splitVariantProps: (props) => splitVariantProps(props, selectVariantMap) });

// @recipe(seed): select