import './menu-sheet.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const menuSheetSlotNames = [
  [
    "backdrop",
    "ride-menu-sheet__backdrop"
  ],
  [
    "positioner",
    "ride-menu-sheet__positioner"
  ],
  [
    "content",
    "ride-menu-sheet__content"
  ],
  [
    "header",
    "ride-menu-sheet__header"
  ],
  [
    "title",
    "ride-menu-sheet__title"
  ],
  [
    "description",
    "ride-menu-sheet__description"
  ],
  [
    "list",
    "ride-menu-sheet__list"
  ],
  [
    "group",
    "ride-menu-sheet__group"
  ],
  [
    "footer",
    "ride-menu-sheet__footer"
  ],
  [
    "closeButton",
    "ride-menu-sheet__closeButton"
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