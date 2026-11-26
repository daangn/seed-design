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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const listHeaderSeedTagSpec = {
  name: "ListHeader",
  axes: ["variant"],
  defaults: { variant: "mediumWeak" },
};
