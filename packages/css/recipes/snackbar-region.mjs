import './snackbar-region.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const snackbarRegionVariantMap = {};

export const snackbarRegionVariantKeys = Object.keys(snackbarRegionVariantMap);

export function snackbarRegion(props) {
  return createClassName(
    "seed-snackbar-region",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(snackbarRegion, { splitVariantProps: (props) => splitVariantProps(props, snackbarRegionVariantMap) });

// @recipe(seed): snackbar-region