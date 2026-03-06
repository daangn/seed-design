import './fab.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fabSlotNames = [
  [
    "root",
    "seed-fab"
  ],
  [
    "text",
    "seed-fab__text"
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

// @recipe(seed): fab