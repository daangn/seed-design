import './floating-action-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const floatingActionButtonSlotNames = [
  [
    "root",
    "seed-floating-action-button__root"
  ],
  [
    "icon",
    "seed-floating-action-button__icon"
  ],
  [
    "label",
    "seed-floating-action-button__label"
  ]
];

const defaultVariant = {
  "extended": true
};

const compoundVariants = [];

export const floatingActionButtonVariantMap = {
  "extended": [
    true,
    false
  ]
};

export const floatingActionButtonVariantKeys = Object.keys(floatingActionButtonVariantMap);

export function floatingActionButton(props) {
  return Object.fromEntries(
    floatingActionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(floatingActionButton, { splitVariantProps: (props) => splitVariantProps(props, floatingActionButtonVariantMap) });

// @recipe(seed): floating-action-button