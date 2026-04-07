import './text-input.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const textInputSlotNames = [
  [
    "root",
    "ride-text-input__root"
  ],
  [
    "value",
    "ride-text-input__value"
  ],
  [
    "prefixText",
    "ride-text-input__prefixText"
  ],
  [
    "prefixIcon",
    "ride-text-input__prefixIcon"
  ],
  [
    "suffixText",
    "ride-text-input__suffixText"
  ],
  [
    "suffixIcon",
    "ride-text-input__suffixIcon"
  ]
];

const defaultVariant = {
  "variant": "outline",
  "size": "large"
};

const compoundVariants = [
  {
    "variant": "outline",
    "size": "large"
  },
  {
    "variant": "outline",
    "size": "medium"
  }
];

export const textInputVariantMap = {
  "variant": [
    "outline",
    "underline"
  ],
  "size": [
    "large",
    "medium"
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