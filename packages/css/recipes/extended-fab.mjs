import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const extendedFabSlotNames = [
  [
    "root",
    "seed-extended-fab__root"
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