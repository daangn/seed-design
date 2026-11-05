import './callout.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const calloutSlotNames = [
  [
    "root",
    "seed-callout__root"
  ],
  [
    "content",
    "seed-callout__content"
  ],
  [
    "title",
    "seed-callout__title"
  ],
  [
    "description",
    "seed-callout__description"
  ],
  [
    "link",
    "seed-callout__link"
  ],
  [
    "closeButton",
    "seed-callout__closeButton"
  ],
  [
    "prefixIcon",
    "seed-callout__prefixIcon"
  ],
  [
    "suffixIcon",
    "seed-callout__suffixIcon"
  ]
];

const defaultVariant = {
  "tone": "neutral",
  "pressed": false,
  "interactive": false
};

const compoundVariants = [
  {
    "tone": "neutral",
    "pressed": true
  },
  {
    "tone": "neutral",
    "interactive": true
  },
  {
    "tone": "informative",
    "pressed": true
  },
  {
    "tone": "informative",
    "interactive": true
  },
  {
    "tone": "positive",
    "pressed": true
  },
  {
    "tone": "positive",
    "interactive": true
  },
  {
    "tone": "warning",
    "pressed": true
  },
  {
    "tone": "warning",
    "interactive": true
  },
  {
    "tone": "critical",
    "pressed": true
  },
  {
    "tone": "critical",
    "interactive": true
  },
  {
    "tone": "magic",
    "pressed": true
  },
  {
    "tone": "magic",
    "interactive": true
  }
];

export const calloutVariantMap = {
  "tone": [
    "neutral",
    "informative",
    "positive",
    "warning",
    "critical",
    "magic"
  ],
  "pressed": [
    true,
    false
  ],
  "interactive": [
    true,
    false
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