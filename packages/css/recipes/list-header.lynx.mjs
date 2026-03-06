import './list-header.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const listHeaderSlotNames = [
  [
    "root",
    "seed-list-header"
  ],
  [
    "text",
    "seed-list-header__text"
  ]
];

const defaultVariant = {
  "variant": "mediumWeak"
};

const compoundVariants = [];

export const listHeaderVariantMap = {
  "variant": [
    "mediumWeak",
    "boldSolid"
  ]
};

export const listHeaderVariantKeys = Object.keys(listHeaderVariantMap);

export function listHeader(props) {
  return Object.fromEntries(
    listHeaderSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(listHeader, { splitVariantProps: (props) => splitVariantProps(props, listHeaderVariantMap) });

// @recipe(seed): list-header