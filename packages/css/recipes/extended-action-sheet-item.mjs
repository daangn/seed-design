import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const extendedActionSheetItemSlotNames = [
  [
    "root",
    "seed-extended-action-sheet-item__root"
  ]
];

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
  return Object.fromEntries(
    extendedActionSheetItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(extendedActionSheetItem, { splitVariantProps: (props) => splitVariantProps(props, extendedActionSheetItemVariantMap) });