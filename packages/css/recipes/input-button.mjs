import './input-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const inputButtonSlotNames = [
  [
    "root",
    "seed-input-button__root"
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
    "button",
    "seed-input-button__button"
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