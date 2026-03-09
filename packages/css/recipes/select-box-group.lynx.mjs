import './select-box-group.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxGroupSlotNames = [
  [
    "root",
    "seed-select-box-group"
  ],
  [
    "text",
    "seed-select-box-group__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const selectBoxGroupVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const selectBoxGroupVariantKeys = Object.keys(selectBoxGroupVariantMap);

export function selectBoxGroup(props) {
  return Object.fromEntries(
    selectBoxGroupSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBoxGroup, { splitVariantProps: (props) => splitVariantProps(props, selectBoxGroupVariantMap) });

// @recipe(seed): select-box-group