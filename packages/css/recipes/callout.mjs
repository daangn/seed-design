import './callout.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const calloutSlotNames = [
  [
    "root",
    "ride-callout__root"
  ],
  [
    "content",
    "ride-callout__content"
  ],
  [
    "title",
    "ride-callout__title"
  ],
  [
    "description",
    "ride-callout__description"
  ],
  [
    "link",
    "ride-callout__link"
  ],
  [
    "closeButton",
    "ride-callout__closeButton"
  ]
];

const defaultVariant = {
  "tone": "neutral"
};

const compoundVariants = [];

export const calloutVariantMap = {
  "tone": [
    "neutral",
    "informative",
    "positive",
    "warning",
    "critical",
    "magic"
  ]
};

export const calloutVariantKeys = Object.keys(calloutVariantMap);

export function callout(props) {
  return Object.fromEntries(
    calloutSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(callout, { splitVariantProps: (props) => splitVariantProps(props, calloutVariantMap) });

// @recipe(seed): callout