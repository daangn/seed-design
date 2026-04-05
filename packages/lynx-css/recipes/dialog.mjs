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
    "footer",
    "seed-dialog__footer"
  ],
  [
    "action",
    "seed-dialog__action"
  ],
  [
    "title",
    "seed-dialog__title"
  ],
  [
    "description",
    "seed-dialog__description"
  ]
];

const defaultVariant = {
  "skipAnimation": false
};

const compoundVariants = [];

export const dialogVariantMap = {
  "skipAnimation": [
    false
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