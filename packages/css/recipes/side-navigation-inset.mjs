import './side-navigation-inset.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const sideNavigationInsetVariantMap = {};

export const sideNavigationInsetVariantKeys = Object.keys(sideNavigationInsetVariantMap);

export function sideNavigationInset(props) {
  return createClassName(
    "seed-side-navigation-inset",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(sideNavigationInset, { splitVariantProps: (props) => splitVariantProps(props, sideNavigationInsetVariantMap) });

// @recipe(seed): side-navigation-inset