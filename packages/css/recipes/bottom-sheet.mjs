import './bottom-sheet.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const bottomSheetSlotNames = [
  [
    "positioner",
    "seed-bottom-sheet__positioner"
  ],
  [
    "backdrop",
    "seed-bottom-sheet__backdrop"
  ],
  [
    "content",
    "seed-bottom-sheet__content"
  ],
  [
    "header",
    "seed-bottom-sheet__header"
  ],
  [
    "body",
    "seed-bottom-sheet__body"
  ],
  [
    "footer",
    "seed-bottom-sheet__footer"
  ],
  [
    "title",
    "seed-bottom-sheet__title"
  ],
  [
    "description",
    "seed-bottom-sheet__description"
  ],
  [
    "closeButton",
    "seed-bottom-sheet__closeButton"
  ]
];

const defaultVariant = {
  "headerAlign": "left",
  "skipAnimation": false,
  "showCloseButton": true
};

const compoundVariants = [
  {
    "headerAlign": "left",
    "showCloseButton": false
  },
  {
    "headerAlign": "center",
    "showCloseButton": false
  }
];

export const bottomSheetVariantMap = {
  "headerAlign": [
    "left",
    "center"
  ],
  "skipAnimation": [
    false
  ],
  "showCloseButton": [
    true,
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