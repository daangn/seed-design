import './radio.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const radioSlotNames = [
  [
    "root",
    "seed-radio__root"
  ],
  [
    "label",
    "seed-radio__label"
  ]
];

const defaultVariant = {
  "weight": "regular",
  "size": "medium",
  "disabled": false
};

const compoundVariants = [];

export const radioVariantMap = {
  "weight": [
    "regular",
    "bold"
  ],
  "size": [
    "medium",
    "large"
  ],
  "disabled": [
    true,
    false
  ]
};

export const radioVariantKeys = Object.keys(radioVariantMap);

export function radio(props) {
  return Object.fromEntries(
    radioSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radio, { splitVariantProps: (props) => splitVariantProps(props, radioVariantMap) });

// @recipe(seed): radio