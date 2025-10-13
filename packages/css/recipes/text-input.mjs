import './text-input.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const textInputSlotNames = [
  [
    "root",
    "seed-text-input__root"
  ],
  [
    "value",
    "seed-text-input__value"
  ],
  [
    "prefixText",
    "seed-text-input__prefixText"
  ],
  [
    "prefixIcon",
    "seed-text-input__prefixIcon"
  ],
  [
    "suffixText",
    "seed-text-input__suffixText"
  ],
  [
    "suffixIcon",
    "seed-text-input__suffixIcon"
  ]
];

const defaultVariant = {
  "variant": "rounded"
};

const compoundVariants = [];

export const textInputVariantMap = {
  "variant": [
    "rounded",
    "underline"
  ]
};

export const textInputVariantKeys = Object.keys(textInputVariantMap);

export function textInput(props) {
  return Object.fromEntries(
    textInputSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(textInput, { splitVariantProps: (props) => splitVariantProps(props, textInputVariantMap) });

// @recipe(seed): text-input