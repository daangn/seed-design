import './wheel-picker.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const wheelPickerSlotNames = [
  [
    "root",
    "seed-wheel-picker__root"
  ],
  [
    "scrollFog",
    "seed-wheel-picker__scrollFog"
  ],
  [
    "columns",
    "seed-wheel-picker__columns"
  ],
  [
    "column",
    "seed-wheel-picker__column"
  ],
  [
    "item",
    "seed-wheel-picker__item"
  ],
  [
    "itemLabel",
    "seed-wheel-picker__itemLabel"
  ],
  [
    "selectionIndicator",
    "seed-wheel-picker__selectionIndicator"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const wheelPickerVariantMap = {
  "size": [
    "small",
    "medium"
  ]
};

export const wheelPickerVariantKeys = Object.keys(wheelPickerVariantMap);

export function wheelPicker(props) {
  return createSlots(wheelPickerSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(wheelPicker, { splitVariantProps: (props) => splitVariantProps(props, wheelPickerVariantMap) });

// @recipe(seed): wheel-picker