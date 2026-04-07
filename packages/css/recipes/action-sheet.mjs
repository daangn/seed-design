import './action-sheet.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const actionSheetSlotNames = [
  [
    "backdrop",
    "ride-action-sheet__backdrop"
  ],
  [
    "positioner",
    "ride-action-sheet__positioner"
  ],
  [
    "content",
    "ride-action-sheet__content"
  ],
  [
    "header",
    "ride-action-sheet__header"
  ],
  [
    "title",
    "ride-action-sheet__title"
  ],
  [
    "description",
    "ride-action-sheet__description"
  ],
  [
    "list",
    "ride-action-sheet__list"
  ],
  [
    "closeButton",
    "ride-action-sheet__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const actionSheetVariantMap = {};

export const actionSheetVariantKeys = Object.keys(actionSheetVariantMap);

export function actionSheet(props) {
  return Object.fromEntries(
    actionSheetSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(actionSheet, { splitVariantProps: (props) => splitVariantProps(props, actionSheetVariantMap) });

// @recipe(seed): action-sheet