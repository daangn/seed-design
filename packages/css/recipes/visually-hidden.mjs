import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const visuallyHiddenSlotNames = [
  [
    "root",
    "seed-visually-hidden__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const visuallyHiddenVariantMap = {};

export const visuallyHiddenVariantKeys = Object.keys(visuallyHiddenVariantMap);

export function visuallyHidden(props) {
  return Object.fromEntries(
    visuallyHiddenSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(visuallyHidden, { splitVariantProps: (props) => splitVariantProps(props, visuallyHiddenVariantMap) });

// @recipe(seed): visually-hidden