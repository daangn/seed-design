import './header-action-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const headerActionButtonVariantMap = {
  "size": [
    "medium",
    "small"
  ]
};

export const headerActionButtonVariantKeys = Object.keys(headerActionButtonVariantMap);

export function headerActionButton(props) {
  return createClassName(
    "seed-header-action-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(headerActionButton, { splitVariantProps: (props) => splitVariantProps(props, headerActionButtonVariantMap) });

// @recipe(seed): header-action-button