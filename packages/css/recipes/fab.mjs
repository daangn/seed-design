import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fabSlotNames = [
  [
    "root",
    "seed-fab__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const fabVariantMap = {};

export const fabVariantKeys = Object.keys(fabVariantMap);

export function fab(props) {
  return Object.fromEntries(
    fabSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(fab, { splitVariantProps: (props) => splitVariantProps(props, fabVariantMap) });