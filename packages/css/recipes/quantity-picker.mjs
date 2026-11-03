import './quantity-picker.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  "size": "medium"
};

const compoundVariants = [];

export const quantityPickerVariantMap = {
  "layout": [
    "hug",
    "fill"
  ],
  "size": [
    "small",
    "medium",
    "large"
  ]
};

export const quantityPickerVariantKeys = Object.keys(quantityPickerVariantMap);

export function quantityPicker(props) {
  return createSlots(quantityPickerSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(quantityPicker, { splitVariantProps: (props) => splitVariantProps(props, quantityPickerVariantMap) });

// @recipe(seed): quantity-picker