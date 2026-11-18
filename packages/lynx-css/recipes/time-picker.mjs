import './time-picker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const timePickerSlotNames = [
  [
    "itemLabel",
    "seed-time-picker__itemLabel"
  ]
];

const defaultVariant = {
  "columnType": "period"
};

const compoundVariants = [];

export const timePickerVariantMap = {
  "columnType": [
    "period",
    "hour",
    "minute"
  ]
};

export const timePickerVariantKeys = Object.keys(timePickerVariantMap);

export function timePicker(props) {
  return Object.fromEntries(
    timePickerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(timePicker, { splitVariantProps: (props) => splitVariantProps(props, timePickerVariantMap) });

// @recipe(seed): time-picker