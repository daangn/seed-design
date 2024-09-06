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
    "icon",
    "actionChip__icon"
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

const compoundVariants = [
  {
    "size": "medium",
    "layout": "text"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "small",
    "layout": "text"
  },
  {
    "size": "small",
    "layout": "iconOnly"
  }
];

export const actionChipVariantMap = {
  "size": [
    "medium",
    "small"
  ],
  "layout": [
    "text",
    "iconOnly"
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