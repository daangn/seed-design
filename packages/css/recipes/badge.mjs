import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const badgeSlotNames = [
  [
    "root",
    "seed-badge__root"
  ]
];

const defaultVariant = {
  "size": "medium",
  "shape": "rectangle",
  "variant": "solid",
  "tone": "neutral"
};

const compoundVariants = [
  {
    "shape": "rectangle",
    "size": "medium"
  },
  {
    "shape": "rectangle",
    "size": "large"
  },
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
  "shape": [
    "rectangle",
    "pill"
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