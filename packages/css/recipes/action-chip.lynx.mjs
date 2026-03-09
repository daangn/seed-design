import './action-chip.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const actionChipSlotNames = [
  [
    "root",
    "seed-action-chip"
  ],
  [
    "text",
    "seed-action-chip__text"
  ]
];

const defaultVariant = {
  "size": "medium",
  "layout": "withText"
};

const compoundVariants = [
  {
    "size": "medium",
    "layout": "withText"
  },
  {
    "size": "medium",
    "layout": "iconOnly"
  },
  {
    "size": "small",
    "layout": "withText"
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
    "withText",
    "iconOnly"
  ]
};

export const actionChipVariantKeys = Object.keys(actionChipVariantMap);

export function actionChip(props) {
  return Object.fromEntries(
    actionChipSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(actionChip, { splitVariantProps: (props) => splitVariantProps(props, actionChipVariantMap) });

// @recipe(seed): action-chip