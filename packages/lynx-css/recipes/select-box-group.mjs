import './select-box-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "columns": 1
};

const compoundVariants = [];

export const selectBoxGroupVariantMap = {
  "columns": [
    "1",
    "2"
  ]
};

export const selectBoxGroupVariantKeys = Object.keys(selectBoxGroupVariantMap);

export function selectBoxGroup(props) {
  return createClassName(
    "seed-select-box-group",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(selectBoxGroup, { splitVariantProps: (props) => splitVariantProps(props, selectBoxGroupVariantMap) });

// @recipe(seed): select-box-group