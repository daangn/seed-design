import './select-box-checkmark.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const selectBoxCheckmarkSlotNames = [
  [
    "root",
    "seed-select-box-checkmark__root"
  ],
  [
    "icon",
    "seed-select-box-checkmark__icon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const selectBoxCheckmarkVariantMap = {};

export const selectBoxCheckmarkVariantKeys = Object.keys(selectBoxCheckmarkVariantMap);

export function selectBoxCheckmark(props) {
  return createSlots(selectBoxCheckmarkSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(selectBoxCheckmark, { splitVariantProps: (props) => splitVariantProps(props, selectBoxCheckmarkVariantMap) });

// @recipe(seed): select-box-checkmark