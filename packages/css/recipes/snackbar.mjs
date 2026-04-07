import './snackbar.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const snackbarSlotNames = [
  [
    "root",
    "ride-snackbar__root"
  ],
  [
    "message",
    "ride-snackbar__message"
  ],
  [
    "prefixIcon",
    "ride-snackbar__prefixIcon"
  ],
  [
    "actionButton",
    "ride-snackbar__actionButton"
  ],
  [
    "content",
    "ride-snackbar__content"
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