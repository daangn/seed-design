import './menu-sheet-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuSheetItemSlotNames = [
  [
    "root",
    "seed-menu-sheet-item__root"
  ],
  [
    "content",
    "seed-menu-sheet-item__content"
  ],
  [
    "label",
    "seed-menu-sheet-item__label"
  ],
  [
    "description",
    "seed-menu-sheet-item__description"
  ],
  [
    "prefixIcon",
    "seed-menu-sheet-item__prefixIcon"
  ],
  [
    "divider",
    "seed-menu-sheet-item__divider"
  ]
];

const defaultVariant = {
  "tone": "neutral",
  "labelAlign": "left",
  "pressed": false
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
  ],
  "pressed": [
    true,
    false
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