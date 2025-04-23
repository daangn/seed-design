import './extended-action-sheet.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const extendedActionSheetSlotNames = [
  [
    "backdrop",
    "seed-extended-action-sheet__backdrop"
  ],
  [
    "positioner",
    "seed-extended-action-sheet__positioner"
  ],
  [
    "content",
    "seed-extended-action-sheet__content"
  ],
  [
    "header",
    "seed-extended-action-sheet__header"
  ],
  [
    "title",
    "seed-extended-action-sheet__title"
  ],
  [
    "list",
    "seed-extended-action-sheet__list"
  ],
  [
    "group",
    "seed-extended-action-sheet__group"
  ],
  [
    "footer",
    "seed-extended-action-sheet__footer"
  ],
  [
    "closeButton",
    "seed-extended-action-sheet__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const extendedActionSheetVariantMap = {};

export const extendedActionSheetVariantKeys = Object.keys(extendedActionSheetVariantMap);

export function extendedActionSheet(props) {
  return Object.fromEntries(
    extendedActionSheetSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(extendedActionSheet, { splitVariantProps: (props) => splitVariantProps(props, extendedActionSheetVariantMap) });

// @recipe(seed): extended-action-sheet