import './time-picker.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const timePickerSlotNames = [
  [
    "root",
    "seed-time-picker__root"
  ],
  [
    "periodColumn",
    "seed-time-picker__periodColumn"
  ],
  [
    "hourColumn",
    "seed-time-picker__hourColumn"
  ],
  [
    "minuteColumn",
    "seed-time-picker__minuteColumn"
  ],
  [
    "item",
    "seed-time-picker__item"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const timePickerVariantMap = {};

export const timePickerVariantKeys = Object.keys(timePickerVariantMap);

export function timePicker(props) {
  return createSlots(timePickerSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(timePicker, { splitVariantProps: (props) => splitVariantProps(props, timePickerVariantMap) });

// @recipe(seed): time-picker