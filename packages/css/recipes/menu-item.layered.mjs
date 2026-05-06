import './menu-item.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuItemSlotNames = [
  [
    "root",
    "seed-menu-item__root"
  ],
  [
    "body",
    "seed-menu-item__body"
  ],
  [
    "label",
    "seed-menu-item__label"
  ],
  [
    "description",
    "seed-menu-item__description"
  ]
];

const defaultVariant = {
  "size": "medium",
  "tone": "neutral"
};

const compoundVariants = [];

export const menuItemVariantMap = {
  "size": [
    "medium",
    "small",
    "responsive"
  ],
  "tone": [
    "neutral",
    "critical"
  ]
};

export const menuItemVariantKeys = Object.keys(menuItemVariantMap);

export function menuItem(props) {
  return Object.fromEntries(
    menuItemSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(menuItem, { splitVariantProps: (props) => splitVariantProps(props, menuItemVariantMap) });

// @recipe(seed): menu-item