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
    "track",
    "seed-wheel-picker__track"
  ],
  [
    "sizingContent",
    "seed-wheel-picker__sizingContent"
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
    "itemText",
    "seed-wheel-picker__itemText"
  ],
  [
    "selectionIndicator",
    "seed-wheel-picker__selectionIndicator"
  ]
];

const defaultVariant = {
  "size": "medium",
  "selected": false,
  "disabled": false
};

const compoundVariants = [
  {
    "selected": true,
    "disabled": true
  }
];

export const wheelPickerVariantMap = {
  "size": [
    "small",
    "medium"
  ],
  "selected": [
    true,
    false
  ],
  "disabled": [
    true,
    false
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