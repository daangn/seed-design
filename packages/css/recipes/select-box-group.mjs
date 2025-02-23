import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxGroupSlotNames = [
  [
    "root",
    "seed-select-box-group__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const selectBoxGroupVariantMap = {};

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