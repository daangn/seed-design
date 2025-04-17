import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fieldSlotNames = [
  [
    "root",
    "seed-field__root"
  ],
  [
    "header",
    "seed-field__header"
  ],
  [
    "label",
    "seed-field__label"
  ],
  [
    "indicator",
    "seed-field__indicator"
  ],
  [
    "footer",
    "seed-field__footer"
  ],
  [
    "description",
    "seed-field__description"
  ],
  [
    "errorMessage",
    "seed-field__errorMessage"
  ],
  [
    "errorIcon",
    "seed-field__errorIcon"
  ],
  [
    "characterCountArea",
    "seed-field__characterCountArea"
  ],
  [
    "characterCount",
    "seed-field__characterCount"
  ],
  [
    "maxCharacterCount",
    "seed-field__maxCharacterCount"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const fieldVariantMap = {
  "size": [
    "large",
    "medium"
  ]
};

export const fieldVariantKeys = Object.keys(fieldVariantMap);

export function field(props) {
  return Object.fromEntries(
    fieldSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(field, { splitVariantProps: (props) => splitVariantProps(props, fieldVariantMap) });

// @recipe(seed): field