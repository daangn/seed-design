import './menu-item.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuItemSlotNames = [
  [
    "root",
    "seed-menu-item__root"
  ],
  [
    "pressedOverlay",
    "seed-menu-item__pressedOverlay"
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
  ],
  [
    "prefixIcon",
    "seed-menu-item__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-menu-item__suffixIcon"
  ]
];

const defaultVariant = {
  "size": "medium",
  "tone": "neutral",
  "disabled": false,
  "pressed": false
};

const compoundVariants = [
  {
    "tone": "neutral",
    "disabled": false
  },
  {
    "tone": "critical",
    "disabled": false
  },
  {
    "pressed": true,
    "disabled": false
  }
];

export const menuItemVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "tone": [
    "neutral",
    "critical"
  ],
  "disabled": [
    true,
    false
  ],
  "pressed": [
    true,
    false
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