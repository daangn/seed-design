import './radio-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const radioGroupVariantMap = {};

export const radioGroupVariantKeys = Object.keys(radioGroupVariantMap);

export function radioGroup(props) {
  return createClassName(
    "seed-radio-group",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(radioGroup, { splitVariantProps: (props) => splitVariantProps(props, radioGroupVariantMap) });

// @recipe(seed): radio-group