import './reaction-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "small"
};

const compoundVariants = [];

export const reactionButtonVariantMap = {
  "size": [
    "xsmall",
    "small"
  ]
};

export const reactionButtonVariantKeys = Object.keys(reactionButtonVariantMap);

export function reactionButton(props) {
  return createClassName(
    "seed-reaction-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(reactionButton, { splitVariantProps: (props) => splitVariantProps(props, reactionButtonVariantMap) });

// @recipe(seed): reaction-button