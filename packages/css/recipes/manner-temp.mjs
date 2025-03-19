import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "level": "l1"
};

const compoundVariants = [];

export const mannerTempVariantMap = {
  "level": [
    "l1",
    "l2",
    "l3",
    "l4",
    "l5",
    "l6"
  ]
};

export const mannerTempVariantKeys = Object.keys(mannerTempVariantMap);

export function mannerTemp(props) {
  return createClassName(
    "seed-manner-temp",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(mannerTemp, { splitVariantProps: (props) => splitVariantProps(props, mannerTempVariantMap) });

// @recipe(seed): manner-temp