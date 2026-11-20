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
  "skipAnimation": false,
  "size": "medium"
};

const compoundVariants = [];

export const dialogVariantMap = {
  "skipAnimation": [
    true,
    false
  ],
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const dialogSeedTagSpec = {
  name: "Dialog",
  axes: ["size"],
  defaults: { size: "medium" },
};
