import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const textFieldSlotNames = [
  [
    "root",
    "seed-text-field__root"
  ],
  [
    "header",
    "seed-text-field__header"
  ],
  [
    "label",
    "seed-text-field__label"
  ],
  [
    "indicator",
    "seed-text-field__indicator"
  ],
  [
    "field",
    "seed-text-field__field"
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
  ],
  [
    "footer",
    "seed-text-field__footer"
  ],
  [
    "description",
    "seed-text-field__description"
  ],
  [
    "errorMessage",
    "seed-text-field__errorMessage"
  ],
  [
    "errorIcon",
    "seed-text-field__errorIcon"
  ],
  [
    "characterCountArea",
    "seed-text-field__characterCountArea"
  ],
  [
    "characterCount",
    "seed-text-field__characterCount"
  ],
  [
    "maxCharacterCount",
    "seed-text-field__maxCharacterCount"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const textFieldVariantMap = {
  "size": [
    "xlarge",
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