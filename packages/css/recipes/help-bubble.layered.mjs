import './help-bubble.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const helpBubbleSlotNames = [
  [
    "positioner",
    "ride-help-bubble__positioner"
  ],
  [
    "content",
    "ride-help-bubble__content"
  ],
  [
    "arrow",
    "ride-help-bubble__arrow"
  ],
  [
    "arrowTip",
    "ride-help-bubble__arrowTip"
  ],
  [
    "body",
    "ride-help-bubble__body"
  ],
  [
    "title",
    "ride-help-bubble__title"
  ],
  [
    "description",
    "ride-help-bubble__description"
  ],
  [
    "closeButton",
    "ride-help-bubble__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const helpBubbleVariantMap = {};

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