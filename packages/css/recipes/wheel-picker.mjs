import './wheel-picker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
    "selectionIndicator",
    "seed-wheel-picker__selectionIndicator"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const wheelPickerVariantMap = {
  "appearance": [
    "neutral"
  ]
};

export const wheelPickerVariantKeys = Object.keys(wheelPickerVariantMap);

export function wheelPicker(props) {
  return Object.fromEntries(
    wheelPickerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(wheelPicker, { splitVariantProps: (props) => splitVariantProps(props, wheelPickerVariantMap) });

// @recipe(seed): wheel-picker