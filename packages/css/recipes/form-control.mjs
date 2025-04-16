import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const formControlSlotNames = [
  [
    "root",
    "seed-form-control__root"
  ],
  [
    "header",
    "seed-form-control__header"
  ],
  [
    "label",
    "seed-form-control__label"
  ],
  [
    "indicator",
    "seed-form-control__indicator"
  ],
  [
    "footer",
    "seed-form-control__footer"
  ],
  [
    "description",
    "seed-form-control__description"
  ],
  [
    "errorMessage",
    "seed-form-control__errorMessage"
  ],
  [
    "errorIcon",
    "seed-form-control__errorIcon"
  ],
  [
    "characterCountArea",
    "seed-form-control__characterCountArea"
  ],
  [
    "characterCount",
    "seed-form-control__characterCount"
  ],
  [
    "maxCharacterCount",
    "seed-form-control__maxCharacterCount"
  ]
];

const defaultVariant = {
  "size": "large"
};

const compoundVariants = [];

export const formControlVariantMap = {
  "size": [
    "large",
    "medium"
  ]
};

export const formControlVariantKeys = Object.keys(formControlVariantMap);

export function formControl(props) {
  return Object.fromEntries(
    formControlSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(formControl, { splitVariantProps: (props) => splitVariantProps(props, formControlVariantMap) });

// @recipe(seed): form-control