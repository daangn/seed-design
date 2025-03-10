import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const visuallyHiddenVariantMap = {};

export const visuallyHiddenVariantKeys = Object.keys(visuallyHiddenVariantMap);

export function visuallyHidden(props) {
  return createClassName(
    "seed-visually-hidden",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(visuallyHidden, { splitVariantProps: (props) => splitVariantProps(props, visuallyHiddenVariantMap) });

// @recipe(seed): visually-hidden