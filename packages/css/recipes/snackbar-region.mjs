import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const snackbarRegionSlotNames = [
  [
    "root",
    "seed-snackbar-region__root"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const snackbarRegionVariantMap = {};

export const snackbarRegionVariantKeys = Object.keys(snackbarRegionVariantMap);

export function snackbarRegion(props) {
  return Object.fromEntries(
    snackbarRegionSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(snackbarRegion, { splitVariantProps: (props) => splitVariantProps(props, snackbarRegionVariantMap) });