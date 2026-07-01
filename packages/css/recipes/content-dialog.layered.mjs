import './content-dialog.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const contentDialogSlotNames = [
  [
    "positioner",
    "seed-content-dialog__positioner"
  ],
  [
    "backdrop",
    "seed-content-dialog__backdrop"
  ],
  [
    "content",
    "seed-content-dialog__content"
  ],
  [
    "header",
    "seed-content-dialog__header"
  ],
  [
    "body",
    "seed-content-dialog__body"
  ],
  [
    "footer",
    "seed-content-dialog__footer"
  ],
  [
    "action",
    "seed-content-dialog__action"
  ],
  [
    "title",
    "seed-content-dialog__title"
  ],
  [
    "description",
    "seed-content-dialog__description"
  ],
  [
    "closeButton",
    "seed-content-dialog__closeButton"
  ]
];

const defaultVariant = {
  "size": "medium"
};

const compoundVariants = [];

export const contentDialogVariantMap = {
  "size": [
    "medium",
    "large"
  ]
};

export const contentDialogVariantKeys = Object.keys(contentDialogVariantMap);

export function contentDialog(props) {
  return Object.fromEntries(
    contentDialogSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(contentDialog, { splitVariantProps: (props) => splitVariantProps(props, contentDialogVariantMap) });

// @recipe(seed): content-dialog