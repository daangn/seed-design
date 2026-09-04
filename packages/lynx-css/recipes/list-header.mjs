import './list-header.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
  return createClassName(
    "seed-list-header",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(listHeader, { splitVariantProps: (props) => splitVariantProps(props, listHeaderVariantMap) });

// @recipe(seed): list-header