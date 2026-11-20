import './help-bubble.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const helpBubbleSlotNames = [
  [
    "positioner",
    "seed-help-bubble__positioner"
  ],
  [
    "motion",
    "seed-help-bubble__motion"
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
  ],
  [
    "closeButtonContent",
    "seed-help-bubble__closeButtonContent"
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

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export const helpBubbleSeedTagSpec = {
  name: "HelpBubble",
  axes: [],
  defaults: {},
};
