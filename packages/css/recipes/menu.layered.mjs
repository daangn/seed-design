import './menu.layered.css';
import { createSlots, splitVariantProps } from "./shared.mjs";

const menuSlotNames = [
  [
    "positioner",
    "seed-menu__positioner"
  ],
  [
    "content",
    "seed-menu__content"
  ],
  [
    "scrollArea",
    "seed-menu__scrollArea"
  ],
  [
    "group",
    "seed-menu__group"
  ],
  [
    "groupLabel",
    "seed-menu__groupLabel"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const menuVariantMap = {
  "size": [
    "medium",
    "small",
    "responsive"
  ]
};

export const menuVariantKeys = Object.keys(menuVariantMap);

export function menu(props) {
  return createSlots(menuSlotNames, defaultVariant, compoundVariants, props);
}

Object.assign(menu, { splitVariantProps: (props) => splitVariantProps(props, menuVariantMap) });

// @recipe(seed): menu