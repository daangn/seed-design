import './badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const badgeSlotNames = [
  [
    "root",
    "seed-badge__root"
  ],
  [
    "label",
    "seed-badge__label"
  ]
];

const defaultVariant = {
  "size": "medium",
  "variant": "solid",
  "tone": "neutral"
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