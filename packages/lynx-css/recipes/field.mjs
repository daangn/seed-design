import './field.css';
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

const defaultVariant = {
  "invalid": false,
  "empty": false
};

const compoundVariants = [];

export const fieldVariantMap = {
  "empty": [
    true,
    false
  ],
  "invalid": [
    true,
    false
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const fieldSeedTagSpec = {
  name: "Field",
  axes: [],
  defaults: {},
};
