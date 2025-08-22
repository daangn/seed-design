import './skeleton.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "radius": 8,
  "tone": "neutral"
};

const compoundVariants = [];

export const skeletonVariantMap = {
  "radius": [
    "0",
    "8",
    "16",
    "full"
  ],
  "tone": [
    "neutral",
    "magic"
  ]
};

export const skeletonVariantKeys = Object.keys(skeletonVariantMap);

export function skeleton(props) {
  return createClassName(
    "seed-skeleton",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(skeleton, { splitVariantProps: (props) => splitVariantProps(props, skeletonVariantMap) });

// @recipe(seed): skeleton