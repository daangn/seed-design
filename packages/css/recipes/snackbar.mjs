import './snackbar.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const snackbarSlotNames = [
  [
    "root",
    "seed-snackbar__root"
  ],
  [
    "message",
    "seed-snackbar__message"
  ],
  [
    "prefixIcon",
    "seed-snackbar__prefixIcon"
  ],
  [
    "actionButton",
    "seed-snackbar__actionButton"
  ],
  [
    "content",
    "seed-snackbar__content"
  ]
];

const defaultVariant = {
  "variant": "default"
};

const compoundVariants = [];

export const snackbarVariantMap = {
  "variant": [
    "default",
    "positive",
    "critical"
  ]
};

export const snackbarVariantKeys = Object.keys(snackbarVariantMap);

export function snackbar(props) {
  return Object.fromEntries(
    snackbarSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(snackbar, { splitVariantProps: (props) => splitVariantProps(props, snackbarVariantMap) });

// @recipe(seed): snackbar