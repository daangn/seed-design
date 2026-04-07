import './field.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fieldSlotNames = [
  [
    "root",
    "ride-field__root"
  ],
  [
    "header",
    "ride-field__header"
  ],
  [
    "footer",
    "ride-field__footer"
  ],
  [
    "description",
    "ride-field__description"
  ],
  [
    "errorMessage",
    "ride-field__errorMessage"
  ],
  [
    "characterCountArea",
    "ride-field__characterCountArea"
  ],
  [
    "characterCount",
    "ride-field__characterCount"
  ],
  [
    "maxCharacterCount",
    "ride-field__maxCharacterCount"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const fieldVariantMap = {};

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