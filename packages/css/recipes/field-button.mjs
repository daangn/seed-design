import './field-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fieldButtonSlotNames = [
  [
    "root",
    "seed-field-button__root"
  ],
  [
    "value",
    "seed-field-button__value"
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
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const fieldButtonVariantMap = {
  "size": [
    "xlarge",
    "large",
    "medium"
  ]
};

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