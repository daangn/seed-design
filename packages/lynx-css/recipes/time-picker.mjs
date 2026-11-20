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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const timePickerSeedTagSpec = {
  name: "TimePicker",
  axes: [],
  defaults: {},
};
