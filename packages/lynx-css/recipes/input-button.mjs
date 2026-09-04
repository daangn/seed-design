import './input-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const inputButtonSlotNames = [
  [
    "root",
    "seed-input-button__root"
  ],
  [
    "button",
    "seed-input-button__button"
  ],
  [
    "baseStroke",
    "seed-input-button__baseStroke"
  ],
  [
    "stroke",
    "seed-input-button__stroke"
  ],
  [
    "value",
    "seed-input-button__value"
  ],
  [
    "placeholder",
    "seed-input-button__placeholder"
  ],
  [
    "prefixText",
    "seed-input-button__prefixText"
  ],
  [
    "prefixIcon",
    "seed-input-button__prefixIcon"
  ],
  [
    "suffixText",
    "seed-input-button__suffixText"
  ],
  [
    "suffixIcon",
    "seed-input-button__suffixIcon"
  ],
  [
    "clearButton",
    "seed-input-button__clearButton"
  ]
];

const defaultVariant = {
  "size": "large",
  "pressed": false,
  "invalid": false,
  "disabled": false,
  "readOnly": false
};

const compoundVariants = [];

export const inputButtonVariantMap = {
  "size": [
    "large",
    "medium"
  ],
  "pressed": [
    true,
    false
  ],
  "invalid": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "readOnly": [
    true,
    false
  ]
};

export const inputButtonVariantKeys = Object.keys(inputButtonVariantMap);

export function inputButton(props) {
  return Object.fromEntries(
    inputButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(inputButton, { splitVariantProps: (props) => splitVariantProps(props, inputButtonVariantMap) });

// @recipe(seed): input-button