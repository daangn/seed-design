import './menu-sheet-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "tone": "neutral",
  "labelAlign": "left"
};

const compoundVariants = [];

export const menuSheetItemVariantMap = {
  "tone": [
    "neutral",
    "critical"
  ],
  "labelAlign": [
    "left",
    "center"
  ]
};

export const menuSheetItemVariantKeys = Object.keys(menuSheetItemVariantMap);

export function menuSheetItem(props) {
  return createClassName(
    "seed-menu-sheet-item",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(menuSheetItem, { splitVariantProps: (props) => splitVariantProps(props, menuSheetItemVariantMap) });

// @recipe(seed): menu-sheet-item