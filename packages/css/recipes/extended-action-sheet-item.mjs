import './extended-action-sheet-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

export const extendedActionSheetItemVariantMap = {
  "tone": [
    "neutral",
    "critical"
  ]
};

export const extendedActionSheetItemVariantKeys = Object.keys(extendedActionSheetItemVariantMap);

export function extendedActionSheetItem(props) {
  return createClassName(
    "seed-extended-action-sheet-item",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(extendedActionSheetItem, { splitVariantProps: (props) => splitVariantProps(props, extendedActionSheetItemVariantMap) });

// @recipe(seed): extended-action-sheet-item