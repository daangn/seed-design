import './badge.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

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
    "critical"
  ]
};

export const badgeVariantKeys = Object.keys(badgeVariantMap);

export function badge(props) {
  return createClassName(
    "seed-badge",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(badge, { splitVariantProps: (props) => splitVariantProps(props, badgeVariantMap) });

// @recipe(seed): badge