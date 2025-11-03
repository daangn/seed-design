import './field-label.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "weight": "medium"
};

const compoundVariants = [];

export const fieldLabelVariantMap = {
  "weight": [
    "medium",
    "bold"
  ]
};

export const fieldLabelVariantKeys = Object.keys(fieldLabelVariantMap);

export function fieldLabel(props) {
  return createClassName(
    "seed-field-label",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(fieldLabel, { splitVariantProps: (props) => splitVariantProps(props, fieldLabelVariantMap) });

// @recipe(seed): field-label