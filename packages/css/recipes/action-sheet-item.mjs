import './action-sheet-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

export const actionSheetItemVariantMap = {
  "tone": [
    "neutral",
    "critical"
  ]
};

export const actionSheetItemVariantKeys = Object.keys(actionSheetItemVariantMap);

export function actionSheetItem(props) {
  return createClassName(
    "seed-action-sheet-item",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(actionSheetItem, { splitVariantProps: (props) => splitVariantProps(props, actionSheetItemVariantMap) });

// @recipe(seed): action-sheet-item