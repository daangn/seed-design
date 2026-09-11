import './help-bubble.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const helpBubbleSlotNames = [
  [
    "positioner",
    "seed-help-bubble__positioner"
  ],
  [
    "content",
    "seed-help-bubble__content"
  ],
  [
    "arrow",
    "seed-help-bubble__arrow"
  ],
  [
    "arrowTip",
    "seed-help-bubble__arrowTip"
  ],
  [
    "body",
    "seed-help-bubble__body"
  ],
  [
    "title",
    "seed-help-bubble__title"
  ],
  [
    "description",
    "seed-help-bubble__description"
  ],
  [
    "closeButton",
    "seed-help-bubble__closeButton"
  ]
];

const defaultVariant = {
  "open": false,
  "positioned": false,
  "side": "top",
  "pressed": false
};

const compoundVariants = [
  {
    "positioned": false
  },
  {
    "open": true,
    "positioned": true
  }
];

export const helpBubbleVariantMap = {
  "open": [
    true,
    false
  ],
  "positioned": [
    true,
    false
  ],
  "side": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "pressed": [
    true,
    false
  ]
};

export const helpBubbleVariantKeys = Object.keys(helpBubbleVariantMap);

export function helpBubble(props) {
  return Object.fromEntries(
    helpBubbleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(helpBubble, { splitVariantProps: (props) => splitVariantProps(props, helpBubbleVariantMap) });

// @recipe(seed): help-bubble