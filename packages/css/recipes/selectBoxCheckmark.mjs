import './selectBoxCheckmark.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const selectBoxCheckmarkSlotNames = [
  [
    "root",
    "seed-selectBoxCheckmark__root"
  ],
  [
    "icon",
    "seed-selectBoxCheckmark__icon"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const selectBoxCheckmarkVariantMap = {};

export const selectBoxCheckmarkVariantKeys = Object.keys(selectBoxCheckmarkVariantMap);

export function selectBoxCheckmark(props) {
  return Object.fromEntries(
    selectBoxCheckmarkSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(selectBoxCheckmark, { splitVariantProps: (props) => splitVariantProps(props, selectBoxCheckmarkVariantMap) });

// @recipe(seed): selectBoxCheckmark