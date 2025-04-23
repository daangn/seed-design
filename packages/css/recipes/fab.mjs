import './fab.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const fabVariantMap = {};

export const fabVariantKeys = Object.keys(fabVariantMap);

export function fab(props) {
  return createClassName(
    "seed-fab",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(fab, { splitVariantProps: (props) => splitVariantProps(props, fabVariantMap) });

// @recipe(seed): fab