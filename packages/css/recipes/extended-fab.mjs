import './extended-fab.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
  return createClassName(
    "seed-extended-fab",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(extendedFab, { splitVariantProps: (props) => splitVariantProps(props, extendedFabVariantMap) });

// @recipe(seed): extended-fab