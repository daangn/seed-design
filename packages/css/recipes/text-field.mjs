import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const textFieldSlotNames = [
  [
    "root",
    "seed-text-field__root"
  ],
  [
    "value",
    "seed-text-field__value"
  ],
  [
    "prefixText",
    "seed-text-field__prefixText"
  ],
  [
    "prefixIcon",
    "seed-text-field__prefixIcon"
  ],
  [
    "suffixText",
    "seed-text-field__suffixText"
  ],
  [
    "suffixIcon",
    "seed-text-field__suffixIcon"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const textFieldVariantMap = {
  "size": [
    "large",
    "medium"
  ]
};

export const textFieldVariantKeys = Object.keys(textFieldVariantMap);

export function textField(props) {
  return Object.fromEntries(
    textFieldSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(textField, { splitVariantProps: (props) => splitVariantProps(props, textFieldVariantMap) });

// @recipe(seed): text-field