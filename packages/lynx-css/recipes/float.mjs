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