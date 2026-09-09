import './menu.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuSlotNames = [
  [
    "positioner",
    "seed-menu__positioner"
  ],
  [
    "backdrop",
    "seed-menu__backdrop"
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
    "scrollContent",
    "seed-menu__scrollContent"
  ],
  [
    "group",
    "seed-menu__group"
  ],
  [
    "groupLabel",
    "seed-menu__groupLabel"
  ],
  [
    "separator",
    "seed-menu__separator"
  ]
];

const defaultVariant = {
  "size": "medium",
  "open": false,
  "positioned": false
};

const compoundVariants = [
  {
    "positioned": false
  },
  {
    "open": true,
    "positioned": true
  }
];

export const menuVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "open": [
    true,
    false
  ],
  "positioned": [
    true,
    false
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