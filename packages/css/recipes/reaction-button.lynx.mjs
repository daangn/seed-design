import './reaction-button.lynx.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const reactionButtonSlotNames = [
  [
    "root",
    "seed-reaction-button"
  ],
  [
    "text",
    "seed-reaction-button__text"
  ]
];

const defaultVariant = {
  "size": "small"
};

const compoundVariants = [];

export const reactionButtonVariantMap = {
  "size": [
    "xsmall",
    "small"
  ],
  "disabled": [
    true
  ],
  "loading": [
    true
  ]
};

export const reactionButtonVariantKeys = Object.keys(reactionButtonVariantMap);

export function reactionButton(props) {
  return Object.fromEntries(
    reactionButtonSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(reactionButton, { splitVariantProps: (props) => splitVariantProps(props, reactionButtonVariantMap) });

// @recipe(seed): reaction-button