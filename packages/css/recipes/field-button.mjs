import './field-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fieldButtonSlotNames = [
  [
    "positioner",
    "seed-field-button__positioner"
  ],
  [
    "root",
    "seed-field-button__root"
  ],
  [
    "value",
    "seed-field-button__value"
  ],
  [
    "placeholder",
    "seed-field-button__placeholder"
  ],
  [
    "button",
    "seed-field-button__button"
  ],
  [
    "prefixText",
    "seed-field-button__prefixText"
  ],
  [
    "prefixIcon",
    "seed-field-button__prefixIcon"
  ],
  [
    "suffixText",
    "seed-field-button__suffixText"
  ],
  [
    "suffixIcon",
    "seed-field-button__suffixIcon"
  ],
  [
    "clearButton",
    "seed-field-button__clearButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const fieldButtonVariantMap = {};

export const fieldButtonVariantKeys = Object.keys(fieldButtonVariantMap);

export function fieldButton(props) {
  return Object.fromEntries(
    fieldButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fieldButton, { splitVariantProps: (props) => splitVariantProps(props, fieldButtonVariantMap) });

// @recipe(seed): field-button