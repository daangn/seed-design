import './badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const badgeSlotNames = [
  [
    "root",
    "seed-badge__root"
  ],
  [
    "prefix",
    "seed-badge__prefix"
  ],
  [
    "label",
    "seed-badge__label"
  ],
  [
    "action",
    "seed-badge__action"
  ]
];

const defaultVariant = {
  "size": "medium",
  "variant": "solid",
  "tone": "neutral",
  "pressed": false
};

const compoundVariants = [
  {
    "tone": "neutral",
    "variant": "weak"
  },
  {
    "tone": "neutral",
    "variant": "solid"
  },
  {
    "tone": "neutral",
    "variant": "outline"
  },
  {
    "tone": "brand",
    "variant": "weak"
  },
  {
    "tone": "brand",
    "variant": "solid"
  },
  {
    "tone": "brand",
    "variant": "outline"
  },
  {
    "tone": "informative",
    "variant": "weak"
  },
  {
    "tone": "informative",
    "variant": "solid"
  },
  {
    "tone": "informative",
    "variant": "outline"
  },
  {
    "tone": "positive",
    "variant": "weak"
  },
  {
    "tone": "positive",
    "variant": "solid"
  },
  {
    "tone": "positive",
    "variant": "outline"
  },
  {
    "tone": "warning",
    "variant": "weak"
  },
  {
    "tone": "warning",
    "variant": "solid"
  },
  {
    "tone": "warning",
    "variant": "outline"
  },
  {
    "tone": "critical",
    "variant": "weak"
  },
  {
    "tone": "critical",
    "variant": "solid"
  },
  {
    "tone": "critical",
    "variant": "outline"
  },
  {
    "size": "medium",
    "pressed": true
  },
  {
    "size": "large",
    "pressed": true
  }
];

export const badgeVariantMap = {
  "size": [
    "medium",
    "large"
  ],
  "variant": [
    "weak",
    "solid",
    "outline"
  ],
  "tone": [
    "neutral",
    "brand",
    "informative",
    "positive",
    "warning",
    "critical"
  ],
  "pressed": [
    true,
    false
  ]
};

export const badgeVariantKeys = Object.keys(badgeVariantMap);

export function badge(props) {
  return Object.fromEntries(
    badgeSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(badge, { splitVariantProps: (props) => splitVariantProps(props, badgeVariantMap) });

// @recipe(seed): badge