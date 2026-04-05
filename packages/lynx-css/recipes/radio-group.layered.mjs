import './radio-group.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const radioGroupSlotNames = [
  [
    "root",
    "seed-radio-group"
  ],
  [
    "text",
    "seed-radio-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const radioGroupVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const radioGroupVariantKeys = Object.keys(radioGroupVariantMap);

export function radioGroup(props) {
  return Object.fromEntries(
    radioGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(radioGroup, { splitVariantProps: (props) => splitVariantProps(props, radioGroupVariantMap) });

// @recipe(seed): radio-group