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
  ],
  [
    "divider",
    "seed-menu__divider"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const menuVariantMap = {
  "size": [
    "medium",
    "small"
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