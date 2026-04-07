import './menu-sheet-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuSheetItemSlotNames = [
  [
    "root",
    "ride-menu-sheet-item__root"
  ],
  [
    "content",
    "ride-menu-sheet-item__content"
  ],
  [
    "label",
    "ride-menu-sheet-item__label"
  ],
  [
    "description",
    "ride-menu-sheet-item__description"
  ]
];

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
  return Object.fromEntries(
    menuSheetItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(menuSheetItem, { splitVariantProps: (props) => splitVariantProps(props, menuSheetItemVariantMap) });

// @recipe(seed): menu-sheet-item