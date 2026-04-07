import './extended-action-sheet.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const extendedActionSheetSlotNames = [
  [
    "backdrop",
    "ride-extended-action-sheet__backdrop"
  ],
  [
    "positioner",
    "ride-extended-action-sheet__positioner"
  ],
  [
    "content",
    "ride-extended-action-sheet__content"
  ],
  [
    "header",
    "ride-extended-action-sheet__header"
  ],
  [
    "title",
    "ride-extended-action-sheet__title"
  ],
  [
    "list",
    "ride-extended-action-sheet__list"
  ],
  [
    "group",
    "ride-extended-action-sheet__group"
  ],
  [
    "footer",
    "ride-extended-action-sheet__footer"
  ],
  [
    "closeButton",
    "ride-extended-action-sheet__closeButton"
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