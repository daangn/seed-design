import './extended-fab.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const extendedFabSlotNames = [
  [
    "root",
    "seed-extended-fab"
  ],
  [
    "text",
    "seed-extended-fab__text"
  ]
];

const defaultVariant = {
  "variant": "neutralSolid",
  "size": "medium"
};

const compoundVariants = [];

export const extendedFabVariantMap = {
  "variant": [
    "neutralSolid",
    "layerFloating"
  ],
  "size": [
    "small",
    "medium"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const extendedFabVariantKeys = Object.keys(extendedFabVariantMap);

export function extendedFab(props) {
  return Object.fromEntries(
    extendedFabSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(extendedFab, { splitVariantProps: (props) => splitVariantProps(props, extendedFabVariantMap) });

// @recipe(seed): extended-fab