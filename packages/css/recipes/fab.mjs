import './fab.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const fabSlotNames = [
  [
    "root",
    "seed-fab__root"
  ],
  [
    "icon",
    "seed-fab__icon"
  ],
  [
    "label",
    "seed-fab__label"
  ]
];

const defaultVariant = {
  "extended": true
};

const compoundVariants = [];

export const fabVariantMap = {
  "extended": [
    true,
    false
  ]
};

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