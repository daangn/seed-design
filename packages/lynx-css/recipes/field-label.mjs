import './field-label.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fieldLabelSlotNames = [
  [
    "root",
    "seed-field-label__root"
  ],
  [
    "indicatorText",
    "seed-field-label__indicatorText"
  ],
  [
    "indicatorIcon",
    "seed-field-label__indicatorIcon"
  ]
];

const defaultVariant = {
  "weight": "medium"
};

const compoundVariants = [];

export const fieldLabelVariantMap = {
  "weight": [
    "medium",
    "bold"
  ]
};

export const fieldLabelVariantKeys = Object.keys(fieldLabelVariantMap);

export function fieldLabel(props) {
  return Object.fromEntries(
    fieldLabelSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fieldLabel, { splitVariantProps: (props) => splitVariantProps(props, fieldLabelVariantMap) });

// @recipe(seed): field-label