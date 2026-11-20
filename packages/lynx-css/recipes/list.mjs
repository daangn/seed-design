import './list.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const listVariantMap = {};

export const listVariantKeys = Object.keys(listVariantMap);

export function list(props) {
  return createClassName(
    "seed-list",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(list, { splitVariantProps: (props) => splitVariantProps(props, listVariantMap) });

// @recipe(seed): list

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const listSeedTagSpec = {
  name: "List",
  axes: [],
  defaults: {},
};
