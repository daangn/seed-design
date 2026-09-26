import './quantity-picker.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const quantityPickerSlotNames = [
  [
    "root",
    "seed-quantity-picker__root"
  ],
  [
    "decrementButton",
    "seed-quantity-picker__decrementButton"
  ],
  [
    "decrementIcon",
    "seed-quantity-picker__decrementIcon"
  ],
  [
    "valueDisplay",
    "seed-quantity-picker__valueDisplay"
  ],
  [
    "valueDisplayPlaceholder",
    "seed-quantity-picker__valueDisplayPlaceholder"
  ],
  [
    "valueDisplayText",
    "seed-quantity-picker__valueDisplayText"
  ],
  [
    "divider",
    "seed-quantity-picker__divider"
  ],
  [
    "incrementButton",
    "seed-quantity-picker__incrementButton"
  ],
  [
    "incrementIcon",
    "seed-quantity-picker__incrementIcon"
  ]
];

const defaultVariant = {
  "layout": "hug",
  "size": "medium",
  "invalid": false,
  "disabled": false,
  "pressed": false,
  "loading": false
};

const compoundVariants = [
  {
    "disabled": false,
    "loading": false
  }
];

export const quantityPickerVariantMap = {
  "layout": [
    "hug",
    "fill"
  ],
  "size": [
    "small",
    "medium",
    "large"
  ],
  "invalid": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "loading": [
    true,
    false
  ]
};

export const quantityPickerVariantKeys = Object.keys(quantityPickerVariantMap);

export function quantityPicker(props) {
  return Object.fromEntries(
    quantityPickerSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(quantityPicker, { splitVariantProps: (props) => splitVariantProps(props, quantityPickerVariantMap) });

// @recipe(seed): quantity-picker