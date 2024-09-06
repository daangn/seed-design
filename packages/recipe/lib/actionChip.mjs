import { createClassName } from "./className.mjs";

const actionChipSlotNames = [
  [
    "root",
    "actionChip__root"
  ],
  [
    "label",
    "actionChip__label"
  ],
  [
    "prefix",
    "actionChip__prefix"
  ],
  [
    "suffix",
    "actionChip__suffix"
  ],
  [
    "count",
    "actionChip__count"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const actionChipVariantMap = {
  "size": [
    "medium",
    "small"
  ]
};

export const actionChipVariantKeys = Object.keys(actionChipVariantMap);

export function actionChip(props) {
  return Object.fromEntries(
    actionChipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}