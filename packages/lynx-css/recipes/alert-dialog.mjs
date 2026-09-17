import './alert-dialog.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const alertDialogSlotNames = [
  [
    "positioner",
    "seed-alert-dialog__positioner"
  ],
  [
    "backdrop",
    "seed-alert-dialog__backdrop"
  ],
  [
    "content",
    "seed-alert-dialog__content"
  ],
  [
    "header",
    "seed-alert-dialog__header"
  ],
  [
    "footer",
    "seed-alert-dialog__footer"
  ],
  [
    "action",
    "seed-alert-dialog__action"
  ],
  [
    "title",
    "seed-alert-dialog__title"
  ],
  [
    "description",
    "seed-alert-dialog__description"
  ]
];

const defaultVariant = {
  "skipAnimation": false
};

const compoundVariants = [];

export const alertDialogVariantMap = {
  "skipAnimation": [
    true,
    false
  ]
};

export const alertDialogVariantKeys = Object.keys(alertDialogVariantMap);

export function alertDialog(props) {
  return Object.fromEntries(
    alertDialogSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(alertDialog, { splitVariantProps: (props) => splitVariantProps(props, alertDialogVariantMap) });

// @recipe(seed): alert-dialog