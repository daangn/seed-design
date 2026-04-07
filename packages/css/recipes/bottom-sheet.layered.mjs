import './bottom-sheet.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const bottomSheetSlotNames = [
  [
    "positioner",
    "ride-bottom-sheet__positioner"
  ],
  [
    "backdrop",
    "ride-bottom-sheet__backdrop"
  ],
  [
    "content",
    "ride-bottom-sheet__content"
  ],
  [
    "header",
    "ride-bottom-sheet__header"
  ],
  [
    "body",
    "ride-bottom-sheet__body"
  ],
  [
    "footer",
    "ride-bottom-sheet__footer"
  ],
  [
    "title",
    "ride-bottom-sheet__title"
  ],
  [
    "description",
    "ride-bottom-sheet__description"
  ],
  [
    "closeButton",
    "ride-bottom-sheet__closeButton"
  ]
];

const defaultVariant = {
  "headerAlign": "left",
  "skipAnimation": false
};

const compoundVariants = [];

export const bottomSheetVariantMap = {
  "headerAlign": [
    "left",
    "center"
  ],
  "skipAnimation": [
    false
  ]
};

export const bottomSheetVariantKeys = Object.keys(bottomSheetVariantMap);

export function bottomSheet(props) {
  return Object.fromEntries(
    bottomSheetSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(bottomSheet, { splitVariantProps: (props) => splitVariantProps(props, bottomSheetVariantMap) });

// @recipe(seed): bottom-sheet