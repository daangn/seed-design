import './time-picker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const timePickerSlotNames = [
  [
    "root",
    "seed-time-picker__root"
  ],
  [
    "scrollFog",
    "seed-time-picker__scrollFog"
  ],
  [
    "columns",
    "seed-time-picker__columns"
  ],
  [
    "selectionIndicator",
    "seed-time-picker__selectionIndicator"
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