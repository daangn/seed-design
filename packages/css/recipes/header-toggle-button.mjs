import './header-toggle-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const headerToggleButtonVariantMap = {
  "size": [
    "medium",
    "small"
  ]
};

export const headerToggleButtonVariantKeys = Object.keys(headerToggleButtonVariantMap);

export function headerToggleButton(props) {
  return createClassName(
    "seed-header-toggle-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(headerToggleButton, { splitVariantProps: (props) => splitVariantProps(props, headerToggleButtonVariantMap) });

// @recipe(seed): header-toggle-button