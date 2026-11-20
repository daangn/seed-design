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
    "scrollArea",
    "seed-alert-dialog__scrollArea"
  ],
  [
    "scrollContent",
    "seed-alert-dialog__scrollContent"
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const alertDialogSeedTagSpec = {
  name: "AlertDialog",
  axes: [],
  defaults: {},
};
