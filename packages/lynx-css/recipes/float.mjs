import './float.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const floatVariantMap = {
  "placement": [
    "top-start",
    "top-center",
    "top-end",
    "middle-start",
    "middle-center",
    "middle-end",
    "bottom-start",
    "bottom-center",
    "bottom-end"
  ]
};

export const floatVariantKeys = Object.keys(floatVariantMap);

export function float(props) {
  return createClassName(
    "seed-float",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(float, { splitVariantProps: (props) => splitVariantProps(props, floatVariantMap) });

// @recipe(seed): float

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const floatSeedTagSpec = {
  name: "Float",
  axes: [],
  defaults: {},
};
