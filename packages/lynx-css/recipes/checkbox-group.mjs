import './checkbox-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const checkboxGroupVariantMap = {};

export const checkboxGroupVariantKeys = Object.keys(checkboxGroupVariantMap);

export function checkboxGroup(props) {
  return createClassName(
    "seed-checkbox-group",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(checkboxGroup, { splitVariantProps: (props) => splitVariantProps(props, checkboxGroupVariantMap) });

// @recipe(seed): checkbox-group