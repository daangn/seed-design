import './select-box-group.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "multiColumn": false
};

const compoundVariants = [];

export const selectBoxGroupVariantMap = {
  "multiColumn": [
    true,
    false
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const selectBoxGroupSeedTagSpec = {
  name: "SelectBoxGroup",
  axes: [],
  defaults: {},
};
