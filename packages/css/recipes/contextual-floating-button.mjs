import './contextual-floating-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "variant": "solid",
  "layout": "withText"
};

const compoundVariants = [];

export const contextualFloatingButtonVariantMap = {
  "variant": [
    "solid",
    "layer"
  ],
  "layout": [
    "withText",
    "iconOnly"
  ]
};

export const contextualFloatingButtonVariantKeys = Object.keys(contextualFloatingButtonVariantMap);

export function contextualFloatingButton(props) {
  return createClassName(
    "seed-contextual-floating-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(contextualFloatingButton, { splitVariantProps: (props) => splitVariantProps(props, contextualFloatingButtonVariantMap) });

// @recipe(seed): contextual-floating-button