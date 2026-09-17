import './dialog.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const dialogSlotNames = [
  [
    "positioner",
    "seed-dialog__positioner"
  ],
  [
    "backdrop",
    "seed-dialog__backdrop"
  ],
  [
    "content",
    "seed-dialog__content"
  ],
  [
    "header",
    "seed-dialog__header"
  ],
  [
    "body",
    "seed-dialog__body"
  ],
  [
    "footer",
    "seed-dialog__footer"
  ],
  [
    "title",
    "seed-dialog__title"
  ],
  [
    "description",
    "seed-dialog__description"
  ],
  [
    "closeButton",
    "seed-dialog__closeButton"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const dialogVariantMap = {
  "size": [
    "medium",
    "large"
  ]
};

export const dialogVariantKeys = Object.keys(dialogVariantMap);

export function dialog(props) {
  return Object.fromEntries(
    dialogSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(dialog, { splitVariantProps: (props) => splitVariantProps(props, dialogVariantMap) });

// @recipe(seed): dialog