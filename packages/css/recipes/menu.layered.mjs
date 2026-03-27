import './menu.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
    "group",
    "seed-menu__group"
  ],
  [
    "groupHeader",
    "seed-menu__groupHeader"
  ],
  [
    "item",
    "seed-menu__item"
  ],
  [
    "itemLabel",
    "seed-menu__itemLabel"
  ],
  [
    "divider",
    "seed-menu__divider"
  ]
];

const defaultVariant = {
  "size": "small"
};

const compoundVariants = [];

export const menuVariantMap = {
  "size": [
    "small",
    "medium"
  ]
};

export const menuVariantKeys = Object.keys(menuVariantMap);

export function menu(props) {
  return Object.fromEntries(
    menuSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(menu, { splitVariantProps: (props) => splitVariantProps(props, menuVariantMap) });

// @recipe(seed): menu