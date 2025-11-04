import './checkbox.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const checkboxSlotNames = [
  [
    "root",
    "seed-checkbox__root"
  ],
  [
    "label",
    "seed-checkbox__label"
  ]
];

const defaultVariant = {
  "size": "medium",
  "weight": "regular"
};

const compoundVariants = [];

export const checkboxVariantMap = {
  "weight": [
    "regular",
    "bold"
  ],
  "size": [
    "large",
    "medium"
  ]
};

export const checkboxVariantKeys = Object.keys(checkboxVariantMap);

export function checkbox(props) {
  return Object.fromEntries(
    checkboxSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkbox, { splitVariantProps: (props) => splitVariantProps(props, checkboxVariantMap) });

// @recipe(seed): checkbox