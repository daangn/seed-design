import './menu-sheet-item.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

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
  return createSlots(menuSheetItemSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(menuSheetItem, { splitVariantProps: (props) => splitVariantProps(props, menuSheetItemVariantMap) });

// @recipe(seed): menu-sheet-item