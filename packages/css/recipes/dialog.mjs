import './dialog.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const dialogSlotNames = [
  [
    "positioner",
    "ride-dialog__positioner"
  ],
  [
    "backdrop",
    "ride-dialog__backdrop"
  ],
  [
    "content",
    "ride-dialog__content"
  ],
  [
    "header",
    "ride-dialog__header"
  ],
  [
    "footer",
    "ride-dialog__footer"
  ],
  [
    "action",
    "ride-dialog__action"
  ],
  [
    "title",
    "ride-dialog__title"
  ],
  [
    "description",
    "ride-dialog__description"
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