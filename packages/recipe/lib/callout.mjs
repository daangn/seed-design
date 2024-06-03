import { createClassName } from "./className.mjs";

const calloutSlotNames = [
  [
    "root",
    "callout__root"
  ],
  [
    "icon",
    "callout__icon"
  ],
  [
    "content",
    "callout__content"
  ],
  [
    "title",
    "callout__title"
  ],
  [
    "description",
    "callout__description"
  ],
  [
    "actionIndicator",
    "callout__actionIndicator"
  ],
  [
    "closeButton",
    "callout__closeButton"
  ]
];

const defaultVariant = {};

const compoundVariants = [];

export const calloutVariantMap = {
  "variant": [
    "outline",
    "neutral",
    "informative",
    "warning",
    "danger"
  ]
};

export const calloutVariantKeys = Object.keys(calloutVariantMap);

export function callout(props) {
  return Object.fromEntries(
    calloutSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, { ...defaultVariant, ...props }, compoundVariants),
      ];
    }),
  );
}