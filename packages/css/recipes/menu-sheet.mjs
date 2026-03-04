import './menu-sheet.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuSheetSlotNames = [
  [
    "backdrop",
    "seed-menu-sheet__backdrop"
  ],
  [
    "positioner",
    "seed-menu-sheet__positioner"
  ],
  [
    "content",
    "seed-menu-sheet__content"
  ],
  [
    "header",
    "seed-menu-sheet__header"
  ],
  [
    "title",
    "seed-menu-sheet__title"
  ],
  [
    "description",
    "seed-menu-sheet__description"
  ],
  [
    "list",
    "seed-menu-sheet__list"
  ],
  [
    "group",
    "seed-menu-sheet__group"
  ],
  [
    "footer",
    "seed-menu-sheet__footer"
  ],
  [
    "closeButton",
    "seed-menu-sheet__closeButton"
  ]
];

const defaultVariant = {
  "skipAnimation": false
};

const compoundVariants = [];

export const menuSheetVariantMap = {
  "skipAnimation": [
    false
  ]
};

export const menuSheetVariantKeys = Object.keys(menuSheetVariantMap);

export function menuSheet(props) {
  return Object.fromEntries(
    menuSheetSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(menuSheet, { splitVariantProps: (props) => splitVariantProps(props, menuSheetVariantMap) });

// @recipe(seed): menu-sheet