import './snackbar-region.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const snackbarRegionSlotNames = [
  [
    "root",
    "seed-snackbar-region"
  ],
  [
    "text",
    "seed-snackbar-region__text"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const snackbarRegionVariantMap = {
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

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

// @recipe(seed): snackbar-region