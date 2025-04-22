import './action-sheet.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const actionSheetSlotNames = [
  [
    "backdrop",
    "seed-action-sheet__backdrop"
  ],
  [
    "positioner",
    "seed-action-sheet__positioner"
  ],
  [
    "content",
    "seed-action-sheet__content"
  ],
  [
    "header",
    "seed-action-sheet__header"
  ],
  [
    "title",
    "seed-action-sheet__title"
  ],
  [
    "description",
    "seed-action-sheet__description"
  ],
  [
    "list",
    "seed-action-sheet__list"
  ],
  [
    "closeButton",
    "seed-action-sheet__closeButton"
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