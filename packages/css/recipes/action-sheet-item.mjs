import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const actionSheetItemSlotNames = [
  [
    "root",
    "seed-action-sheet-item__root"
  ]
];

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
  return Object.fromEntries(
    actionSheetItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(actionSheetItem, { splitVariantProps: (props) => splitVariantProps(props, actionSheetItemVariantMap) });

// @recipe(seed): action-sheet-item