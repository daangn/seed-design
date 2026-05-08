import './checkbox-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const checkboxGroupSlotNames = [
  [
    "root",
    "seed-checkbox-group"
  ],
  [
    "text",
    "seed-checkbox-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const checkboxGroupVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ],
  "checked": [
    true
  ]
};

export const checkboxGroupVariantKeys = Object.keys(checkboxGroupVariantMap);

export function checkboxGroup(props) {
  return Object.fromEntries(
    checkboxGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(checkboxGroup, { splitVariantProps: (props) => splitVariantProps(props, checkboxGroupVariantMap) });

// @recipe(seed): checkbox-group