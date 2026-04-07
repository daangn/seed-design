import './aspect-ratio.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const aspectRatioVariantMap = {};

export const aspectRatioVariantKeys = Object.keys(aspectRatioVariantMap);

export function aspectRatio(props) {
  return createClassName(
    "ride-aspect-ratio",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(aspectRatio, { splitVariantProps: (props) => splitVariantProps(props, aspectRatioVariantMap) });

// @recipe(seed): aspect-ratio