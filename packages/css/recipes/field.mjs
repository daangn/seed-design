import './field.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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

const defaultVariant = {};

const compoundVariants = [];

export const fieldVariantMap = {};

export const fieldVariantKeys = Object.keys(fieldVariantMap);

export function field(props) {
  return createSlots(fieldSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(field, { splitVariantProps: (props) => splitVariantProps(props, fieldVariantMap) });

// @recipe(seed): field