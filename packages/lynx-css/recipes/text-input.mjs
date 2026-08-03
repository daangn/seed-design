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
  "variant": "outline",
  "size": "large",
  "focused": false,
  "invalid": false,
  "readOnly": false,
  "disabled": false
};

const compoundVariants = [
  {
    "variant": "outline",
    "size": "large"
  },
  {
    "variant": "outline",
    "size": "medium"
  },
  {
    "variant": "underline",
    "size": "large"
  },
  {
    "variant": "underline",
    "size": "medium"
  },
  {
    "variant": "outline",
    "focused": true
  },
  {
    "variant": "underline",
    "focused": true
  },
  {
    "variant": "outline",
    "invalid": true
  },
  {
    "variant": "underline",
    "invalid": true
  },
  {
    "variant": "outline",
    "readOnly": true,
    "disabled": false
  },
  {
    "variant": "underline",
    "readOnly": true,
    "disabled": false
  },
  {
    "variant": "outline",
    "disabled": true
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
  ],
  "focused": [
    true,
    false
  ],
  "invalid": [
    true,
    false
  ],
  "readOnly": [
    true,
    false
  ],
  "disabled": [
    true,
    false
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