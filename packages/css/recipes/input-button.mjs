import './input-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const inputButtonSlotNames = [
  [
    "root",
    "ride-input-button__root"
  ],
  [
    "value",
    "ride-input-button__value"
  ],
  [
    "placeholder",
    "ride-input-button__placeholder"
  ],
  [
    "button",
    "ride-input-button__button"
  ],
  [
    "prefixText",
    "ride-input-button__prefixText"
  ],
  [
    "prefixIcon",
    "ride-input-button__prefixIcon"
  ],
  [
    "suffixText",
    "ride-input-button__suffixText"
  ],
  [
    "suffixIcon",
    "ride-input-button__suffixIcon"
  ],
  [
    "clearButton",
    "ride-input-button__clearButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const inputButtonVariantMap = {};

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