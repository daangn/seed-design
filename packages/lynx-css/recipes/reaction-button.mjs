import './reaction-button.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const reactionButtonSlotNames = [
  [
    "root",
    "seed-reaction-button__root"
  ],
  [
    "content",
    "seed-reaction-button__content"
  ],
  [
    "label",
    "seed-reaction-button__label"
  ],
  [
    "count",
    "seed-reaction-button__count"
  ],
  [
    "prefixIcon",
    "seed-reaction-button__prefixIcon"
  ],
  [
    "loadingIndicator",
    "seed-reaction-button__loadingIndicator"
  ]
];

const defaultVariant = {
  "size": "small",
  "selected": false,
  "pressed": false,
  "disabled": false,
  "loading": false
};

const compoundVariants = [
  {
    "selected": true,
    "pressed": true
  },
  {
    "size": "xsmall",
    "pressed": true
  },
  {
    "size": "small",
    "pressed": true
  },
  {
    "selected": true,
    "pressed": false,
    "loading": false
  },
  {
    "selected": true,
    "loading": true
  }
];

export const reactionButtonVariantMap = {
  "size": [
    "xsmall",
    "small"
  ],
  "selected": [
    true,
    false
  ],
  "pressed": [
    true,
    false
  ],
  "disabled": [
    true,
    false
  ],
  "loading": [
    true,
    false
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